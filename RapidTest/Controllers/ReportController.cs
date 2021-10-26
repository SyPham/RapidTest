using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RapidTest.DTO;
using RapidTest.Helpers;
using RapidTest.Services;
using System;
using System.Threading.Tasks;


namespace RapidTest.Controllers
{
    public class ReportController : ApiControllerBase
    {
        private readonly IReportService _service;

        public ReportController(IReportService service)
        {
            _service = service;
        }
       
        [HttpGet]
        public async Task<ActionResult> GetAllAsync()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpPost]
        public async Task<ActionResult> AddAsync([FromBody] ReportDto model)
        {
            return StatusCodeResult(await _service.AddAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] ReportDto model)
        {
            return StatusCodeResult(await _service.UpdateAsync(model));
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteAsync(int id)
        {
            return StatusCodeResult(await _service.DeleteAsync(id));
        }
        [HttpDelete]
        public async Task<ActionResult> DeleteCheckIn(int id)
        {
            return StatusCodeResult(await _service.DeleteCheckIn(id));
        }
        [HttpGet]
        public async Task<ActionResult> GetByIdAsync(int id)
        {
            return Ok(await _service.GetByIdAsync(id));
        }
        [HttpGet]
        public async Task<ActionResult> Filter(DateTime date, string code)
        {
            var queryString = Request.Query;
            int skip = Convert.ToInt32(queryString["$skip"]);
            int take = Convert.ToInt32(queryString["$top"]);
            string orderBy = queryString["$orderby"];

            var data = await _service.Filter(skip, take, orderBy, date, code);
            return Ok(data);
        }
        [HttpGet]
        public async Task<ActionResult> CheckInFilter(DateTime date, string code)
        {
            return Ok(await _service.CheckInFilter(date, code));
        }
        [HttpGet]
        public async Task<ActionResult> GetWithPaginationsAsync(PaginationParams paramater)
        {
            return Ok(await _service.GetWithPaginationsAsync(paramater));
        }
        [HttpPost]
        public async Task<ActionResult> ScanQRCode([FromBody] ScanQRCodeRequestDto request)
        {
            return StatusCodeResult(await _service.ScanQRCode(request));
        }
        [HttpPost]
        public async Task<ActionResult> ImportExcel([FromForm] IFormFile file)
        {
            return Ok(await _service.ImportExcel());
        }
        [HttpGet]
        public async Task<ActionResult> RapidTestReport()
        {
            DateTime startDate = DateTime.Now;
            DateTime endDate = DateTime.Now;
            var bin = await _service.RapidTestReport(startDate, endDate);
            return File(bin, "application/octet-stream", "Rapid Test Report.xlsx");
        }
        [HttpGet]
        public async Task<ActionResult> Dashboard(DateTime startDate, DateTime endDate)
        {
            return Ok(await _service.Dashboard(startDate, endDate));

        }
        [HttpGet]
        public async Task<ActionResult> CountWorkerScanQRCodeByToday()
        {
            return Ok(await _service.CountWorkerScanQRCodeByToday());

        }
        [HttpGet]
        public async Task<IActionResult> ExportEmployeeExcel()
        {
            var bin = await _service.ExportExcel();
            return File(bin, "application/octet-stream", $"Rapid-Test-Report{DateTime.Now.ToString("MMddyyyy")}.xlsx");
        }
        [HttpGet]
        public async Task<IActionResult> ExportExcelAllDataRapidTest(DateTime date)
        {
            var bin = await _service.ExportExcelAllDataRapidTest(date);
            return File(bin, "application/octet-stream", $"Rapid-Test-Report{DateTime.Now.ToString("MMddyyyy")}.xlsx");
        }
    }
}
