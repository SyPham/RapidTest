using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RapidTest.Data
{
    public interface IUnitOfWork
    {
        Task<int> SaveChangeAsync();
    }
    public class UnitOfWork : IUnitOfWork
    {
        private DbFactory _dbFactory;

        public UnitOfWork(DbFactory dbFactory)
        {
            _dbFactory = dbFactory;
        }

        public Task<int> SaveChangeAsync()
        {
            return _dbFactory.DbContext.SaveChangesAsync();
        }
    }
}
