using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
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
        Task<List<ReportDto>> Filter(DateTime startDate, DateTime endDate, string code);
        Task<List<CheckInDto>> CheckInFilter(DateTime date, string code);
        Task<Byte[]> RapidTestReport(DateTime startTime, DateTime endTime);
    }
    public class ReportService : ServiceBase<Report, ReportDto>, IReportService
    {
        private readonly IRepositoryBase<Report> _repo;
        private readonly IRepositoryBase<BlackList> _repoBlackList;
        private readonly IRepositoryBase<FactoryReport> _repoFactoryReport;
        private readonly IRepositoryBase<Setting> _repoSetting;
        private readonly IRepositoryBase<Models.TestKind> _repoTestKind;
        private readonly IRepositoryBase<Employee> _repoEmployee;
        private readonly IRepositoryBase<CheckIn> _repoCheckIn;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private OperationResult operationResult;

        public ReportService(
            IRepositoryBase<Report> repo,
            IRepositoryBase<BlackList> repoBlackList,
            IRepositoryBase<FactoryReport> repoFactoryReport,
            IRepositoryBase<Setting> repoSetting,
            IRepositoryBase<Models.TestKind> repoTestKind,

            IRepositoryBase<Employee> repoEmployee,
            IRepositoryBase<CheckIn> repoCheckIn,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            MapperConfiguration configMapper
            )
            : base(repo, unitOfWork, mapper, configMapper)
        {
            _repo = repo;
            _repoBlackList = repoBlackList;
            _repoFactoryReport = repoFactoryReport;
            _repoSetting = repoSetting;
            _repoTestKind = repoTestKind;
            _repoEmployee = repoEmployee;
            _repoCheckIn = repoCheckIn;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configMapper = configMapper;
        }

        public async Task<List<ReportDto>> Filter(DateTime startDate, DateTime endDate, string code)
        {

            if (string.IsNullOrEmpty(code))
            {
                var data = (await _repo.FindAll(x => x.CreatedTime.Date >= startDate.Date && x.CreatedTime.Date <= endDate.Date)
               .ProjectTo<ReportDto>(_configMapper).OrderByDescending(a => a.Id).ToListAsync()).DistinctBy(x => new { x.Code, x.CreatedTime }).ToList();

                return data;
            }
            else
            {
                var data = (await _repo.FindAll(x => x.CreatedTime.Date >= startDate.Date && x.CreatedTime.Date <= endDate.Date && x.Employee.Code.Contains(code))
              .ProjectTo<ReportDto>(_configMapper).OrderByDescending(a => a.Id).ToListAsync()).DistinctBy(x => new { x.Code, x.CreatedTime }).ToList();

                return data;
            }
        }

        public async Task<OperationResult> ScanQRCode(ScanQRCodeRequestDto request)
        {
            var employee = await _repoEmployee.FindAll(x => x.Code == request.QRCode).FirstOrDefaultAsync();
            if (employee == null)
            {
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "The QRCode not exist!",
                    Success = true,
                    Data = null
                };
            }
            if (!employee.SEAInform)
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "No entry.Please wait for SEA inform !",
                    Success = true,
                    Data = null
                };
            var checkBlackList = _repoBlackList.FindAll(x => x.EmployeeId == employee.Id && !x.IsDelete).Any();

            if (checkBlackList && request.KindId == Result.Negative)
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.Forbidden,
                    Message = $"<h2>This person is in SEA blacklist , do not allow him or her pass this station<br>Người này nằm trong danh sách đen của nhân sự, không được để anh ấy hoặc cô ấy đi qua chốt này</h2>",
                    Success = true,
                    Data = null
                };

            if (request.KindId == 0)
            {
                operationResult = new OperationResult
                {
                    StatusCode = HttpStatusCode.Forbidden,
                    Message = $"<h2>Please select a test kind! ,<br><span>Vui lòng chọn loại xét nghiệm!</span></h2>",
                    Success = false,
                    Data = null
                };
            }
            var teskind = await _repoTestKind.FindAll(x => x.Id == request.KindId).FirstOrDefaultAsync();
            var checkIn = new CheckIn();
            if (teskind.Name == TestKindConstant.RAPID_TEST_TEXT)
                checkIn = await _repoCheckIn.FindAll(x => x.Employee.Code == employee.Code && x.CreatedTime.Date == DateTime.Now.Date).OrderByDescending(x => x.Id).FirstOrDefaultAsync();
            else
                checkIn = await _repoCheckIn.FindAll(x => x.Employee.Code == employee.Code && x.TestKindId == request.KindId && x.TestKindId == TestKindConstant.PCR).OrderByDescending(x => x.Id).FirstOrDefaultAsync();
            if (checkIn == null)
            {
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
            var mins = employee.Setting.Mins;
            var checkOutTime = DateTime.Now.AddMinutes(-mins);
            if (checkOutTime < checkIn.CreatedTime)
            {
                var checkOutHour = checkIn.CreatedTime.AddMinutes(mins).ToString("HH:mm:ss");
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.Forbidden,
                    Message = $"<h2>Please wait until {checkOutHour}!<br><span>Vui lòng đợt đến {checkOutHour}!</h2>",
                    Success = true,
                    Data = null
                };
            }
            var checkExist = _repo.FindAll(x => x.EmployeeId == employee.Id && x.TestKindId == request.KindId && x.CreatedTime.Date == DateTime.Now.Date).Any();

            if (checkExist)
                return new OperationResult
                {
                    StatusCode = HttpStatusCode.Forbidden,
                    Message = $"<h2>Số thẻ {request.QRCode} đã có kết quả xét nghiệm! <br> Already checked out !</h2>",
                    Success = true,
                    Data = null
                };
            var setting = await _repoSetting.FindAll(x => x.SettingType == SettingType.ACCESS_DAY).FirstOrDefaultAsync();
            var daySetting = setting.Day;
            var expiryTime = DateTime.Now.AddDays(daySetting).Date;
            var data = new Report
            {
                TestKindId = request.KindId,
                EmployeeId = employee.Id,
                Result = request.Result,
                ExpiryTime = expiryTime
            };
            try
            {
                _repo.Add(data);
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
            return ExcelExport(data);
        }

        public async Task<object> Dashboard(DateTime startTime, DateTime endTime)
        {
            var checkIn = await _repoCheckIn.FindAll(x => x.CreatedTime.Date >= startTime.Date && x.CreatedTime.Date <= endTime.Date).Select(x => x.EmployeeId).Distinct().CountAsync();
            var checkOutPositive = await _repo.FindAll(x => x.CreatedTime.Date >= startTime.Date && x.CreatedTime.Date <= endTime.Date && x.Result == Result.Positive).Select(x => x.EmployeeId).Distinct().CountAsync();
            var checkOutNegative = await _repo.FindAll(x => x.CreatedTime.Date >= startTime.Date && x.CreatedTime.Date <= endTime.Date && x.Result == Result.Negative).Select(x => x.EmployeeId).Distinct().CountAsync();
            var accessControl = await _repoFactoryReport.FindAll(x => x.CreatedTime.Date >= startTime.Date && x.CreatedTime.Date <= endTime.Date).Select(x => x.EmployeeId).Distinct().CountAsync();
            var employee = await _repoEmployee.FindAll(x => x.SEAInform).CountAsync();
            var comeToWork = await _repoEmployee.FindAll(x => x.Setting != null && x.Setting.IsDefault).CountAsync();
            var baTaiCho = await _repoEmployee.FindAll(x => x.Setting != null && !x.Setting.IsDefault).CountAsync();


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
                         y = checkOutPositive,
                         x = "Check Out (+)"
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
                var data = (await _repoCheckIn.FindAll(x => x.CreatedTime.Date == date.Date)
               .ProjectTo<CheckInDto>(_configMapper).OrderByDescending(a => a.Id).ToListAsync()).DistinctBy(x => new { x.Code, x.CreatedTime }).ToList();
                return data;
            }
            else
            {
                var data = (await _repoCheckIn.FindAll(x => x.CreatedTime.Date == date.Date && x.Employee.Code.Contains(code))
              .ProjectTo<CheckInDto>(_configMapper).OrderByDescending(a => a.Id).ToListAsync()).DistinctBy(x => new { x.Code, x.CreatedTime }).ToList();
                return data;
            }
        }

        public async Task<object> CountWorkerScanQRCodeByToday()
        {
            var total = await _repo.FindAll(x => x.CreatedTime.Date == DateTime.Now.Date).Select(x => x.EmployeeId).Distinct().CountAsync();
            return total;
        }
    }
}
