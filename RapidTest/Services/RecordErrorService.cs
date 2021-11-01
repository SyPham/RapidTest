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
using System.Net;
using System.Threading.Tasks;

namespace RapidTest.Services
{
    public interface IRecordErrorService: IServiceBase<RecordError, RecordErrorDto>
    {
        Task<List<RecordErrorDto>> GetRecordError();
        Task<List<RecordErrorDto>> GetRecordError(DateTime date);
        Task<List<RecordErrorDto>> GetAccessFailed();
        Task<List<RecordErrorDto>> GetAccessFailed(DateTime date);
    }
    public class RecordErrorService : ServiceBase<RecordError, RecordErrorDto>, IRecordErrorService
    {
        private readonly IRepositoryBase<RecordError> _repo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;

        public RecordErrorService(
            IRepositoryBase<RecordError> repo,
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
        public  async Task<List<RecordErrorDto>> GetRecordError()
        {
            var data = await _repo.FindAll(x => x.Station == Station.CHECK_IN || x.Station == Station.CHECK_OUT).ProjectTo<RecordErrorDto>(_configMapper).ToListAsync();
            return data;

        }
        public async Task<List<RecordErrorDto>> GetAccessFailed()
        {
            var data = await _repo.FindAll(x=> x.Station == Station.ACCESS_CONTROL).ProjectTo<RecordErrorDto>(_configMapper).ToListAsync();
            return data;

        }

        public async Task<List<RecordErrorDto>> GetRecordError(DateTime date)
        {
            var stationArray = new List<string> { Station.CHECK_IN, Station.CHECK_OUT };
            var data = await _repo.FindAll(x => x.CreatedTime.Date == date.Date && stationArray.Contains(x.Station)).AsNoTracking().ProjectTo<RecordErrorDto>(_configMapper).ToListAsync();
            return data;

        }
        public async Task<List<RecordErrorDto>> GetAccessFailed(DateTime date)
        {
            var data = await _repo.FindAll(x => x.CreatedTime.Date == date.Date && x.Station == Station.ACCESS_CONTROL).AsNoTracking().ProjectTo<RecordErrorDto>(_configMapper).ToListAsync();
            return data;

        }
    }
}
