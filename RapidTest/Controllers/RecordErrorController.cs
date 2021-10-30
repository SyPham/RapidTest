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
    public class RecordErrorController : ApiControllerBase
    {
        private readonly IRecordErrorService _service;

        public RecordErrorController(IRecordErrorService service)
        {
            _service = service;
        }
       
        [HttpGet]
        public async Task<ActionResult> GetAllAsync()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet]
        public async Task<ActionResult> GetAccessFailed()
        {
            return Ok(await _service.GetAccessFailed());
        }
        [HttpGet]
        public async Task<ActionResult> GetRecordError()
        {
            return Ok(await _service.GetRecordError());
        }
        [HttpPost]
        public async Task<ActionResult> AddAsync([FromBody] RecordErrorDto model)
        {
            return StatusCodeResult(await _service.AddAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] RecordErrorDto model)
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
