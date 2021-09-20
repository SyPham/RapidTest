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
    public class AccountGroupController : ApiControllerBase
    {
        private readonly IAccountGroupService _service;

        public AccountGroupController(IAccountGroupService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<ActionResult> GetAccountGroupForTodolistByAccountId()
        {
            return Ok((await _service.GetAccountGroupForTodolistByAccountId()).OrderBy(x => x.Sequence));
        }
        [HttpGet]
        public async Task<ActionResult> GetAllAsync()
        {
            return Ok((await _service.GetAllAsync()).OrderBy(x=>x.Sequence));
        }

        [HttpPost]
        public async Task<ActionResult> AddAsync([FromBody] AccountGroupDto model)
        {
            return StatusCodeResult(await _service.AddAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] AccountGroupDto model)
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
