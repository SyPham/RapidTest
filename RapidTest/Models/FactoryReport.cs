using RapidTest.Models.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace RapidTest.Models
{
    [Table("FactoryReports")]
    public class FactoryReport : IDateTracking
    {
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; } // Leo
        public int TestKindId { get; set; } // RapidTest
        public int Result { get; set; } // Negative
        public int CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public bool IsDelete { get; set; }

        public DateTime ExpiryTime { get; set; } // Enter factory exp. date
        public DateTime RapidTestTime { get; set; } // Rapid Test date
        public DateTime FactoryEntryTime { get; set; } // Entering factory date
        public DateTime CreatedTime { get; set; } // Rapid-Test date
        public DateTime? ModifiedTime { get; set; }
        public DateTime? DeletedTime { get; set; }
        [ForeignKey(nameof(EmployeeId))]
        public virtual Employee Employee { get; set; }
        [ForeignKey(nameof(TestKindId))]
        public virtual TestKind TestKind { get; set; }
    }
}
