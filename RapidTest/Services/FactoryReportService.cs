using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using NetUtility;
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
    }
    public class FactoryReportService : ServiceBase<FactoryReport, FactoryReportDto>, IFactoryReportService
    {
        private readonly IRepositoryBase<FactoryReport> _repo;
        private readonly IRepositoryBase<Setting> _repoSetting;
        private readonly IRepositoryBase<Report> _repoReport;
        private readonly IRepositoryBase<Employee> _repoEmployee;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private OperationResult operationResult;

        public FactoryReportService(
            IRepositoryBase<FactoryReport> repo,
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
            _repoSetting = repoSetting;
            _repoReport = repoReport;
            _repoEmployee = repoEmployee;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configMapper = configMapper;
        }
        public async Task<List<FactoryReportDto>> Filter(DateTime startDate, DateTime endDate, string code)
        {
            if (string.IsNullOrEmpty(code))
                return (await _repo.FindAll(x => x.FactoryEntryTime.Date >= startDate.Date && x.FactoryEntryTime.Date <= endDate.Date)
               .ProjectTo<FactoryReportDto>(_configMapper).OrderByDescending(a => a.Id).ToListAsync()).DistinctBy(x => new { x.Code, x.CreatedTime }).ToList();
            else return (await _repo.FindAll(x => x.FactoryEntryTime.Date >= startDate.Date && x.FactoryEntryTime.Date <= endDate.Date && x.Employee.Code.Contains(code))
              .ProjectTo<FactoryReportDto>(_configMapper).OrderByDescending(a => a.Id).ToListAsync()).DistinctBy(x => new { x.Code, x.CreatedTime }).ToList();
        }
        public async Task<OperationResult> AccessControl(string code)
        {
            var employee = await _repoEmployee.FindAll(x => x.Code == code).FirstOrDefaultAsync();
            var setting = await _repoSetting.FindAll().FirstOrDefaultAsync();
            var daySetting = setting.Day;
            var currentDate = DateTime.Now.Date;

            var testing = await _repoReport.FindAll(x => x.EmployeeId == employee.Id && x.ExpiryTime.Date >= currentDate).FirstOrDefaultAsync();
            if (testing == null)
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "There's no data. Can not enter the factory. Please do rapid - test.",
                    Success = true,
                    Data = null
                };
            var tested = testing.ExpiryTime.Date >= currentDate;
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

                var data = new FactoryReport
                {
                    TestKindId = testing.TestKindId,
                    EmployeeId = employee.Id,
                    Result = testing.Result,
                    RapidTestTime = testing.CreatedTime,
                    ExpiryTime = testing.ExpiryTime,
                    FactoryEntryTime = DateTime.Now
                };

                _repo.Add(data);
                await _unitOfWork.SaveChangeAsync();
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = "Result is Negative. Record successfully !",
                    Success = true,
                    Data = employee
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
