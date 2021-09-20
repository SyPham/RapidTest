using AutoMapper;
using RapidTest.Data;
using RapidTest.DTO;
using RapidTest.Models;
using RapidTest.Services.Base;

namespace RapidTest.Services
{
    public interface IFactoryReportService: IServiceBase<FactoryReport, FactoryReportDto>
    {
    }
    public class FactoryReportService : ServiceBase<FactoryReport, FactoryReportDto>, IFactoryReportService
    {
        private readonly IRepositoryBase<FactoryReport> _repo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;

        public FactoryReportService(
            IRepositoryBase<FactoryReport> repo,
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
