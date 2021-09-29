using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.DTO
{
    public class FactoryReportDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; } // Leo
        public string FullName { get; set; } // Leo
        public string Department { get; set; } // Leo
        public string Gender { get; set; } // Leo
        public string BirthDate { get; set; } // Leo
        public string Code { get; set; } // Leo
        public string TestKindId { get; set; } // RapidTest
        public string Result { get; set; } // Negative
        public int CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime LastestCheckInDate { get; set; }

        public string ExpiryTime { get; set; } // Enter factory exp. date
        public string RapidTestTime { get; set; } // Rapid Test date
        public string FactoryEntryTime { get; set; } // Entering factory date
        public string CreatedTime { get; set; } // Rapid-Test date
        public DateTime? ModifiedTime { get; set; }
    }
}
