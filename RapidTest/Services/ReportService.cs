﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
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
        Task<OperationResult> ScanQRCode(ScanQRCodeRequestDto request); //Check Out

        Task<List<ReportDto>> Filter(DateTime startDate, DateTime endDate, string code);
        Task<Byte[]> RapidTestReport(DateTime startTime, DateTime endTime);
    }
    public class ReportService : ServiceBase<Report, ReportDto>, IReportService
    {
        private readonly IRepositoryBase<Report> _repo;
        private readonly IRepositoryBase<Setting> _repoSetting;
        private readonly IRepositoryBase<Employee> _repoEmployee;
        private readonly IRepositoryBase<CheckIn> _repoCheckIn;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        private OperationResult operationResult;

        public ReportService(
            IRepositoryBase<Report> repo,
            IRepositoryBase<Setting> repoSetting,
            IRepositoryBase<Employee> repoEmployee,
            IRepositoryBase<CheckIn> repoCheckIn,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            MapperConfiguration configMapper
            )
            : base(repo, unitOfWork, mapper, configMapper)
        {
            _repo = repo;
            _repoSetting = repoSetting;
            _repoEmployee = repoEmployee;
            _repoCheckIn = repoCheckIn;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configMapper = configMapper;
        }

        public async Task<List<ReportDto>> Filter(DateTime startDate, DateTime endDate, string code)
        {
            if (string.IsNullOrEmpty(code))
                return await _repo.FindAll(x => x.CreatedTime.Date >= startDate.Date && x.CreatedTime.Date <= endDate.Date)
               .ProjectTo<ReportDto>(_configMapper).ToListAsync();
            else return await _repo.FindAll(x => x.CreatedTime.Date >= startDate.Date && x.CreatedTime.Date <= endDate.Date && x.Employee.Code.Contains(code))
              .ProjectTo<ReportDto>(_configMapper).ToListAsync();
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
            var checkIn = await _repoCheckIn.FindAll(x=> x.Employee.Code == employee.Code && x.CreatedTime.Date == DateTime.Now.Date).FirstOrDefaultAsync();
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
            var setting = await _repoSetting.FindAll().FirstOrDefaultAsync();
            var daySetting = setting.Day;
            var expiryTime = DateTime.Now.AddDays(daySetting).Date;
            var data = new Report
            {
                TestKindId = request.KindId,
                EmployeeId = employee.Id,
                Result = Result.Negative,
                ExpiryTime = expiryTime
            };
            try
            {
                _repo.Add(data);
                await _unitOfWork.SaveChangeAsync();
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
            return  ExcelExport(data);
        }
    }
}
