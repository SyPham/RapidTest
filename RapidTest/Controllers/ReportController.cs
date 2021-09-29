using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RapidTest.DTO;
using RapidTest.Helpers;
using RapidTest.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RapidTest.Constants;

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

        [HttpGet]
        public async Task<ActionResult> GetByIdAsync(int id)
        {
            return Ok(await _service.GetByIdAsync(id));
        }
        [HttpGet]
        public async Task<ActionResult> Filter(DateTime startDate, DateTime endDate, string code)
        {
            return Ok(await _service.Filter(startDate, endDate, code));
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
    }
}
