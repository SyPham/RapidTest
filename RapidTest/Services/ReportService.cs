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
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace RapidTest.Services
{
    public interface IReportService : IServiceBase<Report, ReportDto>
    {
        /// <summary>
        /// Check out
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        Task<OperationResult> ScanQRCode(ScanQRCodeRequestDto request); //Check Out
        Task<object> Dashboard(DateTime startTime, DateTime endTime);
        Task<object> CountWorkerScanQRCodeByToday();
        Task<object> Filter(int skip, int take, string orderby, DateTime startDate, string code);
        Task<List<CheckInDto>> CheckInFilter(DateTime date, string code);
        Task<Byte[]> RapidTestReport(DateTime startTime, DateTime endTime);

        Task<OperationResult> DeleteCheckIn(object id);
        Task<bool> ImportExcel();
        Task<byte[]> ExportExcel();
        Task<byte[]> ExportExcelAllData(DateTime date);
        Task<byte[]> ExportExcelAllDataRapidTest(DateTime date);
    }
    public class ReportService : ServiceBase<Report, ReportDto>, IReportService
    {
        private readonly IRepositoryBase<Report> _repo;
        private readonly IRepositoryBase<RecordError> _repoRecordError;
        private readonly IRepositoryBase<BlackList> _repoBlackList;
        private readonly IRepositoryBase<FactoryReport> _repoFactoryReport;
        private readonly IRepositoryBase<Setting> _repoSetting;
        private readonly IRepositoryBase<Models.TestKind> _repoTestKind;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly IRepositoryBase<Employee> _repoEmployee;
        private readonly IRepositoryBase<CheckIn> _repoCheckIn;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private OperationResult operationResult;

        public ReportService(
            IRepositoryBase<Report> repo,
            IRepositoryBase<RecordError> repoRecordError,
            IRepositoryBase<BlackList> repoBlackList,
            IRepositoryBase<FactoryReport> repoFactoryReport,
            IRepositoryBase<Setting> repoSetting,
            IRepositoryBase<Models.TestKind> repoTestKind,
            IServiceScopeFactory serviceScopeFactory,
            IRepositoryBase<Employee> repoEmployee,
            IRepositoryBase<CheckIn> repoCheckIn,
            IUnitOfWork unitOfWork,
            IHttpContextAccessor httpContextAccessor,
            IMapper mapper,
            MapperConfiguration configMapper
            )
            : base(repo, unitOfWork, mapper, configMapper)
        {
            _repo = repo;
            _repoRecordError = repoRecordError;
            _repoBlackList = repoBlackList;
            _repoFactoryReport = repoFactoryReport;
            _repoSetting = repoSetting;
            _repoTestKind = repoTestKind;
            _serviceScopeFactory = serviceScopeFactory;
            _repoEmployee = repoEmployee;
            _repoCheckIn = repoCheckIn;
            _unitOfWork = unitOfWork;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
            _configMapper = configMapper;
        }

        public async Task<object> Filter(int skip, int take, string orderby, DateTime startDate, string code)
        {
            if (string.IsNullOrEmpty(code))
            {
                var source = _repo.FindAll(x => !x.IsDelete && x.CreatedTime.Date == startDate.Date)
               .ProjectTo<ReportDto>(_configMapper).OrderByDescending(x => x.CreatedTime).EJ2OrderBy(orderby);

                var count = await source.CountAsync();
                var items = count > 0 ? await source.Skip(skip).Take(take).ToListAsync() : new List<ReportDto> { };
                items = items.DistinctBy(x => new { x.Code, x.CreatedTime }).ToList();

                return new EJ2DataSource
                {
                    Items = items,
                    Count = count
                };
            }
            else
            {
                var source = _repo.FindAll(x => !x.IsDelete && x.CreatedTime.Date == startDate.Date && x.Employee.Code.Contains(code))
               .ProjectTo<ReportDto>(_configMapper).OrderByDescending(x => x.CreatedTime).EJ2OrderBy(orderby);

                var count = await source.CountAsync();
                var items = count > 0 ? await source.Skip(skip).Take(take).ToListAsync() : new List<ReportDto> { };
                items = items.DistinctBy(x => new { x.Code, x.CreatedTime }).ToList();

                return new EJ2DataSource
                {
                    Items = items,
                    Count = count
                };
            }
        }
        private void Logging(int? employeeId, string station, string reason)
        {
            _ = Task.Run(async () =>
            {
                var accessToken = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
                int accountId = JWTExtensions.GetDecodeTokenById(accessToken);
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
        public async Task<OperationResult> ScanQRCode(ScanQRCodeRequestDto request)
        {
            try
            {
                var employee = await _repoEmployee.FindAll(x => x.Code == request.QRCode).FirstOrDefaultAsync();
                if (employee == null)
                {

                    Logging(
                        null,
                        Station.CHECK_OUT,
                        $" (QR Code Input: {request.QRCode}) " + ErrorKindMessage.WRONG_CODE
                        );
                    return new OperationResult
                    {
                        StatusCode = HttpStatusCode.NotFound,
                        Message = "The QR Code not exist!",
                        Success = true,
                        Data = null
                    };
                }
                if (!employee.SEAInform)
                {

                    Logging(
                           employee.Id,
                           Station.CHECK_OUT,
                           ErrorKindMessage.SEA_INFORM
                           );
                    return new OperationResult
                    {
                        StatusCode = HttpStatusCode.BadRequest,
                        Message = "No entry.Please wait for SEA inform !",
                        Success = true,
                        Data = null
                    };
                }

                var checkBlackList = await _repoBlackList.FindAll(x => x.EmployeeId == employee.Id && !x.IsDelete).AnyAsync();

                if (checkBlackList && request.Result == Result.Negative)
                {
                    Logging(
                         employee.Id,
                         Station.CHECK_OUT,
                         ErrorKindMessage.BLACK_LIST
                         );
                    return new OperationResult
                    {
                        StatusCode = HttpStatusCode.Forbidden,
                        Message = $"<h2>This person is in SEA blacklist, do not allow him or her pass this station<br>Người này nằm trong danh sách đen của nhân sự, không được để anh ấy hoặc cô ấy đi qua chốt này</h2>",
                        Success = true,
                        Data = null
                    };
                }

                if (request.KindId == 0)
                {
                    operationResult = new OperationResult
                    {
                        StatusCode = HttpStatusCode.Forbidden,
                        Message = $"<h2>Please select a test kind! <br><span>Vui lòng chọn loại xét nghiệm!</span></h2>",
                        Success = false,
                        Data = null
                    };
                }
                var teskind = await _repoTestKind.FindAll(x => x.Id == request.KindId).FirstOrDefaultAsync();
                var checkIn = new CheckIn();
                if (teskind.Name == TestKindConstant.RAPID_TEST_TEXT)
                    checkIn = await _repoCheckIn.FindAll(x => x.Employee.Code == employee.Code && x.CreatedTime.Date == DateTime.Now.Date && !x.IsDelete).OrderByDescending(x => x.Id).FirstOrDefaultAsync();
                else
                    checkIn = await _repoCheckIn.FindAll(x => x.Employee.Code == employee.Code && x.TestKindId == request.KindId && x.TestKindId == TestKindConstant.PCR && !x.IsDelete).OrderByDescending(x => x.Id).FirstOrDefaultAsync();
                if (checkIn == null)
                {
                    Logging(
                          employee.Id,
                          Station.CHECK_OUT,
                          ErrorKindMessage.NOT_CHECK_IN
                          );
                    return new OperationResult
                    {
                        StatusCode = HttpStatusCode.BadRequest,
                        Message = "Please check in first!",
                        Success = true,
                        Data = null
                    };
                }
                if (employee.Setting == null)
                    return new OperationResult
                    {
                        StatusCode = HttpStatusCode.Forbidden,
                        Message = $"<h2>Vui lòng cài đặt hình thức đi làm (3 tại chỗ hoặc đi làm)! Please set up kind on staff info page</h2>",
                        Success = true,
                        Data = null
                    };

                var mins = employee.Setting.Mins + 1;
                var checkOutTime = DateTime.Now.AddMinutes(-mins).ToRemoveSecond();

                var checkInTime = checkIn.CreatedTime.ToRemoveSecond();
                if (checkOutTime < checkInTime)
                {
                    Logging(
                          employee.Id,
                          Station.CHECK_OUT,
                          ErrorKindMessage.NOT_ENOUGHT_WAITING_TIME
                          );
                    var checkOutHour = checkInTime.AddMinutes(mins).ToString("HH:mm:ss");
                    return new OperationResult
                    {
                        StatusCode = HttpStatusCode.Forbidden,
                        Message = $"<h2>Please wait until {checkOutHour}!<br><span>Vui lòng đợt đến {checkOutHour}!</h2>",
                        Success = true,
                        Data = null
                    };
                }
                var checkExist = await _repo.FindAll(x => x.EmployeeId == employee.Id && x.TestKindId == request.KindId && x.CreatedTime.Date == DateTime.Now.Date && !x.IsDelete).AnyAsync();

                if (checkExist)
                {
                    Logging(
                         employee.Id,
                         Station.CHECK_OUT,
                         ErrorKindMessage.ALREADY_CHECK_OUT
                         );
                    return new OperationResult
                    {
                        StatusCode = HttpStatusCode.Forbidden,
                        Message = $"<h2>Số thẻ {request.QRCode} đã có kết quả xét nghiệm! <br> Already checked out !</h2>",
                        Success = true,
                        Data = null
                    };
                }

                string dayOfWeek = Enum.GetName(DateTime.Now.DayOfWeek);

                var setting = await _repoSetting.FindAll(x => x.ParentId == employee.SettingId && x.DayOfWeek == dayOfWeek).FirstOrDefaultAsync();
                var expiryTime = DateTime.Now.AddDays(setting.Day + 1).Date.AddHours(setting.Hours);
                var data = new Report
                {
                    TestKindId = request.KindId,
                    EmployeeId = employee.Id,
                    Result = request.Result,
                    ExpiryTime = expiryTime
                };

                await _repo.AddAsync(data);
                await _unitOfWork.SaveChangeAsync();

                if (request.Result == Result.Negative)
                {
                    operationResult = new OperationResult
                    {
                        StatusCode = HttpStatusCode.OK,
                        Message = $"<h2>Result is negative. Record successfully! ,<br><span>Kết quả là âm tính. Được phép vào nhà máy!</span></h2>",
                        Success = true,
                        Data = employee
                    };
                }
                else
                {
                    operationResult = new OperationResult
                    {
                        StatusCode = HttpStatusCode.Forbidden,
                        Message = $"<h2>Result is positive. No Entry! ,<br><span>Kết quả là dương tính. Không được phép vào nhà máy!</span></h2>",
                        Success = true,
                        Data = employee
                    };
                }

            }
            catch (Exception ex)
            {
                operationResult = ex.GetMessageError();
                Logging(
                    null,
                    Station.CHECK_OUT,
                    $"{Station.CHECK_OUT}: {ex.Message}"
                    );
            }
            return operationResult;
        }

        public Byte[] ExcelExport(List<ReportDto> model)
        {
            try
            {
                var currentTime = DateTime.Now;
                ExcelPackage.LicenseContext = LicenseContext.Commercial;
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                var memoryStream = new MemoryStream();
                using (ExcelPackage p = new ExcelPackage(memoryStream))
                {
                    // đặt tên người tạo file
                    p.Workbook.Properties.Author = "Henry Pham";

                    // đặt tiêu đề cho file
                    p.Workbook.Properties.Title = "Rapid Test Result";
                    //Tạo một sheet để làm việc trên đó
                    p.Workbook.Worksheets.Add("Rapid Test Result");

                    // lấy sheet vừa add ra để thao tác
                    ExcelWorksheet ws = p.Workbook.Worksheets["Rapid Test Result"];

                    // đặt tên cho sheet
                    ws.Name = "Rapid Test Result";
                    // fontsize mặc định cho cả sheet
                    ws.Cells.Style.Font.Size = 11;
                    // font family mặc định cho cả sheet
                    ws.Cells.Style.Font.Name = "Times New Roman";

                    ws.Cells["A1"].Value = "CÔNG TY TNHH SHYANG HUNG CHENG";
                    ws.Cells["A1:C1"].Merge = true;

                    ws.Cells["G1"].Value = "PHÒNG KHÁM ÁI NGHĨA";
                    ws.Cells["G1:H1"].Merge = true;

                    ws.Cells["A3"].Style.WrapText = true;
                    ws.Cells["A3"].RichText.Add("KẾT QUẢ TEST COVID-19\r\nCÔNG TY TNHH SHYANG HUNG CHENG NĂM 2021\r\n翔鴻程責任有限公司2021年COVID - 19檢測結果");
                    ws.Cells["A3:H3"].Style.Font.Size = 20;
                    ws.Cells["A3:H3"].Style.Font.Bold = true;
                    ws.Cells["A3:H3"].Merge = true;
                    ws.Cells["A3:H3"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    ws.Cells["A3:H3"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;


                    //Multiple Fonts in the same cell
                    ExcelRange rg = ws.Cells["A4"];
                    rg.IsRichText = true;
                    ExcelRichText text1 = rg.RichText.Add("STT");
                    text1.Bold = true;
                    ExcelRichText text2 = rg.RichText.Add("序");
                    text2.Bold = true;
                    text2.Color = System.Drawing.Color.Blue;



                    ws.Cells["B4"].Value = "Số thẻ 工號";
                    ws.Cells["C4"].Value = "Đơn vị 單位";
                    ws.Cells["D4"].Value = "Họ & Tên 姓名";
                    ws.Cells["E4"].Value = "Giới tín h性別";
                    ws.Cells["F4"].Value = "Năm sinh 出生年月日";
                    ws.Cells["G4"].Value = "Kết Quả Test 檢測結果";
                    ws.Cells["H4"].Value = "Ghi chú 備註";

                    int bodyRowIndex = 1;
                    int bodyColIndex = 1;

                    foreach (var bodyItem in model)
                    {
                        bodyColIndex = 1;
                        bodyRowIndex++;

                        var sequenceExcelRange = ws.Cells[bodyRowIndex, bodyColIndex++];
                    }
                    //Make all text fit the cells
                    //ws.Cells[ws.Dimension.Address].AutoFitColumns();
                    ws.Cells[ws.Dimension.Address].Style.Font.Bold = true;
                    ws.Cells[ws.Dimension.Address].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    ws.Cells[ws.Dimension.Address].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                    //make the borders of cell F6 thick
                    ws.Cells[ws.Dimension.Address].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    ws.Cells[ws.Dimension.Address].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    ws.Cells[ws.Dimension.Address].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    ws.Cells[ws.Dimension.Address].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    ws.Row(1).Height = 30;
                    ws.Row(3).Height = 80;
                    ws.Row(4).Height = 30;
                    ws.Column(4).Width = 60;
                    ws.Cells[ws.Dimension.Address].AutoFitColumns();
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

        public async Task<byte[]> RapidTestReport(DateTime startTime, DateTime endTime)
        {
            var data = new List<ReportDto>();
            return await Task.FromResult(ExcelExport(data));
        }

        public async Task<object> Dashboard(DateTime startTime, DateTime endTime)
        {
            var checkIn = await _repoCheckIn.FindAll(x => !x.IsDelete && x.CreatedTime.Date == startTime.Date).Select(x => x.EmployeeId).Distinct().CountAsync();
            var checkOutNegative = await _repo.FindAll(x => !x.IsDelete && x.CreatedTime.Date == startTime.Date && x.Result == Result.Negative).Select(x => x.EmployeeId).Distinct().CountAsync();
            var accessControl = await _repoFactoryReport.FindAll(x => !x.IsDelete && x.CreatedTime.Date == startTime.Date).Select(x => x.EmployeeId).Distinct().CountAsync();
            var employee = await _repoEmployee.FindAll(x => x.SEAInform).CountAsync();
            var comeToWork = await _repoEmployee.FindAll(x => x.Setting != null && x.Setting.IsDefault).CountAsync();
            var baTaiCho = await _repoEmployee.FindAll(x => x.Setting != null && !x.Setting.IsDefault).CountAsync();

            var positiveToday = await _repoBlackList.FindAll(x => !x.IsDelete && x.CreatedTime.Date == startTime.Date).Select(x => x.EmployeeId).Distinct().CountAsync();
            var positiveBefore = await _repoBlackList.FindAll(x => !x.IsDelete && x.CreatedTime.Date < startTime.Date).Select(x => x.EmployeeId).Distinct().CountAsync();

            return new
            {
                data = new object[]
            {
                new {
                         y = employee,
                         x = "SEA Informed"
                  },

                   new {
                         y = baTaiCho,
                         x = "3 tại chỗ"
                  },
                      new {
                         y = comeToWork,
                         x = "Đi làm"
                  },
                      new {
                         y = checkIn,
                         x = "Check In"
                  },
                new {
                         y = checkOutNegative,
                         x = "Check Out (-)"
                  },
                new {
                         y = positiveToday,
                         x = "Positive (today)"
                  },
                  new {
                         y = positiveBefore,
                         x = "Positive (before)"
                  },
                new {
                         y = accessControl,
                         x = "Access Control"
                  }
            }
            };
        }

        public async Task<List<CheckInDto>> CheckInFilter(DateTime date, string code)
        {
            if (string.IsNullOrEmpty(code))
            {
                var data = (await _repoCheckIn.FindAll(x => !x.IsDelete && x.CreatedTime.Date == date.Date)
               .ProjectTo<CheckInDto>(_configMapper).OrderByDescending(a => a.Id).ToListAsync()).DistinctBy(x => new { x.Code, x.CreatedTime }).ToList();
                return data;
            }
            else
            {
                var data = (await _repoCheckIn.FindAll(x => !x.IsDelete && x.CreatedTime.Date == date.Date && x.Employee.Code.Contains(code))
              .ProjectTo<CheckInDto>(_configMapper).OrderByDescending(a => a.Id).ToListAsync()).DistinctBy(x => new { x.Code, x.CreatedTime }).ToList();
                return data;
            }
        }

        public async Task<object> CountWorkerScanQRCodeByToday()
        {
            var total = await _repo.FindAll(x => !x.IsDelete && x.CreatedTime.Date == DateTime.Now.Date).Select(x => x.EmployeeId).Distinct().CountAsync();
            return total;
        }

        public async Task<OperationResult> DeleteCheckIn(object id)
        {
            var item = _repoCheckIn.FindById(id);
            item.IsDelete = true;
            item.DeletedTime = DateTime.Now;

            _repoCheckIn.Update(item);
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
        public override async Task<OperationResult> DeleteAsync(object id)
        {
            var item = _repo.FindById(id);
            item.IsDelete = true;
            item.DeletedTime = DateTime.Now;

            _repo.Update(item);
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
        private Dictionary<string, DateTime> ReadExcel(IFormFile file)
        {
            var list = new Dictionary<string, DateTime>();
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            if ((file != null) && (file.Length > 0) && !string.IsNullOrEmpty(file.FileName))
            {
                try
                {
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
                            var expiryTime = workSheet.Cells[rowIterator, 3].GetValue<DateTime>();

                            if (!code.IsNullOrEmpty())
                            {
                                list.Add(code, expiryTime);
                            }
                        }
                    }
                    return list;
                }
                catch
                {
                    return list;
                }

            }
            else
            {
                return list;
            }
        }
        public async Task<bool> ImportExcel()
        {
            IFormFile file = _httpContextAccessor.HttpContext.Request.Form.Files["UploadedFile"];
            object createdBy = _httpContextAccessor.HttpContext.Request.Form["CreatedBy"];
            var updateList = new List<Report>();
            var accessToken = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            int accountId = JWTExtensions.GetDecodeTokenById(accessToken);
            var employeeDict = ReadExcel(file);
            int userid = createdBy.ToInt();
            List<String> employeeKeys = employeeDict.Keys.ToList();
            var data = (await _repo.FindAll(x => x.Employee.SEAInform && employeeKeys.Contains(x.Employee.Code)).OrderByDescending(x => x.CreatedTime).ToListAsync()).DistinctBy(x => x.EmployeeId).ToDictionary(x => x.Employee.Code, x => x);

            try
            {
                foreach (var item in employeeDict)
                {
                    var itemDataDict = data.Where(x => x.Key == item.Key).FirstOrDefault();
                    var itemData = itemDataDict.Value;
                    if (itemData.ExpiryTime != item.Value)
                    {
                        itemData.ExpiryTime = item.Value;
                        itemData.ModifiedBy = userid;
                        itemData.ModifiedTime = DateTime.Now;
                        updateList.Add(itemData);

                    }
                }
                _repo.UpdateRange(updateList);
                await _unitOfWork.SaveChangeAsync();
                return true;

            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public async Task<bool> ImportExcel2()
        {
            IFormFile file = _httpContextAccessor.HttpContext.Request.Form.Files["UploadedFile"];
            object createdBy = _httpContextAccessor.HttpContext.Request.Form["CreatedBy"];
            var updateList = new List<Report>();
            var accessToken = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            int accountId = JWTExtensions.GetDecodeTokenById(accessToken);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            var data = (await _repo.FindAll(x => x.Employee.SEAInform).OrderByDescending(x => x.CreatedTime).ToListAsync()).DistinctBy(x => x.EmployeeId).AsEnumerable();
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
                            var code = workSheet.Cells[rowIterator, 1].Value.ToSafetyString();
                            var fullName = workSheet.Cells[rowIterator, 2].Value.ToSafetyString();
                            var expiryTime = workSheet.Cells[rowIterator, 3].GetValue<DateTime>();

                            if (!code.IsNullOrEmpty())
                            {
                                // kiểm tra đẫ tồn tại trong db chưa

                                var item = data.Where(x => x.Employee.Code == code).OrderByDescending(x => x.CreatedTime).FirstOrDefault();
                                if (item != null && item.ExpiryTime != expiryTime)
                                {
                                    item.ExpiryTime = expiryTime;
                                    item.ModifiedBy = userid;
                                    item.ModifiedTime = DateTime.Now;
                                    _repo.Update(item);

                                }

                            }
                        }
                    }
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
                var data = (await _repo.FindAll(x => x.Employee.SEAInform).Select(x => new
                {
                    Code = x.Employee.Code,
                    FullName = x.Employee.FullName,
                    ExpiryTime = x.ExpiryTime,
                    x.EmployeeId,
                    x.CreatedTime
                }).OrderByDescending(x => x.CreatedTime).ToListAsync()).DistinctBy(x => x.EmployeeId).ToList();
                var currentTime = DateTime.Now;
                ExcelPackage.LicenseContext = LicenseContext.Commercial;
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                var memoryStream = new MemoryStream();
                using (ExcelPackage p = new ExcelPackage(memoryStream))
                {
                    // đặt tên người tạo file
                    p.Workbook.Properties.Author = "Henry Pham";

                    // đặt tiêu đề cho file
                    p.Workbook.Properties.Title = "Check Out Report";
                    //Tạo một sheet để làm việc trên đó
                    p.Workbook.Worksheets.Add("Check Out Report");

                    // lấy sheet vừa add ra để thao tác
                    ExcelWorksheet ws = p.Workbook.Worksheets["Check Out Report"];

                    // đặt tên cho sheet
                    ws.Name = "Check Out Report";
                    // fontsize mặc định cho cả sheet
                    ws.Cells.Style.Font.Size = 11;
                    // font family mặc định cho cả sheet
                    ws.Cells.Style.Font.Name = "Calibri";
                    var headerArray = new List<string>()
                    {
                        "Số thẻ",
                        "Họ và tên",
                        "Ngày hết hạn"
                    };
                    ws.Cells[$"E1"].Value = "*Note: Cột 'Ngày hết hạn' vui lòng format theo dạng mm/dd/yyyy hh:mm:ss";
                    ws.Cells[$"E1"].Style.Font.Bold = true;
                    ws.Cells[$"E1"].Style.Font.Size = 16;
                    ws.Cells[$"E1"].Style.Font.Color.SetColor(ColorTranslator.FromHtml("#FF0000"));
                    ws.Cells[$"E1"].AutoFitColumns();
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
                        int temp = bodyColIndex++;
                        var exp = ws.Cells[bodyRowIndex, temp];
                        exp.Style.Numberformat.Format = "MM/dd/yyyy HH:mm:ss";

                        exp.Value = bodyItem.ExpiryTime;

                    }


                    //Make all text fit the cells
                    //ws.Cells[ws.Dimension.Address].AutoFitColumns();
                    ws.Cells[$"A1:C{total}"].Style.Font.Bold = true;
                    ws.Cells[$"A1:C{total}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    ws.Cells[$"A1:C{total}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                    //make the borders of cell F6 thick
                    ws.Cells[$"A1:C{total}"].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"A1:C{total}"].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"A1:C{total}"].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"A1:C{total}"].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"A1:C{total}"].AutoFitColumns();

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
        public async Task<byte[]> ExportExcelAllData(DateTime date)
        {
            try
            {
                var data = (await _repo.FindAll(x => x.Employee.SEAInform).Select(x => new
                {
                    Code = x.Employee.Code,
                    FullName = x.Employee.FullName,
                    ExpiryTime = x.ExpiryTime,
                    x.EmployeeId,
                    x.CreatedTime
                }).OrderByDescending(x => x.CreatedTime).ToListAsync()).DistinctBy(x => x.EmployeeId).ToList();
                var currentTime = DateTime.Now;
                ExcelPackage.LicenseContext = LicenseContext.Commercial;
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                var memoryStream = new MemoryStream();
                using (ExcelPackage p = new ExcelPackage(memoryStream))
                {
                    // đặt tên người tạo file
                    p.Workbook.Properties.Author = "Henry Pham";

                    // đặt tiêu đề cho file
                    p.Workbook.Properties.Title = "Check Out Report";
                    //Tạo một sheet để làm việc trên đó
                    p.Workbook.Worksheets.Add("Check Out Report");

                    // lấy sheet vừa add ra để thao tác
                    ExcelWorksheet ws = p.Workbook.Worksheets["Check Out Report"];

                    // đặt tên cho sheet
                    ws.Name = "Check Out Report";
                    // fontsize mặc định cho cả sheet
                    ws.Cells.Style.Font.Size = 11;
                    // font family mặc định cho cả sheet
                    ws.Cells.Style.Font.Name = "Calibri";
                    var headerArray = new List<string>()
                    {
                        "Số thẻ",
                        "Họ và tên",
                        "Ngày hết hạn"
                    };
                    ws.Cells[$"E1"].Value = "*Note: Cột 'Ngày hết hạn' vui lòng format theo dạng mm/dd/yyyy hh:mm:ss";
                    ws.Cells[$"E1"].Style.Font.Bold = true;
                    ws.Cells[$"E1"].Style.Font.Size = 16;
                    ws.Cells[$"E1"].Style.Font.Color.SetColor(ColorTranslator.FromHtml("#FF0000"));
                    ws.Cells[$"E1"].AutoFitColumns();
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
                        int temp = bodyColIndex++;
                        var exp = ws.Cells[bodyRowIndex, temp];
                        exp.Style.Numberformat.Format = "MM/dd/yyyy HH:mm:ss";

                        exp.Value = bodyItem.ExpiryTime;

                    }


                    //Make all text fit the cells
                    //ws.Cells[ws.Dimension.Address].AutoFitColumns();
                    ws.Cells[$"A1:C{total}"].Style.Font.Bold = true;
                    ws.Cells[$"A1:C{total}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    ws.Cells[$"A1:C{total}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                    //make the borders of cell F6 thick
                    ws.Cells[$"A1:C{total}"].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"A1:C{total}"].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"A1:C{total}"].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"A1:C{total}"].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    ws.Cells[$"A1:C{total}"].AutoFitColumns();

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

        public async Task<byte[]> ExportExcelAllDataRapidTest(DateTime date)
        {
            try
            {
                var data = (await _repo.FindAll(x => x.CreatedTime.Date == date.Date && x.Employee.SEAInform).AsNoTracking().Select(x => new
                {
                    Code = x.Employee.Code,
                    FullName = x.Employee.FullName,
                    Department = x.Employee.Department.Code,
                    Kind = x.Employee.SettingId != null ? x.Employee.Setting.Name : "N/A",
                    ExpiryTime = x.ExpiryTime.ToString("MM/dd/yyyy HH:mm:ss"),
                    TestResult = x.Result == 2 ? "Âm tính" : "Dương tính",
                    Gender = x.Employee.Gender == true ? "NAM" : "NỮ",
                    BirthDate = x.Employee.BirthDate.ToString("MM/dd/yyyy"),
                    TestKind = x.TestKind.Name,
                    TestDate = x.CreatedTime.ToString("MM/dd/yyyy"),
                    CreatedTime = x.CreatedTime,
                    CheckOutTime = x.CreatedTime.ToString("MM/dd/yyyy HH:mm:ss"),
                    EmployeeId = x.EmployeeId,
                    CheckInTime = x.Employee.CheckIns.Any(a => a.CreatedTime.Date == x.CreatedTime.Date) ? x.Employee.CheckIns.OrderByDescending(a => a.Id).FirstOrDefault(a => a.CreatedTime.Date == x.CreatedTime.Date).CreatedTime.ToString("MM/dd/yyyy HH:mm:ss") : null,
                    FactoryEntryTime = x.Employee.FactoryReports.Any(a => a.CreatedTime.Date == x.CreatedTime.Date) ? x.Employee.FactoryReports.OrderByDescending(a => a.Id).FirstOrDefault(a => a.CreatedTime.Date == x.CreatedTime.Date).FactoryEntryTime.ToString("MM/dd/yyyy HH:mm:ss") : "",

                }).OrderByDescending(x => x.CreatedTime).ToListAsync()).DistinctBy(x => x.EmployeeId).ToList();
                var currentTime = DateTime.Now;
                ExcelPackage.LicenseContext = LicenseContext.Commercial;
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                var memoryStream = new MemoryStream();
                using (ExcelPackage p = new ExcelPackage(memoryStream))
                {
                    // đặt tên người tạo file
                    p.Workbook.Properties.Author = "Henry Pham";

                    // đặt tiêu đề cho file
                    p.Workbook.Properties.Title = "Check Out Report";
                    //Tạo một sheet để làm việc trên đó
                    p.Workbook.Worksheets.Add("Check Out Report");

                    // lấy sheet vừa add ra để thao tác
                    ExcelWorksheet ws = p.Workbook.Worksheets["Check Out Report"];

                    // đặt tên cho sheet
                    ws.Name = "Check Out Report";
                    // fontsize mặc định cho cả sheet
                    ws.Cells.Style.Font.Size = 11;
                    // font family mặc định cho cả sheet
                    ws.Cells.Style.Font.Name = "Calibri";
                    var headerArray = new List<string>()
                    {
                        "#",
                        "Code",
                        "Department",
                        "FullName",
                         "Gender",
                        "Birth Date",
                        "Test Kind",
                         "Kind",
                        "Test result",
                        "Test date",
                        "Entry factory exp. date",
                        "Check in time",
                        "Check out time",
                         "Entry factory time",
                         "Option"
                    };
                    int headerRowIndex = 1;
                    foreach (var headerItem in headerArray.Select((value, i) => new { i, value }))
                    {
                        var headerColIndex = headerItem.i + 1;
                        ws.Cells[headerRowIndex, headerColIndex].Value = headerItem.value;
                    }

                    int bodyRowIndex = 1;
                    int bodyColIndex = 1;
                    int total = data.Count + 1;
                    int index = 0;

                    foreach (var bodyItem in data)
                    {
                        bodyColIndex = 1;
                        bodyRowIndex++;
                        index++;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = index;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.Code;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.Department;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.FullName;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.Gender;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.BirthDate;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.TestKind;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.Kind;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.TestResult;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.TestDate;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.ExpiryTime;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.CheckInTime;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.CheckOutTime;
                        ws.Cells[bodyRowIndex, bodyColIndex++].Value = bodyItem.FactoryEntryTime;
                    }


                    //Make all text fit the cells
                    //ws.Cells[ws.Dimension.Address].AutoFitColumns();
                    ws.Cells[$"A1:O1"].Style.Font.Bold = true;
                    ws.Cells[$"A1:O1"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    ws.Cells[$"A1:O1"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    ws.Cells[$"A1:O{total}"].AutoFitColumns();

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
    }
}
