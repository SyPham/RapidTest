using AutoMapper;
using RapidTest.Data;
using RapidTest.DTO;
using RapidTest.Models;
using RapidTest.Services.Base;

namespace RapidTest.Services
{
    public interface ISettingService: IServiceBase<Setting, SettingDto>
    {
    }
    public class SettingService : ServiceBase<Setting, SettingDto>, ISettingService
    {
        private readonly IRepositoryBase<Setting> _repo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;

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
    }
}
