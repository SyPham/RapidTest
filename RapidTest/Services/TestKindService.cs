using AutoMapper;
using RapidTest.Data;
using RapidTest.DTO;
using RapidTest.Helpers;
using RapidTest.Models;
using RapidTest.Services.Base;
using System;
using System.Net;
using System.Threading.Tasks;

namespace RapidTest.Services
{
    public interface ITestKindService: IServiceBase<TestKind, TestKindDto>
    {
        Task<OperationResult> ToggleIsDefault(int id);
    }
    public class TestKindService : ServiceBase<TestKind, TestKindDto>, ITestKindService
    {
        private readonly IRepositoryBase<TestKind> _repo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private OperationResult operationResult;

        public TestKindService(
            IRepositoryBase<TestKind> repo,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            MapperConfiguration configMapper
            )
            : base(repo, unitOfWork, mapper, configMapper)
        {
            _repo = repo;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configMapper = configMapper;
        }

        public async Task<OperationResult> ToggleIsDefault(int id)
        {
            var item = await _repo.FindByIdAsync(id);
            if (item == null)
            {
                return new OperationResult { StatusCode = HttpStatusCode.NotFound, Message = "Không tìm thấy dữ liệu này!", Success = false };
            }
            item.IsDefault = !item.IsDefault;
            try
            {
                _repo.Update(item);
                await _unitOfWork.SaveChangeAsync();
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = "Successfully!",
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
