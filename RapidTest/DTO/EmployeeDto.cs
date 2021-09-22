using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.DTO
{
    public class EmployeeDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string FactoryName { get; set; }
        public string Code { get; set; }
        public int FactoryId { get; set; }
        public bool SEAInform { get; set; }

        public int CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime? ModifiedTime { get; set; }
    }

    public class EmployeeImportExcelDto
    {
        public int FactoryId { get; set; }
        public string FullName { get; set; }
        public string Code { get; set; }
        public int CreatedBy { get; set; }
        public bool SEAInform { get; set; }

    }
}
