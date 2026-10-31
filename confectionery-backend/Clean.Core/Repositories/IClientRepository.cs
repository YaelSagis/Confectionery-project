using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Clean.Core.Entities;

namespace Clean.Core.Repositories
{
    public interface IClientRepository
    {
        public List<Client> GetAll();
        public Client GetById(int id);
        Task<Client> PostAsync(Client client);
        public Task putAsync(int id,Client client);
        public Task deleteAsync(int id);
    }
}
