using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RapidTest.Constants;
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
    public interface ISettingService : IServiceBase<Setting, SettingDto>
    {
        Task<OperationResult> UpdateDescription(UpdateDescriptionRequestDto request);

    }
    public class SettingService : ServiceBase<Setting, SettingDto>, ISettingService
    {
        private readonly IRepositoryBase<Setting> _repo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private OperationResult operationResult;

        public SettingService(
            IRepositoryBase<Setting> repo,
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

        public async Task<OperationResult> UpdateDescription(UpdateDescriptionRequestDto request)
        {

            try
            {

                var model = await _repo.FindAll(x => x.Id == request.Id).FirstOrDefaultAsync();

                model.Description = request.Description;
                _repo.Update(model);
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

    }
}
