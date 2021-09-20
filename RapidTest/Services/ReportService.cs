using AutoMapper;
using RapidTest.Data;
using RapidTest.DTO;
using RapidTest.Models;
using RapidTest.Services.Base;

namespace RapidTest.Services
{
    public interface IReportService: IServiceBase<Report, ReportDto>
    {
    }
    public class ReportService : ServiceBase<Report, ReportDto>, IReportService
    {
        private readonly IRepositoryBase<Report> _repo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;

        public ReportService(
            IRepositoryBase<Report> repo,
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
