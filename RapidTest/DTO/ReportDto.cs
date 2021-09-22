using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.DTO
{
    public class ReportDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; } // Leo
        public string FullName { get; set; } // Leo
        public string Code { get; set; } // Leo
        public string TestKindId { get; set; } // RapidTest
        public string Result { get; set; } // Negative

        public int CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public string ExpiryTime { get; set; } // Enter factory exp. date
        public string CreatedTime { get; set; } // Rapid-Test date
        public DateTime? ModifiedTime { get; set; }
    }
    public class ScanQRCodeRequestDto
    {
        public int KindId { get; set; }
        public string QRCode { get; set; } 
    
    }
}
