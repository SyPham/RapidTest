using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.DTO
{
    public class TestKindDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsDefault { get; set; }

        public int CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime? ModifiedTime { get; set; }
    }
}
