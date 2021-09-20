using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.Models.Interface
{
   public interface IDateTracking
    {
        DateTime CreatedTime { get; set; }
        DateTime? ModifiedTime { get; set; }
    }
}
