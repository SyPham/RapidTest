using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace RapidTest.Helpers
{
    public class EJ2DataSource
    {
        [JsonProperty("Count")]
        public int Count { get; set; }
        [JsonProperty("Items")]
        public object Items { get; set; }
    }
}
