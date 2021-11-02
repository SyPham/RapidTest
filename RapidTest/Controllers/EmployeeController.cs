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
using System.IO;
using Syncfusion.JavaScript;

namespace RapidTest.Controllers
{
    public class EmployeeController : ApiControllerBase
    {
        private readonly IEmployeeService _service;

        public EmployeeController(IEmployeeService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<ActionResult> GetPrintOff()
        {
            return Ok(await _service.GetPrintOff());
        }
        [HttpGet]
        public async Task<ActionResult> GetAllAsync()
        {
            return Ok(await _service.GetAllAsync());
        }

        #region CURD, sort, filter, EJ2 Grid WebApiAdaptor
        
        [HttpGet]
        public async Task<ActionResult> Filter()
        {
            var queryString = Request.Query;
            string filter = queryString["$filter"];
            int skip = Convert.ToInt32(queryString["$skip"]);
            int take = Convert.ToInt32(queryString["$top"]);
            string orderBy = queryString["$orderby"];
            var data = await _service.Filter(skip, take, orderBy, filter);
            return Ok(data);
        }
        [HttpPost]
        [HttpPut]
        public async Task<ActionResult> Filter([FromBody] EmployeeDto model)
        {
            if (model.Id == 0)
            {
                return StatusCodeResult(await _service.AddAsync(model));
            }
            return StatusCodeResult(await _service.UpdateAsync(model));
        } 
        #endregion

        #region CURD, sort, filter, EJ2 Grid UrlAdaptor
        [HttpPost]
        public async Task<ActionResult> LoadData([FromBody] DataManager request)
        {

            var data = await _service.LoadData(request);
            return Ok(data);
        }
        [HttpPost]
        public async Task<ActionResult> AddAsync([FromBody] CRUDModel<EmployeeDto> model)
        {
            return StatusCodeResult(await _service.AddAsync(model.Value));
        }

        [HttpPost]
        public async Task<ActionResult> UpdateAsync([FromBody] CRUDModel<EmployeeDto> model)
        {
            return StatusCodeResult(await _service.UpdateAsync(model.Value));
        }
        #endregion

        [HttpGet]
        public async Task<ActionResult> CheckIn2(string code, int testKindId)
        {
            return Ok(await _service.CheckIn(code, testKindId));
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
        [HttpPost]
        public async Task<ActionResult> ImportExcel([FromForm] IFormFile file)
        {
            return Ok(await _service.ImportExcel());
        }
        [HttpPost]
        public async Task<ActionResult> ImportExcel3([FromForm] IFormFile file)
        {
            return Ok(await _service.ImportExcel3());
        }
        [HttpPost]
        public async Task<ActionResult> ImportExcel2(IFormFile file)
        {
            return Ok(await _service.ImportExcel2());
        }
        [HttpPut]
        public async Task<ActionResult> ToggleSEAInformAsync(int id)
        {
            return Ok(await _service.ToggleSEAInformAsync(id));
        }
        [HttpGet]
        public async Task<IActionResult> ExcelExport()
        {
            string filename = "employee.xlsx";
            if (filename == null)
                return Content("filename not present");

            var path = Path.Combine(
                           Directory.GetCurrentDirectory(),
                           "wwwroot/excelTemplate", filename);

            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(path), Path.GetFileName(path));
        }
        [HttpGet]
        public async Task<IActionResult> ExcelExportTemplate()
        {
            string filename = "template2.xlsx";
            if (filename == null)
                return Content("filename not present");

            var path = Path.Combine(
                           Directory.GetCurrentDirectory(),
                           "wwwroot/excelTemplate", filename);

            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(path), Path.GetFileName(path));
        }
        private string GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types[ext];
        }
        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/octet-stream"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"}
            };
        }

        [HttpPut]
        public async Task<ActionResult> UpdateIsPrint([FromBody] UpdateIsPrintRequest model)
        {
            return Ok(await _service.UpdateIsPrint(model));
        }
        [HttpGet]
        public async Task<ActionResult> CountWorkerScanQRCodeByToday()
        {
            return Ok(await _service.CountWorkerScanQRCodeByToday());

        }
        [HttpGet]
        public async Task<ActionResult> CheckCode(string code)
        {
            return Ok(await _service.CheckCode(code));

        }

        [HttpGet]
        public async Task<IActionResult> ExportEmployeeExcel()
        {
            var bin = await _service.ExportExcel();
            return File(bin, "application/octet-stream", $"employee{DateTime.Now.ToString("MMddyyyy")}.xlsx");
        }
    }
}
