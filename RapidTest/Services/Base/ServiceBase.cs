using AutoMapper;
using RapidTest.Data;
using RapidTest.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using RapidTest.DTO;
using System.Net;
using RapidTest.Constants;
using RapidTest.Models;

namespace RapidTest.Services.Base
{
    public interface IServiceBase<T, TDto>
    {
        Task<OperationResult> AddAsync(TDto model);
        Task<OperationResult> AddRangeAsync(List<TDto> model);


        Task<OperationResult> UpdateAsync(TDto model);
        Task<OperationResult> UpdateRangeAsync(List<TDto> model);

        Task<OperationResult> DeleteAsync(object id);

        Task<List<TDto>> GetAllAsync();

        Task<PagedList<TDto>> GetWithPaginationsAsync(PaginationParams param);

        Task<PagedList<TDto>> SearchAsync(PaginationParams param, object text);
        TDto GetById(object id);
        Task<TDto> GetByIdAsync(object id);



    }
    public class ServiceBase<T, TDto> : IServiceBase<T, TDto> where T : class
    {
        private OperationResult operationResult;
        private readonly IMapper _mapper;
        private readonly IRepositoryBase<T> _repo;
        private readonly MapperConfiguration _configMapper;
        private readonly IUnitOfWork _unitOfWork;

        public ServiceBase(
            IRepositoryBase<T> repo,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            MapperConfiguration configMapper
            )
        {
            _mapper = mapper;
            _repo = repo;
            _configMapper = configMapper;
            _unitOfWork = unitOfWork;
        }

        public virtual async Task<OperationResult> AddAsync(TDto model)
        {
            var item = _mapper.Map<T>(model);
            _repo.Add(item);
            try
            {
                await _unitOfWork.SaveChangeAsync();
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.AddSuccess,
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
        public virtual async Task<OperationResult> AddRangeAsync(List<TDto> model)
        {
            var item = _mapper.Map<List<T>>(model);
            _repo.AddRange(item);
            try
            {
                await _unitOfWork.SaveChangeAsync();
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.AddSuccess,
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

        public virtual async Task<OperationResult> DeleteAsync(object id)
        {
            var item = _repo.FindById(id);
            _repo.Remove(item);
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

        public virtual async Task<List<TDto>> GetAllAsync()
        {
            return await _repo.FindAll().ProjectTo<TDto>(_configMapper).ToListAsync();

        }

        public virtual TDto GetById(object id)
        {
            return _mapper.Map<T, TDto>(_repo.FindById(id));
        }
        public virtual async Task<TDto> GetByIdAsync(object id)
        {
            return  _mapper.Map<T, TDto>( await _repo.FindByIdAsync(id));
        }
        public virtual async Task<PagedList<TDto>> GetWithPaginationsAsync(PaginationParams param)
        {
            var lists = _repo.FindAll().ProjectTo<TDto>(_configMapper).OrderByDescending(x => x.GetType().GetProperty("ID").GetValue(x));
            return await PagedList<TDto>.CreateAsync(lists, param.PageNumber, param.PageSize);
        }

        public virtual async Task<PagedList<TDto>> SearchAsync(PaginationParams param, object text)
        {
            var lists = _repo.FindAll().ProjectTo<TDto>(_configMapper)
          .Where(x => x.GetType().GetProperty("Name").GetValue(x) == text)
          .OrderByDescending(x => x.GetType().GetProperty("ID"));
            return await PagedList<TDto>.CreateAsync(lists, param.PageNumber, param.PageSize);
        }

        public virtual async Task<OperationResult> UpdateAsync(TDto model)
        {
            var item = _mapper.Map<T>(model);
            _repo.Update(item);
            try
            {
                await _unitOfWork.SaveChangeAsync();
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.UpdateSuccess,
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
    
        public virtual async Task<OperationResult> UpdateRangeAsync(List<TDto> model)
        {
            var item = _mapper.Map<List<T>>(model);
            _repo.UpdateRange(item);
            try
            {
                await _unitOfWork.SaveChangeAsync();
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.UpdateSuccess,
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
