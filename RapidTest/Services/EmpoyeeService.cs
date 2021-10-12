using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NetUtility;
using OfficeOpenXml;
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
    public interface IEmployeeService : IServiceBase<Employee, EmployeeDto>
    {
        Task<bool> ImportExcel();
        Task<bool> ImportExcel2();
        Task<bool> UpdateIsPrint(UpdateIsPrintRequest request);
        Task<OperationResult> ToggleSEAInformAsync(int id);
        Task<object> CountWorkerScanQRCodeByToday();

        Task<OperationResult> CheckIn(string code);
        Task<OperationResult> CheckIn(string code, int testKindId);
        Task<List<EmployeeDto>> GetPrintOff();
        Task<bool> CheckCode(string code);

    }
    public class EmployeeService : ServiceBase<Employee, EmployeeDto>, IEmployeeService
    {
        private readonly IRepositoryBase<Employee> _repo;
        private readonly IRepositoryBase<BlackList> _repoBlackList;
        private readonly IRepositoryBase<Department> _repoDepartment;
        private readonly IRepositoryBase<CheckIn> _repoCheckIn;
        private readonly IRepositoryBase<Report> _repoReport;
        private readonly IRepositoryBase<Setting> _repoSetting;
        private readonly IRepositoryBase<Factory> _repoFactory;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly MapperConfiguration _configMapper;
        private OperationResult operationResult;

        public EmployeeService(
            IRepositoryBase<Employee> repo,
            IRepositoryBase<BlackList> repoBlackList,
            IRepositoryBase<Department> repoDepartment,
            IRepositoryBase<CheckIn> repoCheckIn,
            IRepositoryBase<Report> repoReport,
            IRepositoryBase<Setting> repoSetting,
            IRepositoryBase<Factory> repoFactory,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            MapperConfiguration configMapper
            )
            : base(repo, unitOfWork, mapper, configMapper)
        {
            _repo = repo;
            _repoBlackList = repoBlackList;
            _repoDepartment = repoDepartment;
            _repoCheckIn = repoCheckIn;
            _repoReport = repoReport;
            _repoSetting = repoSetting;
            _repoFactory = repoFactory;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _configMapper = configMapper;
        }
        public override async Task<List<EmployeeDto>> GetAllAsync()
        {
            return await _repo.FindAll().ProjectTo<EmployeeDto>(_configMapper).OrderBy(x => x.IsPrint).ToListAsync();

        }
        public override async Task<OperationResult> AddAsync(EmployeeDto model)
        {
            try
            {
                int factoryId = 0;
                int departmentId = 0;
                var accessToken = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
                int accountId = JWTExtensions.GetDecodeTokenById(accessToken);
                var factory = await _repoFactory.FindAll(x => x.Name == model.FactoryName).FirstOrDefaultAsync();
                var department = await _repoDepartment.FindAll(x => x.Code == model.Department).FirstOrDefaultAsync();
                var employee = await _repo.FindAll(x => x.Code == model.Code).AnyAsync();
                if (employee)
                    return new OperationResult
                    {
                        StatusCode = HttpStatusCode.BadRequest,
                        Message = "Already existed code! Đã tồn tại số thẻ này!",
                        Success = true,
                        Data = null
                    };
                if (factory == null)
                {
                    var factoryItem = new Factory { Name = model.FactoryName };
                    _repoFactory.Add(factoryItem);
                    await _unitOfWork.SaveChangeAsync();
                    factoryId = factoryItem.Id;
                }
                else
                    factoryId = factory.Id;


                if (department == null)
                {
                    var departmentItem = new Department { Code = model.Department };
                    _repoDepartment.Add(departmentItem);
                    await _unitOfWork.SaveChangeAsync();
                    departmentId = departmentItem.Id;
                }
                else
                    departmentId = department.Id;

                var item = _mapper.Map<Employee>(model);
                item.Gender = model.Gender.ToLower() == "nam" ? true : false;
                item.IsPrint = model.IsPrint.ToLower() == "on" ? true : false;
                item.DepartmentId = departmentId;
                item.FactoryId = factoryId;
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
        public override async Task<OperationResult> UpdateAsync(EmployeeDto model)
        {
            try
            {
                int factoryId = 0;
                int departmentId = 0;
                var accessToken = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
                int accountId = JWTExtensions.GetDecodeTokenById(accessToken);
                var factory = await _repoFactory.FindAll(x => x.Name == model.FactoryName).FirstOrDefaultAsync();
                var department = await _repoDepartment.FindAll(x => x.Code == model.Department).FirstOrDefaultAsync();
                var item = await _repo.FindByIdAsync(model.Id);

                var employee = await _repo.FindAll(x => x.Code == model.Code).FirstOrDefaultAsync();
                if (employee!= null && item.Code != model.Code)
                        return new OperationResult
                        {
                            StatusCode = HttpStatusCode.BadRequest,
                            Message = "Already existed code! Đã tồn tại số thẻ này!",
                            Success = true,
                            Data = null
                        };

                if (factory == null)
                {
                    var factoryItem = new Factory { Name = model.FactoryName };
                    _repoFactory.Add(factoryItem);
                    await _unitOfWork.SaveChangeAsync();
                    factoryId = factoryItem.Id;
                }
                else
                    factoryId = factory.Id;


                if (department == null)
                {
                    var departmentItem = new Department { Code = model.Department };
                    _repoDepartment.Add(departmentItem);
                    await _unitOfWork.SaveChangeAsync();
                    departmentId = departmentItem.Id;
                }
                else
                    departmentId = department.Id;

                item.SEAInform = model.SEAInform;
                item.Gender = model.Gender.ToLower() == "nam" ? true : false;
                item.IsPrint = model.IsPrint.ToLower() == "on" ? true : false;
                item.FullName = model.FullName;
                item.BirthDate = model.BirthDay;
                item.DepartmentId = departmentId;
                item.FactoryId = factoryId;
                item.ModifiedBy = accountId;
                item.Code = model.Code;
                item.SettingId = model.SettingId;

                _repo.Update(item);
                 
                await _unitOfWork.SaveChangeAsync();
                var result = _mapper.Map<EmployeeDto>(item);

                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = MessageReponse.UpdateSuccess,
                    Success = true,
                    Data = result
                };
            }
            catch (Exception ex)
            {
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }
        public async Task<OperationResult> CheckIn(string code)
        {
            var employee = await _repo.FindAll(x => x.Code == code).FirstOrDefaultAsync();
            if (employee == null)
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "Not found this person. No entry.Please establish data in Staff info page!",
                    Success = true,
                    Data = null
                };

            if (!employee.SEAInform)
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "No entry.Please wait for SEA inform !",
                    Success = true,
                    Data = null
                };

            try
            {
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = "Successfully!",
                    Success = true,
                    Data = employee
                };
            }
            catch (Exception ex)
            {
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }


        public async Task<OperationResult> CheckIn(string code, int testKindId)
        {
            try
            {
                var employee = await _repo.FindAll(x => x.Code == code).FirstOrDefaultAsync();
            if (employee == null)
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "Not found this person. No entry.Please establish data in Staff info page!",
                    Success = true,
                    Data = null
                };


            if (!employee.SEAInform)
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "No entry.Please wait for SEA inform !",
                    Success = true,
                    Data = null
                };
               if (employee.Setting == null)
                {
                    var setting = await _repoSetting.FindAll(x=> x.SettingType == "CHECK_OUT" && x.IsDefault).FirstOrDefaultAsync();
                    employee.Setting = setting;
                    _repo.Update(employee);
                   await _unitOfWork.SaveChangeAsync();
                }
            var checkBlackList = await _repoBlackList.FindAll(x => x.EmployeeId == employee.Id && !x.IsDelete).AnyAsync();

            if (checkBlackList)
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.Forbidden,
                    Message = $"<h2>This person is in SEA blacklist , do not allow him or her pass this station<br>Người này nằm trong danh sách đen của nhân sự, không được để anh ấy hoặc cô ấy đi qua chốt này</h2>",
                    Success = true,
                    Data = null
                };
            var checkExist = await _repoCheckIn.FindAll(x => x.EmployeeId == employee.Id && x.TestKindId == testKindId && x.CreatedTime.Date == DateTime.Now.Date).AnyAsync();

            if (checkExist)
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.Forbidden,
                    Message = $"<h2>Số thẻ {code} đã đăng ký xét nghiệm! <br> Already checked in!</h2>",
                    Success = true,
                    Data = null
                };

            var data = new CheckIn
            {
                TestKindId = testKindId,
                EmployeeId = employee.Id
            };

            await  _repoCheckIn.AddAsync(data);
            await _unitOfWork.SaveChangeAsync();
                var checkOutTime = data.CreatedTime.AddMinutes(employee.Setting.Mins + 1).ToRemoveSecond().ToString("HH:mm:ss");
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = $"<h2>Thời gian kết quả xét nghiệm {checkOutTime}<br>Check out time is at {checkOutTime}</h2> ",
                    Success = true,
                    Data = employee
                };
            }
            catch (Exception ex)
            {
                operationResult = ex.GetMessageError();
            }
            return operationResult;
        }

        public async Task<bool> ImportExcel()
        {
            IFormFile file = _httpContextAccessor.HttpContext.Request.Form.Files["UploadedFile"];
            object createdBy = _httpContextAccessor.HttpContext.Request.Form["CreatedBy"];
            var datasList = new List<EmployeeImportExcelDto>();
            var updateList = new List<Employee>();
            var accessToken = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            int accountId = JWTExtensions.GetDecodeTokenById(accessToken);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            if ((file != null) && (file.Length > 0) && !string.IsNullOrEmpty(file.FileName))
            {
                try
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
                            var code = workSheet.Cells[rowIterator, 2].Value.ToSafetyString();
                            var departmentName = workSheet.Cells[rowIterator, 3].Value.ToSafetyString();
                            var fullName = workSheet.Cells[rowIterator, 4].Value.ToSafetyString();
                            var gender = workSheet.Cells[rowIterator, 5].Value.ToSafetyString();
                            var birthDateTemp = workSheet.Cells[rowIterator, 6].Value.ToLong();
                            var SEAInform = workSheet.Cells[rowIterator, 7].Value.ToSafetyString();
                            var isPrint = workSheet.Cells[rowIterator, 8].Value.ToSafetyString();
                            var kind = workSheet.Cells[rowIterator, 9].Value.ToSafetyString();
                            DateTime birthDate = DateTime.FromOADate(birthDateTemp);
                            if (!factoryName.IsNullOrEmpty()
                                && !fullName.IsNullOrEmpty()
                                && !code.IsNullOrEmpty()
                                && !departmentName.IsNullOrEmpty()
                                && !gender.IsNullOrEmpty()
                                && !isPrint.IsNullOrEmpty()
                                && !SEAInform.IsNullOrEmpty())
                            {
                                // kiểm tra đẫ tồn tại trong db chưa
                                int factoryId = 0;
                                int departmentId = 0;

                                var factory = await _repoFactory.FindAll(x => x.Name == factoryName).FirstOrDefaultAsync();
                                var department = await _repoDepartment.FindAll(x => x.Code == departmentName).FirstOrDefaultAsync();

                                if (factory == null)
                                {
                                    var factoryItem = new Factory { Name = factoryName };
                                    _repoFactory.Add(factoryItem);
                                    await _unitOfWork.SaveChangeAsync();
                                    factoryId = factoryItem.Id;
                                }
                                else
                                    factoryId = factory.Id;


                                if (department == null)
                                {
                                    var departmentItem = new Department { Code = departmentName };
                                    _repoDepartment.Add(departmentItem);
                                    await _unitOfWork.SaveChangeAsync();
                                    departmentId = departmentItem.Id;
                                }
                                else
                                    departmentId = department.Id;

                                var item = await _repo.FindAll(x => x.Code == code).FirstOrDefaultAsync();
                                int? kindId = null;
                                var kindItem = await _repoSetting.FindAll(x => x.Name.ToLower() == kind.ToLower()).FirstOrDefaultAsync();
                                if (kindItem != null)
                                {
                                    kindId = kindItem.Id;
                                } else
                                {
                                    var defaultItem = await _repoSetting.FindAll(x => x.IsDefault).FirstOrDefaultAsync();
                                    kindId = defaultItem.Id;
                                }
                                if (item == null)
                                {

                                    datasList.Add(new EmployeeImportExcelDto()
                                    {
                                        FactoryId = factoryId,
                                        FullName = fullName,
                                        Code = code,
                                        BirthDate = birthDate,
                                        DepartmentId = departmentId,
                                        IsPrint = isPrint.ToLower() == "on" ? true : false,
                                        Gender = gender.ToLower() == "nam" ? true : false,
                                        CreatedBy = accountId,
                                        SEAInform = SEAInform.ToLower() == "true" ? true : false,
                                        SettingId = kindId
                                    });
                                }
                                else
                                {
                                    item.SEAInform = SEAInform.ToLower() == "true" ? true : false;
                                    item.IsPrint = isPrint.ToLower() == "on" ? true : false;
                                    item.Gender = gender.ToLower() == "nam" ? true : false;
                                    item.FullName = fullName;
                                    item.BirthDate = birthDate;
                                    item.DepartmentId = departmentId;
                                    item.SettingId = kindId;
                                    updateList.Add(item);
                                }

                            }
                        }
                    }


                    var data = _mapper.Map<List<Employee>>(datasList);
                    _repo.AddRange(data);
                    _repo.UpdateRange(updateList);
                    await _unitOfWork.SaveChangeAsync();
                    return true;
                }
                catch (Exception ex)
                {
                    return false;
                }

            }
            else
            {
                return false;
            }
        }

        public async Task<OperationResult> ToggleSEAInformAsync(int id)
        {
            var item = await _repo.FindByIdAsync(id);
            if (item == null)
            {
                return new OperationResult { StatusCode = HttpStatusCode.NotFound, Message = "Không tìm thấy nhân viên này!", Success = false };
            }
            item.SEAInform = !item.SEAInform;
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

        public async Task<bool> UpdateIsPrint(UpdateIsPrintRequest request)
        {
            try
            {
                var accessToken = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
                int accountId = JWTExtensions.GetDecodeTokenById(accessToken);
                var employee = await _repo.FindAll(x => request.Ids.Contains(x.Id)).ToListAsync();

                employee.ForEach(item =>
                {
                    item.PrintBy = accountId;
                    item.IsPrint = true;
                    item.LatestPrintTime = DateTime.Now;
                });

                _repo.UpdateRange(employee);
                await _unitOfWork.SaveChangeAsync();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }

        public async Task<List<EmployeeDto>> GetPrintOff()
        {
            return await _repo.FindAll(x => !x.IsPrint).OrderBy(x => x.Id).ProjectTo<EmployeeDto>(_configMapper).ToListAsync();

        }

        public async Task<object> CountWorkerScanQRCodeByToday()
        {
            var total = await _repoCheckIn.FindAll(x => x.CreatedTime.Date == DateTime.Now.Date).Select(x => x.EmployeeId).Distinct().CountAsync();
            return total;
        }

        public async Task<bool> CheckCode(string code)
        {
            return await _repo.FindAll(x => x.Code == code).AnyAsync();
        }

        public async Task<bool> ImportExcel2()
        {
            IFormFile file = _httpContextAccessor.HttpContext.Request.Form.Files.First();
            object createdBy = _httpContextAccessor.HttpContext.Request.Form["CreatedBy"];
            var datasList = new List<EmployeeImportExcelDto>();
            var datasList2 = new List<ImportRequest>();
            var updateList = new List<Employee>();
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            if ((file != null) && (file.Length > 0) && !string.IsNullOrEmpty(file.FileName))
            {
                try
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
                            var code = workSheet.Cells[rowIterator, 2].Value.ToSafetyString();
                            var departmentName = workSheet.Cells[rowIterator, 3].Value.ToSafetyString();
                            var fullName = workSheet.Cells[rowIterator, 4].Value.ToSafetyString();
                            var code2 = workSheet.Cells[rowIterator, 5].Value.ToSafetyString();
                            var fullName2 = workSheet.Cells[rowIterator, 6].Value.ToSafetyString();
                            var SEAInform = workSheet.Cells[rowIterator, 7].Value.ToSafetyString();
                            var isPrint = workSheet.Cells[rowIterator, 8].Value.ToSafetyString();
                            var kind = workSheet.Cells[rowIterator, 9].Value.ToSafetyString();
                            if (
                                 !fullName.IsNullOrEmpty()
                                && !code.IsNullOrEmpty())
                              
                            {
                                datasList2.Add(new ImportRequest
                                {
                                    Code = code2,
                                    FullName = fullName2
                                });

                            }
                        }
                    }

                    var data3 = (await _repoReport.FindAll(x => datasList2.Select(a => a.Code).Contains(x.Employee.Code)).OrderByDescending(x=>x.CreatedTime).ToListAsync()).DistinctBy(x => x.EmployeeId).ToList();
                    foreach (var item in data3)
                    {
                        item.ExpiryTime = new DateTime(2021, 10, 14);
                    }
                    //var data = _mapper.Map<List<Employee>>(datasList);
                    //_repo.AddRange(data);
                    _repoReport.UpdateRange(data3);
                    await _unitOfWork.SaveChangeAsync();
                    return true;
                }
                catch (Exception ex)
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
