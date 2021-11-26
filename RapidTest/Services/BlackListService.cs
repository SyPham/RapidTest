using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http;
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
    public interface IBlackListService: IServiceBase<BlackList, BlackListDto>
    {
    }
    public class BlackListService : ServiceBase<BlackList, BlackListDto>, IBlackListService
    {
        private readonly IRepositoryBase<BlackList> _repo;
        private readonly IRepositoryBase<Employee> _repoEmployee;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly MapperConfiguration _configMapper;
        private OperationResult operationResult;

        public BlackListService(
            IRepositoryBase<BlackList> repo,
            IRepositoryBase<Employee> repoEmployee,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            MapperConfiguration configMapper
            )
            : base(repo, unitOfWork, mapper, configMapper)
        {
            _repo = repo;
            _repoEmployee = repoEmployee;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _configMapper = configMapper;
        }
       
        public override async Task<List<BlackListDto>> GetAllAsync()
        {
            //var data = await _repo.FindAll(x => x.IsDelete == false).ToListAsync();
            //foreach (var item in data)
            //{
            //    var employee = item.Employee;
            //    var firstWorkDate = employee.FactoryReports.OrderBy(x => x.Id).Select(x => (DateTime?)x.FactoryEntryTime).FirstOrDefault();
            //    var lastCheckInDateTime = employee.CheckIns.OrderByDescending(x => x.Id).Select(x => (DateTime?)x.CreatedTime).FirstOrDefault();
            //    var lastCheckOutDateTime = employee.Reports.OrderByDescending(x => x.Id).Select(x => (DateTime?)x.CreatedTime).FirstOrDefault();
            //    var lastAccessControlDateTime = employee.FactoryReports.OrderByDescending(x => x.Id).Select(x => (DateTime?)x.CreatedTime).FirstOrDefault();
            //    item.FirstWorkDate = firstWorkDate;
            //    item.LastCheckInDateTime = lastCheckInDateTime;
            //    item.LastCheckOutDateTime = lastCheckOutDateTime;
            //    item.LastAccessControlDateTime = lastAccessControlDateTime;
            //}
            //await _unitOfWork.SaveChangeAsync();

            return await _repo.FindAll(x=>x.IsDelete == false)

                     .Include(x => x.Employee)
                    .ThenInclude(x => x.Department)
                .ProjectTo<BlackListDto>(_configMapper).ToListAsync();

        }
        public override async Task<OperationResult> AddAsync(BlackListDto model)
        {
            try
            {
                string code = model.Code.ToSafetyString().Trim();
                var accessToken = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
                int accountId = JWTExtensions.GetDecodeTokenById(accessToken);
                var employee = await _repoEmployee.FindAll(x => x.Code == code)
                    .Include(x => x.Reports)
                    .Include(x => x.CheckIns)
                    .Include(x=> x.FactoryReports)
                    .AsNoTracking()
                    .FirstOrDefaultAsync();
                if (employee == null)
                {
                    return new OperationResult
                    {
                        StatusCode = HttpStatusCode.BadRequest,
                        Message = "Số thẻ không tồn tại! Vui lòng thử lại!",
                        Success = false,
                        Data = model
                    };
                }
                var check = await _repo.FindAll(x => x.EmployeeId == employee.Id && DateTime.Now.Date == x.CreatedTime.Date).AnyAsync();
                if (check)
                {
                    return new OperationResult
                    {
                        StatusCode = HttpStatusCode.BadRequest,
                        Message = "Ngày hôm nay số thẻ này đã được thêm! Nếu muốn chỉ sửa thời gian vui lòng sử dụng chức năng cập nhật!",
                        Success = false,
                        Data = model
                    };
                }
                var item = _mapper.Map<BlackList>(model);
            
                item.EmployeeId = employee.Id;
                item.CreatedBy = accountId;
                item.CreatedTime = model.CreatedTime;
                item.SystemDateTime = DateTime.Now;
                var firstWorkDate = employee.FactoryReports.OrderBy(x => x.Id).Select(x => (DateTime?)x.FactoryEntryTime).FirstOrDefault();
                var lastCheckInDateTime = employee.CheckIns.OrderByDescending(x => x.Id).Select(x => (DateTime?)x.CreatedTime).FirstOrDefault();
                var lastCheckOutDateTime = employee.Reports.OrderByDescending(x => x.Id).Select(x => (DateTime?)x.CreatedTime).FirstOrDefault();
                var lastAccessControlDateTime = employee.FactoryReports.OrderByDescending(x => x.Id).Select(x => (DateTime?)x.CreatedTime).FirstOrDefault();
                item.FirstWorkDate = firstWorkDate;
                item.LastCheckInDateTime = lastCheckInDateTime;
                item.LastCheckOutDateTime = lastCheckOutDateTime;
                item.LastAccessControlDateTime = lastAccessControlDateTime;
                _repo.Add(item);

                await _unitOfWork.SaveChangeAsync();

                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.AddSuccess,
                    Success = true,
                    Data = model
                };
            }
            catch (Exception ex)
            {
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }
        public override async Task<OperationResult> UpdateAsync(BlackListDto model)
        {
            try
            {
                var accessToken = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
                int accountId = JWTExtensions.GetDecodeTokenById(accessToken);
                var employee = await _repoEmployee.FindAll(x => x.Code == model.Code).AsNoTracking().FirstOrDefaultAsync();

                var item = await _repo.FindByIdAsync(model.Id);
                item.EmployeeId = employee.Id;
                item.ModifiedBy = accountId;
                item.CreatedTime = model.CreatedTime;
                item.FirstWorkDate = model.FirstWorkDate;
                item.LastCheckInDateTime = model.LastCheckInDateTime;
                item.LastCheckOutDateTime = model.LastCheckOutDateTime;
                item.LastAccessControlDateTime = model.LastAccessControlDateTime;
                _repo.Update(item);

                await _unitOfWork.SaveChangeAsync();

                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.UpdateSuccess,
                    Success = true,
                    Data = model
                };
            }
            catch (Exception ex)
            {
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }

        public override async Task<OperationResult> DeleteAsync(object id)
        {
          
            try
            {
                var accessToken = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
                int accountId = JWTExtensions.GetDecodeTokenById(accessToken);
                var item = _repo.FindById(id);
                item.IsDelete = true;
                item.DeletedBy = accountId;
                item.DeletedTime = DateTime.Now;
                _repo.Update(item);
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
