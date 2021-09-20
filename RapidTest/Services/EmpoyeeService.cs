using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NetUtility;
using OfficeOpenXml;
using RapidTest.Data;
using RapidTest.DTO;
using RapidTest.Models;
using RapidTest.Services.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.Services
{
    public interface IEmployeeService : IServiceBase<Employee, EmployeeDto>
    {
        Task<bool> ImportExcel();

    }
    public class EmployeeService : ServiceBase<Employee, EmployeeDto>, IEmployeeService
    {
        private readonly IRepositoryBase<Employee> _repo;
        private readonly IRepositoryBase<Factory> _repoFactory;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly MapperConfiguration _configMapper;

        public EmployeeService(
            IRepositoryBase<Employee> repo,
            IRepositoryBase<Factory> repoFactory,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            MapperConfiguration configMapper
            )
            : base(repo, unitOfWork, mapper, configMapper)
        {
            _repo = repo;
            _repoFactory = repoFactory;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _configMapper = configMapper;
        }

        public async Task<bool> ImportExcel()
        {
            IFormFile file = _httpContextAccessor.HttpContext.Request.Form.Files["UploadedFile"];
            object createdBy = _httpContextAccessor.HttpContext.Request.Form["CreatedBy"];
            var datasList = new List<EmployeeImportExcelDto>();
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            if ((file != null) && (file.Length > 0) && !string.IsNullOrEmpty(file.FileName))
            {
                string fileName = file.FileName;
                int userid = createdBy.ToInt();
                using (var package = new ExcelPackage(file.OpenReadStream()))
                {
                    var currentSheet = package.Workbook.Worksheets;
                    var workSheet = currentSheet.First();
                    var noOfCol = workSheet.Dimension.End.Column;
                    var noOfRow = workSheet.Dimension.End.Row;

                    for (int rowIterator = 2; rowIterator <= noOfRow; rowIterator++)
                    {
                        var factoryName = workSheet.Cells[rowIterator, 1].Value.ToSafetyString();
                        var fullName = workSheet.Cells[rowIterator, 2].Value.ToSafetyString();
                        var code = workSheet.Cells[rowIterator, 3].Value.ToSafetyString();
                      

                        if (!factoryName.IsNullOrEmpty() && !fullName.IsNullOrEmpty() && !code.IsNullOrEmpty())
                        {
                            // kiểm tra đẫ tồn tại trong db chưa
                            int factoryId = 0;
                            var factory = await _repoFactory.FindAll(x => x.Name == factoryName).FirstOrDefaultAsync();

                            if (factory == null)
                            {
                                var factoryItem = new Factory { Name = factoryName };
                                _repoFactory.Add(factoryItem);
                                await _unitOfWork.SaveChangeAsync();
                                factoryId = factoryItem.Id;
                            }
                            else
                                factoryId = factory.Id;
                            var item = await _repo.FindAll(x => x.Code == code).AnyAsync();
                            if (!item)
                            {

                                datasList.Add(new EmployeeImportExcelDto()
                                {
                                    FactoryId = factoryId,
                                    FullName = fullName,
                                    Code = code,
                                    CreatedBy = createdBy.ToInt()
                                });
                            }

                        }
                    }
                }

                try
                {
                    var data = _mapper.Map<List<Employee>>(datasList);
                    _repo.AddRange(data);
                    await _unitOfWork.SaveChangeAsync();
                    return true;
                }
                catch (Exception)
                {
                    return false;
                }

            }
            else
            {
                return false;
            }
        }
    }
}
