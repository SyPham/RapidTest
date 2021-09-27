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
        public string Department { get; set; } // Leo
        public string Gender { get; set; } // Leo
        public string IsPrint { get; set; }

        public string BirthDate { get; set; } // Leo
        public DateTime BirthDay { get; set; } // Leo
        public int CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime? ModifiedTime { get; set; }
    }

    public class EmployeeImportExcelDto
    {
        public int FactoryId { get; set; }
        public int DepartmentId { get; set; }
        public bool? Gender { get; set; }
        public bool IsPrint { get; set; }
        public DateTime BirthDate { get; set; }
        public string FullName { get; set; }
        public string Code { get; set; }
        public int CreatedBy { get; set; }
        public bool SEAInform { get; set; }


    }
    public class UpdateIsPrintRequest
    {
        public List<int> Ids { get; set; }
        public int PrintBy { get; set; }

    }
}
