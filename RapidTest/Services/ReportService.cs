using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
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
    public interface IReportService : IServiceBase<Report, ReportDto>
    {
        Task<OperationResult> ScanQRCode(ScanQRCodeRequestDto request); //Check Out

        Task<List<ReportDto>> Filter(DateTime startDate, DateTime endDate, string code);

    }
    public class ReportService : ServiceBase<Report, ReportDto>, IReportService
    {
        private readonly IRepositoryBase<Report> _repo;
        private readonly IRepositoryBase<Setting> _repoSetting;
        private readonly IRepositoryBase<Employee> _repoEmployee;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private OperationResult operationResult;

        public ReportService(
            IRepositoryBase<Report> repo,
            IRepositoryBase<Setting> repoSetting,
            IRepositoryBase<Employee> repoEmployee,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            MapperConfiguration configMapper
            )
            : base(repo, unitOfWork, mapper, configMapper)
        {
            _repo = repo;
            _repoSetting = repoSetting;
            _repoEmployee = repoEmployee;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configMapper = configMapper;
        }

        public async Task<List<ReportDto>> Filter(DateTime startDate, DateTime endDate, string code)
        {
            if (string.IsNullOrEmpty(code))
                return await _repo.FindAll(x => x.CreatedTime.Date >= startDate.Date && x.CreatedTime.Date <= endDate.Date)
               .ProjectTo<ReportDto>(_configMapper).ToListAsync();
            else return await _repo.FindAll(x => x.CreatedTime.Date >= startDate.Date && x.CreatedTime.Date <= endDate.Date && x.Employee.Code.Contains(code))
              .ProjectTo<ReportDto>(_configMapper).ToListAsync();
        }

        public async Task<OperationResult> ScanQRCode(ScanQRCodeRequestDto request)
        {
            var employee = await _repoEmployee.FindAll(x => x.Code == request.QRCode).FirstOrDefaultAsync();
            if (employee == null)
            {
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "The QRCode not exist!",
                    Success = true,
                    Data = null
                };
            }
            var setting = await _repoSetting.FindAll().FirstOrDefaultAsync();
            var daySetting = setting.Day;
            var expiryTime = DateTime.Now.AddDays(daySetting).Date;
            var data = new Report
            {
                TestKindId = request.KindId,
                EmployeeId = employee.Id,
                Result = Result.Negative,
                ExpiryTime = expiryTime
            };
            try
            {
                _repo.Add(data);
                await _unitOfWork.SaveChangeAsync();
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = "Successfully!",
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
