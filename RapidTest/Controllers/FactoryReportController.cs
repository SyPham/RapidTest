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
    public class FactoryReportController : ApiControllerBase
    {
        private readonly IFactoryReportService _service;

        public FactoryReportController(IFactoryReportService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<ActionResult> AccessControl(string code)
        {
            return Ok(await _service.AccessControl(code));
        }
        [HttpGet]
        public async Task<ActionResult> GetAllAsync()
        {
            return Ok(await _service.GetAllAsync());
        }
        [HttpGet]
        public async Task<ActionResult> Filter(DateTime startDate, DateTime endDate, string code)
        {
            return Ok(await _service.Filter(startDate, endDate, code));
        }
        [HttpPost]
        public async Task<ActionResult> AddAsync([FromBody] FactoryReportDto model)
        {
            return StatusCodeResult(await _service.AddAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] FactoryReportDto model)
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
        public async Task<ActionResult> GetWithPaginationsAsync(PaginationParams paramater)
        {
            return Ok(await _service.GetWithPaginationsAsync(paramater));
        }

    }
}
