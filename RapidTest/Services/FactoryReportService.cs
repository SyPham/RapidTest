using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using NetUtility;
using RapidTest.Constants;
using RapidTest.Data;
using RapidTest.DTO;
using RapidTest.Helpers;
using RapidTest.Models;
using RapidTest.Services.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace RapidTest.Services
{
    public interface IFactoryReportService : IServiceBase<FactoryReport, FactoryReportDto>
    {
        Task<OperationResult> AccessControl(string code);
        Task<List<FactoryReportDto>> Filter(DateTime startDate, DateTime endDate, string code);
        Task<object> CountWorkerScanQRCodeByToday();

    }
    public class FactoryReportService : ServiceBase<FactoryReport, FactoryReportDto>, IFactoryReportService
    {
        private readonly IRepositoryBase<FactoryReport> _repo;
        private readonly IRepositoryBase<BlackList> _repoBlackList;
        private readonly IRepositoryBase<Setting> _repoSetting;
        private readonly IRepositoryBase<Report> _repoReport;
        private readonly IRepositoryBase<Employee> _repoEmployee;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private OperationResult operationResult;

        public FactoryReportService(
            IRepositoryBase<FactoryReport> repo,
            IRepositoryBase<BlackList> repoBlackList,
            IRepositoryBase<Setting> repoSetting,
            IRepositoryBase<Report> repoReport,
            IRepositoryBase<Employee> repoEmployee,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            MapperConfiguration configMapper
            )
            : base(repo, unitOfWork, mapper, configMapper)
        {
            _repo = repo;
            _repoBlackList = repoBlackList;
            _repoSetting = repoSetting;
            _repoReport = repoReport;
            _repoEmployee = repoEmployee;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configMapper = configMapper;
        }
        public async Task<List<FactoryReportDto>> Filter(DateTime startDate, DateTime endDate, string code)
        {
            var setting = await _repoSetting.FindAll(x =>  x.SettingType == SettingType.ACCESS_DAY).FirstOrDefaultAsync();
            var daySetting = setting.Day;
            if (string.IsNullOrEmpty(code))
            {

                var data = (await _repo.FindAll(x => !x.IsDelete && x.FactoryEntryTime.Date == startDate.Date)
                    .ProjectTo<FactoryReportDto>(_configMapper).OrderByDescending(a => a.Id).ToListAsync()).DistinctBy(x => new { x.Code, x.CreatedTime }).ToList();

                return data;
            }

            else
            {
                var data = (await _repo.FindAll(x => !x.IsDelete && x.FactoryEntryTime.Date == startDate.Date && x.Employee.Code.Contains(code))
              .ProjectTo<FactoryReportDto>(_configMapper).OrderByDescending(a => a.Id).ToListAsync()).DistinctBy(x => new { x.Code, x.CreatedTime }).ToList();

                return data;
            }
        }
        public async Task<OperationResult> AccessControl(string code)
        {
            var employee = await _repoEmployee.FindAll(x => x.Code == code).FirstOrDefaultAsync();
            if (employee == null)
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.Forbidden,
                    Message = "<h2>Not found this person. No entry.Please establish data in Staff info page!<br>Không tìm thấy anh/chị trong hệ thống! Không được vào!</h2>",
                    Success = true,
                    Data = null
                };
            var checkBlackList = await _repoBlackList.FindAll(x => x.EmployeeId == employee.Id && !x.IsDelete).AnyAsync();

            if (checkBlackList)
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.Forbidden,
                    Message = $"<h2>This person is in SEA blacklist , do not allow him or her pass this station<br>Người này nằm trong danh sách đen của nhân sự, không được để anh ấy hoặc cô ấy đi qua chốt này</h2>",
                    Success = true,
                    Data = null
                };

            var testing = await _repoReport.FindAll(x => x.EmployeeId == employee.Id && !x.IsDelete).OrderByDescending(x => x.Id).FirstOrDefaultAsync();
            if (testing == null)
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "There's no data. Can not enter the factory. Please do rapid - test.",
                    Success = true,
                    Data = null
                };
            var tested = testing.ExpiryTime >= DateTime.Now; // 29 >= 28
            if (!tested)
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "There's no data. Can not enter the factory. Please do rapid - test.",
                    Success = true,
                    Data = null
                };


            try
            {


                if (testing.Result == Result.Negative)
                {
                    var data = new FactoryReport
                    {
                        TestKindId = testing.TestKindId,
                        EmployeeId = employee.Id,
                        Result = testing.Result,
                        RapidTestTime = testing.CreatedTime,
                        ExpiryTime = testing.ExpiryTime,
                        FactoryEntryTime = DateTime.Now
                    };

                    await _repo.AddAsync(data);
                    await _unitOfWork.SaveChangeAsync();
                    operationResult = new OperationResult
                    {
                        StatusCode = HttpStatusCode.OK,
                        Message = $"<h2>Result is negative. Record successfully! ,<br><span>Kết quả là âm tính. Được phép vào nhà máy!</span></h2>",
                        Success = true,
                        Data = employee
                    };
                }
                else
                {
                    operationResult = new OperationResult
                    {
                        StatusCode = HttpStatusCode.Forbidden,
                        Message = $"<h2>Result is positive. No Entry! ,<br><span>Kết quả là dương tính. Không được phép vào nhà máy!</span></h2>",
                        Success = true,
                        Data = employee
                    };
                }
            }
            catch (Exception ex)
            {
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }

        public async Task<object> CountWorkerScanQRCodeByToday()
        {
            var total = await _repo.FindAll(x => !x.IsDelete && x.CreatedTime.Date == DateTime.Now.Date).Select(x => x.EmployeeId).Distinct().CountAsync();
            return total;
        }
        public override async Task<OperationResult> DeleteAsync(object id)
        {
            var item = _repo.FindById(id);
            item.IsDelete = true;
            item.DeletedTime = DateTime.Now;

            _repo.Update(item);
            try
            {
                await _unitOfWork.SaveChangeAsync();
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.DeleteSuccess,
                    Success = true,
                    Data = item
                };
            }
            catch (Exception ex)
            {
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }
    }
}
