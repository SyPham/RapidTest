using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using RapidTest.Constants;
using RapidTest.Data;
using RapidTest.DTO;
using RapidTest.Helpers;
using RapidTest.Models;
using RapidTest.Services.Base;
using System;
using System.Collections.Generic;
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
            return await _repo.FindAll(x=>x.IsDelete == false).ProjectTo<BlackListDto>(_configMapper).ToListAsync();

        }
        public override async Task<OperationResult> AddAsync(BlackListDto model)
        {
            try
            {
                var accessToken = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
                int accountId = JWTExtensions.GetDecodeTokenById(accessToken);
                var employee = await _repoEmployee.FindAll(x => x.Code == model.Code).FirstOrDefaultAsync();

                var item = _mapper.Map<BlackList>(model);
            
                item.EmployeeId = employee.Id;
                item.CreatedBy = accountId;
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
                var employee = await _repoEmployee.FindAll(x => x.Code == model.Code).FirstOrDefaultAsync();

                var item = await _repo.FindByIdAsync(model.Id);
                item.EmployeeId = employee.Id;
                item.ModifiedBy = accountId;
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
