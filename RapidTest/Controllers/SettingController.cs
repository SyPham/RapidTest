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
using System.Globalization;

namespace RapidTest.Controllers
{
    public class SettingController : ApiControllerBase
    {
        private readonly ISettingService _service;

        public SettingController(ISettingService service)
        {
            _service = service;
        }
        private List<CurrentWeekDto> GetCurrentWeek()
        {
            DateTime startOfWeek = DateTime.Today.AddDays(
        (int)CultureInfo.CurrentCulture.DateTimeFormat.FirstDayOfWeek -
        (int)DateTime.Today.DayOfWeek);


            List<CurrentWeekDto> result = Enumerable
                .Range(0, 7)
                .Select(i => new CurrentWeekDto
                {
                    DateTime = startOfWeek
                .AddDays(i).ToLocalTime(),
                    DayOfWeek = Enum.GetName((DayOfWeek)i)
                }
                ).ToList();
            return result;
        }
        [HttpGet]
        public async Task<ActionResult> GetAllAsync()
        {
            var data = await _service.GetAllAsync();
            foreach (var s in data)
            {
                s.DateTime = GetCurrentWeek().Any(x => x.DayOfWeek == s.DayOfWeek) ?
                  GetCurrentWeek().FirstOrDefault(x => x.DayOfWeek == s.DayOfWeek).DateTime.ToString("MM/dd/yyyy") : "";
                s.ExpiryTime = GetCurrentWeek().Any(x => x.DayOfWeek == s.DayOfWeek) ?
                   GetCurrentWeek().FirstOrDefault(x => x.DayOfWeek == s.DayOfWeek).DateTime.AddDays(s.Day + 1).AddHours(s.Hours).ToString("MM/dd/yyyy HH:mm:ss") : "";
            }
            return Ok(data);
        }

        [HttpPost]
        public async Task<ActionResult> AddAsync([FromBody] SettingDto model)
        {
            return StatusCodeResult(await _service.AddAsync(model));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAsync([FromBody] SettingDto model)
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
        [HttpPut]
        public async Task<ActionResult> UpdateDescription([FromBody] UpdateDescriptionRequestDto model)
        {
            return StatusCodeResult(await _service.UpdateDescription(model));
        }
        [HttpPut]
        public async Task<ActionResult> ToggleIsDefault(int id)
        {
            return StatusCodeResult(await _service.ToggleIsDefault(id));
        }
    }
}
