using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.DTO.auth
{
    public class UserForDetailDto
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public List<int> AccountGroupPositions { get; set; }
        public int? AccountTypeId { get; set; }
        public bool IsManager { get; set; }
        public bool IsLeader { get; set; }
    }
}
