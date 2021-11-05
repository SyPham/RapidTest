using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NetUtility;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using RapidTest.Constants;
using RapidTest.Data;
using RapidTest.DTO;
using RapidTest.Helpers;
using RapidTest.Models;
using RapidTest.Services.Base;
using Syncfusion.JavaScript;
using Syncfusion.JavaScript.DataSources;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace RapidTest.Services
{
    public interface IEmployeeService : IServiceBase<Employee, EmployeeDto>
    {
        Task<bool> ImportExcel();
        Task<bool> ImportExcel2();
        Task<bool> ImportExcel3();
        Task<bool> UpdateIsPrint(UpdateIsPrintRequest request);
        Task<OperationResult> ToggleSEAInformAsync(int id);
        Task<object> CountWorkerScanQRCodeByToday();
        Task<OperationResult> CheckIn(string code, int testKindId);
        Task<List<EmployeeDto>> GetPrintOff();
        Task<bool> CheckCode(string code);
        Task<byte[]> ExportExcel();
        Task<object> Filter(int skip, int take, string orderby, string code);
        Task<object> LoadData(DataManager dm);
        Task<OperationResult> Insert(CRUDModel<EmployeeDto> value);

    }
    public class EmployeeService : ServiceBase<Employee, EmployeeDto>, IEmployeeService
    {
        private readonly IRepositoryBase<Employee> _repo;
        private readonly IRepositoryBase<RecordError> _repoRecordError;
        private readonly IRepositoryBase<BlackList> _repoBlackList;
        private readonly IRepositoryBase<Department> _repoDepartment;
        private readonly IRepositoryBase<CheckIn> _repoCheckIn;
        private readonly IRepositoryBase<Report> _repoReport;
        private readonly IRepositoryBase<Setting> _repoSetting;
        private readonly IRepositoryBase<Factory> _repoFactory;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly MapperConfiguration _configMapper;
        private OperationResult operationResult;

        public EmployeeService(
            IRepositoryBase<Employee> repo,
            IRepositoryBase<RecordError> repoRecordError,
            IRepositoryBase<BlackList> repoBlackList,
            IRepositoryBase<Department> repoDepartment,
            IRepositoryBase<CheckIn> repoCheckIn,
            IRepositoryBase<Report> repoReport,
            IRepositoryBase<Setting> repoSetting,
            IRepositoryBase<Factory> repoFactory,
            IServiceScopeFactory serviceScopeFactory,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            MapperConfiguration configMapper
            )
            : base(repo, unitOfWork, mapper, configMapper)
        {
            _repo = repo;
            _repoRecordError = repoRecordError;
            _repoBlackList = repoBlackList;
            _repoDepartment = repoDepartment;
            _repoCheckIn = repoCheckIn;
            _repoReport = repoReport;
            _repoSetting = repoSetting;
            _repoFactory = repoFactory;
            _serviceScopeFactory = serviceScopeFactory;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _configMapper = configMapper;
        }
        public override async Task<List<EmployeeDto>> GetAllAsync()
        {
            return await _repo.FindAll().AsNoTracking()
                .ProjectTo<EmployeeDto>(_configMapper).OrderBy(x => x.IsPrint).ToListAsync();
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
                if (employee != null && item.Code != model.Code)
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
                item.TestDate = model.TestDate;

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
        /// <summary>
        /// Using background threads to logging
        /// </summary>
        /// <param name="employeeId">Mã nhân viên có thể để null</param>
        /// <param name="station">Trạm nào bị lỗi</param>
        /// <param name="reason">Thông tin lỗi</param>
        private void Logging(int? employeeId, string station, string reason, int accountId)
        {
            _ = Task.Run(async () =>
            {

                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<DataContext>();
                    await context.RecordError.AddAsync(new RecordError
                    (
                        employeeId,
                        station,
                        reason,
                        DateTime.Now,
                        accountId
                   ));
                    await context.SaveChangesAsync();
                }
            });
        }
        public async Task<OperationResult> CheckIn(string code, int testKindId)
        {

            var accessToken = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            int accountId = JWTExtensions.GetDecodeTokenById(accessToken);
            try
            {
                var employee = await _repo.FindAll(x => x.Code == code).FirstOrDefaultAsync();
                if (employee == null)
                {
                    Logging(
                        null,
                        Station.CHECK_IN,
                        $"(QR Code Input: {code}) " + ErrorKindMessage.WRONG_CODE,
                        accountId
                        );
                    return new OperationResult
                    {
                        StatusCode = HttpStatusCode.NotFound,
                        Message = "Not found this person. No entry.Please establish data in Staff info page!",
                        Success = true,
                        Data = null,
                        ErrorCode = "Sai so the"
                    };
                }


                if (!employee.SEAInform)
                {
                    Logging(
                       employee.Id,
                       Station.CHECK_IN,
                        ErrorKindMessage.SEA_INFORM,
                        accountId
                       );
                    return new OperationResult
                    {
                        StatusCode = HttpStatusCode.BadRequest,
                        Message = "No entry.Please wait for SEA inform !",
                        Success = true,
                        Data = null
                    };
                }


                if (employee.Setting == null)
                {
                    var setting = await _repoSetting.FindAll(x => x.SettingType == "CHECK_OUT" && x.IsDefault).FirstOrDefaultAsync();
                    employee.Setting = setting;
                    _repo.Update(employee);
                    await _unitOfWork.SaveChangeAsync();
                }
                var checkBlackList = await _repoBlackList.FindAll(x => x.EmployeeId == employee.Id && !x.IsDelete).AnyAsync();

                if (checkBlackList)
                {
                    Logging(
                      employee.Id,
                      Station.CHECK_IN,
                      ErrorKindMessage.BLACK_LIST,
                        accountId
                      );

                    return new OperationResult
                    {
                        StatusCode = HttpStatusCode.Forbidden,
                        Message = $"<h2>This person is in SEA blacklist, do not allow him or her pass this station<br>Người này nằm trong danh sách đen của nhân sự, không được để anh ấy hoặc cô ấy đi qua chốt này</h2>",
                        Success = true,
                        Data = null,
                        ErrorCode = "Danh sach den"
                    };
                }
                var checkExist = await _repoCheckIn.FindAll(x => x.EmployeeId == employee.Id && x.TestKindId == testKindId && x.CreatedTime.Date == DateTime.Now.Date && !x.IsDelete).AnyAsync();

                if (checkExist)
                {
                    Logging(
                    employee.Id,
                    Station.CHECK_IN,
                     ErrorKindMessage.ALREADY_CHECK_IN,
                        accountId
                    );

                    return new OperationResult
                    {
                        StatusCode = HttpStatusCode.NotAcceptable,
                        Message = $"<h2>Số thẻ {code} đã đăng ký xét nghiệm! <br> Already checked in!</h2>",
                        Success = true,
                        Data = null,
                        ErrorCode = "Xin moi qua"
                    };
                }
                // Nếu đi sai ngày thi log ra db
                string dayOfWeek = ((int)DateTime.Today.DayOfWeek + 1) + "";
                var testDateArray = employee.TestDate.ToSafetyString().Split(".");
                if (testDateArray.Contains(dayOfWeek) == false && employee.TestDate.ToSafetyString().Contains("."))
                {
                    Logging(
                    employee.Id,
                    Station.CHECK_IN,
                     ErrorKindMessage.WRONG_SCHEDULE,
                        accountId
                    );
                }
                var data = new CheckIn
                {
                    TestKindId = testKindId,
                    EmployeeId = employee.Id
                };

                await _repoCheckIn.AddAsync(data);
                await _unitOfWork.SaveChangeAsync();
                var checkOutTime = data.CreatedTime.AddMinutes(employee.Setting.Mins + 1).ToRemoveSecond().ToString("HH:mm:ss");
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = $"<h2>Thời gian kết quả xét nghiệm {checkOutTime}<br>Check out time is at {checkOutTime}</h2> ",
                    Success = true,
                    Data = employee,
                    ErrorCode = "Xin moi qua"
                };
            }
            catch (Exception ex)
            {
                operationResult = ex.GetMessageError();
                var ExceptionMsg = ex.Message.ToString();
                var ExceptionType = ex.GetType().Name.ToString();
                var ExceptionSource = ex.StackTrace.ToString();
                Logging(
                    null,
                    Station.SERVER_ERROR,
                    $"(QR Code Input: {code}) " + $"{Station.CHECK_IN}: {ExceptionMsg}, {ExceptionType}, {ExceptionSource}",
                        accountId
                    );
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
                            var testDate = workSheet.Cells[rowIterator, 10].Value.ToSafetyString();
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
                                else departmentId = department.Id;

                                var item = await _repo.FindAll(x => x.Code == code).FirstOrDefaultAsync();
                                int? kindId = null;
                                var kindItem = await _repoSetting.FindAll(x => x.Name.ToLower() == kind.ToLower()).FirstOrDefaultAsync();
                                if (kindItem != null)
                                {
                                    kindId = kindItem.Id;
                                }
                                else
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
                                        SettingId = kindId,
                                        TestDate = testDate
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
                                    item.TestDate = testDate;
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
            var total = await _repoCheckIn.FindAll(x => !x.IsDelete && x.CreatedTime.Date == DateTime.Now.Date).Select(x => x.EmployeeId).Distinct().CountAsync();
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

                    var data3 = (await _repoReport.FindAll(x => datasList2.Select(a => a.Code).Contains(x.Employee.Code)).OrderByDescending(x => x.CreatedTime).ToListAsync()).DistinctBy(x => x.EmployeeId).ToList();
                    foreach (var item in data3)
                    {
                        item.ExpiryTime = new DateTime(2021, 10, 14);
                    }
                    //var data = _mapper.Map<List<Employee>>(datasList);
                    //_repo.AddRange(data);
                    //_repoReport.UpdateRange(data3);
                    //await _unitOfWork.SaveChangeAsync();
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

        public async Task<bool> ImportExcel3()
        {
            IFormFile file = _httpContextAccessor.HttpContext.Request.Form.Files["UploadedFile"];
            object createdBy = _httpContextAccessor.HttpContext.Request.Form["CreatedBy"];
            var updateList = new List<Employee>();
            var accessToken = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            int accountId = JWTExtensions.GetDecodeTokenById(accessToken);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            var kindModel = await _repoSetting.FindAll(x => x.SettingType == SettingType.CHECK_OUT).ToListAsync();
            var data = (await _repo.FindAll().OrderByDescending(x => x.CreatedTime).ToListAsync()).ToHashSet();

            if ((file != null) && (file.Length > 0) && !string.IsNullOrEmpty(file.FileName))
            {
                try
                {
                    Stopwatch stopWatch = new Stopwatch();
                    stopWatch.Start();
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
                            var code = workSheet.Cells[rowIterator, 1].Value.ToSafetyString();
                            var fullName = workSheet.Cells[rowIterator, 2].Value.ToSafetyString();
                            var kind = workSheet.Cells[rowIterator, 3].Value.ToSafetyString();
                            var testDate = workSheet.Cells[rowIterator, 4].Value.ToSafetyString();
                            if (!code.IsNullOrEmpty())
                            {
                                // kiểm tra đẫ tồn tại trong db chưa

                                var item = data.Where(x => x.Code == code).FirstOrDefault();
                                int? kindId = null;
                                var kindItem = kindModel.FirstOrDefault(x => x.Name.ToLower() == kind.ToLower());
                                if (kindItem != null)
                                    kindId = kindItem.Id;
                                else
                                    kindId = kindModel.FirstOrDefault(x => x.IsDefault).Id;

                                if (item != null)
                                {
                                    item.SettingId = kindId;
                                    item.TestDate = testDate;
                                    _repo.Update(item);

                                    //updateList.Add(item);
                                }

                            }
                        }
                    }
                    //_repo.UpdateRange(updateList);
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
        public async Task<byte[]> ExportExcel()
        {
            try
            {
                var data = await _repo.FindAll().Select(x => new ExportExcelRequest
                {
                    Code = x.Code,
                    FullName = x.FullName,
                    Kind = x.SettingId.HasValue ? x.Setting.Name : string.Empty,
                    TestDate = x.TestDate
                }).ToListAsync();
                var currentTime = DateTime.Now;
                ExcelPackage.LicenseContext = LicenseContext.Commercial;
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                var memoryStream = new MemoryStream();
                using (ExcelPackage p = new ExcelPackage(memoryStream))
                {
                    // đặt tên người tạo file
                    p.Workbook.Properties.Author = "Henry Pham";

                    // đặt tiêu đề cho file
                    p.Workbook.Properties.Title = "Employee";
                    //Tạo một sheet để làm việc trên đó
                    p.Workbook.Worksheets.Add("Employee");

                    // lấy sheet vừa add ra để thao tác
                    ExcelWorksheet ws = p.Workbook.Worksheets["Employee"];

                    // đặt tên cho sheet
                    ws.Name = "Employee";
                    // fontsize mặc định cho cả sheet
                    ws.Cells.Style.Font.Size = 11;
                    // font family mặc định cho cả sheet
                    ws.Cells.Style.Font.Name = "Calibri";
                    var headerArray = new List<string>()
                    {
                        "Số thẻ",
                        "Họ Và Tên",
                        "Kind",
                        "Ngày xét nghiệm"
                    };
                    ws.Cells["H1"].Value = "Dữ Liệu Ngày Xét Nghiệm";
                    ws.Cells["H1"].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    ws.Cells["H1"].Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#1F4E78"));
                    ws.Cells["H1"].Style.Font.Color.SetColor(ColorTranslator.FromHtml("#fff"));
                    ws.Cells["H1"].Style.Font.Size = 16;
                    ws.Cells["H2"].Value = $"1 = {nameof(DayOfWeek.Sunday)}";
                    ws.Cells["H3"].Value = $"2 = {nameof(DayOfWeek.Monday)}";
                    ws.Cells["H4"].Value = $"3 = {nameof(DayOfWeek.Tuesday)}";
                    ws.Cells["H5"].Value = $"4 = {nameof(DayOfWeek.Wednesday)}";
                    ws.Cells["H6"].Value = $"5 = {nameof(DayOfWeek.Thursday)}";
                    ws.Cells["H7"].Value = $"6 = {nameof(DayOfWeek.Friday)}";
                    ws.Cells["H8"].Value = $"7 = {nameof(DayOfWeek.Saturday)}";
                    ws.Cells["H9"].Value = "Để trống là tất cả các ngày trong tuần";
                    int headerRowIndex = 1;
                    foreach (var headerItem in headerArray.Select((value, i) => new { i, value }))
                    {
                        var headerColIndex = headerItem.i + 1;
                        var headerExcelRange = ws.Cells[headerRowIndex, headerColIndex];
                        headerExcelRange.Value = headerItem.value;
                        headerExcelRange.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        headerExcelRange.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#1F4E78"));
                        headerExcelRange.Style.Font.Color.SetColor(ColorTranslator.FromHtml("#fff"));
                        headerExcelRange.Style.Font.Size = 16;

                    }

                    int bodyRowIndex = 1;
                    int bodyColIndex = 1;
                    int total = data.Count + 1;
                    foreach (var bodyItem in data)
                    {
                        bodyColIndex = 1;
                        bodyRowIndex++;

                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.Code;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.FullName;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.Kind;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.TestDate;

                    }


                    //Make all text fit the cells
                    //ws.Cells[ws.Dimension.Address].AutoFitColumns();
                    ws.Cells[$"A1:D{total}"].Style.Font.Bold = true;
                    ws.Cells[$"A1:D{total}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    ws.Cells[$"A1:D{total}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                    //make the borders of cell F6 thick
                    ws.Cells[$"A1:D{total}"].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"A1:D{total}"].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"A1:D{total}"].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"A1:D{total}"].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"A1:D{total}"].AutoFitColumns();


                    ws.Cells[$"H1:H9"].Style.Font.Bold = true;
                    ws.Cells[$"H1:H9"].Style.VerticalAlignment = ExcelVerticalAlignment.Justify;
                    ws.Cells[$"H1:H9"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Justify;

                    //make the borders of cell F6 thick
                    ws.Cells[$"H1:H9"].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"H1:H9"].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"H1:H9"].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"H1:H9"].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"H1:H9"].AutoFitColumns();
                    //Lưu file lại
                    Byte[] bin = p.GetAsByteArray();
                    return bin;
                }
            }
            catch (Exception ex)
            {
                var mes = ex.Message;
                Console.WriteLine(mes);
                return new Byte[] { };
            }
        }
        public async Task<byte[]> ExportExcel2()
        {
            try
            {

                var data = await _repo.FindAll().Select(x => new
                {
                    Factory = x.Factory.Name,
                    Code = x.Code,
                    Department = x.Department.Code,
                    FullName = x.FullName,
                    Gender = x.Gender.HasValue && x.Gender.Value ? "NAM" : "NỮ",
                    BirthDate = x.BirthDate,
                    SEAInform = x.SEAInform.ToString().ToUpper(),
                    IsPrint = x.IsPrint ? "ON" : "OFF",
                    Kind = x.SettingId.HasValue ? x.Setting.Name : "Đi làm",
                    TestDate = x.TestDate
                }).Take(9).ToListAsync();
                var currentTime = DateTime.Now;
                ExcelPackage.LicenseContext = LicenseContext.Commercial;
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                var memoryStream = new MemoryStream();
                using (ExcelPackage p = new ExcelPackage(memoryStream))
                {
                    // lấy sheet ra để thao tác
                    ExcelWorksheet ws = p.Workbook.Worksheets["Employee"];

                    int bodyRowIndex = 1;
                    int bodyColIndex = 1;
                    int total = data.Count + 1;
                    foreach (var bodyItem in data)
                    {
                        bodyColIndex = 1;
                        bodyRowIndex++;

                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.Factory;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.Code;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.Department;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.FullName;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.Gender;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.BirthDate;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.SEAInform;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.IsPrint;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.Kind;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.TestDate;

                    }

                    //Make all text fit the cells
                    //ws.Cells[ws.Dimension.Address].AutoFitColumns();
                    ws.Cells[$"A1:D{total}"].Style.Font.Bold = true;
                    ws.Cells[$"A1:D{total}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    ws.Cells[$"A1:D{total}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                    //make the borders of cell F6 thick
                    ws.Cells[$"A1:D{total}"].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"A1:D{total}"].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"A1:D{total}"].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"A1:D{total}"].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"A1:D{total}"].AutoFitColumns();


                    ws.Cells[$"H1:H9"].Style.Font.Bold = true;
                    ws.Cells[$"H1:H9"].Style.VerticalAlignment = ExcelVerticalAlignment.Justify;
                    ws.Cells[$"H1:H9"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Justify;

                    //make the borders of cell F6 thick
                    ws.Cells[$"H1:H9"].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"H1:H9"].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"H1:H9"].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"H1:H9"].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"H1:H9"].AutoFitColumns();
                    //Lưu file lại
                    Byte[] bin = p.GetAsByteArray();
                    return bin;
                }
            }
            catch (Exception ex)
            {
                var mes = ex.Message;
                Console.WriteLine(mes);
                return new Byte[] { };
            }
        }


        public async Task<object> Filter(int skip, int take, string orderby, string filter)
        {

            if (string.IsNullOrEmpty(filter))
            {

                var source = _repo.FindAll()
               .ProjectTo<EmployeeDto>(_configMapper).OrderByDescending(x => x.Id).EJ2OrderBy(orderby);

                var count = await source.CountAsync();
                var items = count > 0 ? await source.Skip(skip).Take(take).ToListAsync() : new List<EmployeeDto> { };
                return new EJ2DataSource
                {
                    Items = items,
                    Count = count
                };
            }
            else
            {
                //var newfiltersplits = filter;
                //var filtersplits = newfiltersplits.Split('(', ')', ' ');
                //var filterfield = filtersplits[1];
                var filtervalue = filter.Split('(', ')', '\'')[3].ToLowerCase();
                var source = _repo.FindAll()
                    .ProjectTo<EmployeeDto>(_configMapper)
                    .Where(x => x.Code.ToLower().Contains(filtervalue)
               || x.Department.ToLower().Contains(filtervalue)
               || x.FullName.ToLower().Contains(filtervalue)
               ).OrderByDescending(x => x.Id).EJ2OrderBy(orderby);
                var count = await source.CountAsync();
                var items = count > 0 ? await source.Skip(skip).Take(take).ToListAsync() : new List<EmployeeDto> { };

                return new EJ2DataSource
                {
                    Items = items,
                    Count = count
                };
            }

        }

        public async Task<object> LoadData(DataManager data)
        {
            IQueryable<EmployeeDto> datasource = _repo.FindAll().ProjectTo<EmployeeDto>(_configMapper);
            var count = await datasource.CountAsync();
            if (data.Where != null) // for filtering
                datasource = QueryableDataOperations.PerformWhereFilter(datasource, data.Where, data.Where[0].Condition);
            if (data.Sorted != null)//for sorting
                datasource = QueryableDataOperations.PerformSorting(datasource, data.Sorted);
            if (data.Search != null)
                datasource = QueryableDataOperations.PerformSearching(datasource, data.Search);
            count = await datasource.CountAsync();
            if (data.Skip >= 0)//for paging
                datasource = QueryableDataOperations.PerformSkip(datasource, data.Skip);
            if (data.Take > 0)//for paging
                datasource = QueryableDataOperations.PerformTake(datasource, data.Take);
            return new
            {
                Result = await datasource.ToListAsync(),
                Count = count
            };
        }

        public Task<OperationResult> Insert(CRUDModel<EmployeeDto> value)
        {
            throw new NotImplementedException();
        }
    }
}
