using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Clean.Core.Entities;
using Clean.Core.Repositories;

namespace Clean.Data.Repositories
{
    public class ClientRepository: IClientRepository
    { 
        private readonly DataContext _dataContext;

        public ClientRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public List<Client> GetAll()
        {
            return _dataContext.clients.ToList();
        }
        public Client GetById(int id)
        {
            return _dataContext.clients.Find(id);
        }
        public async Task<Client> PostAsync(Client client)
        {
            _dataContext.clients.Add(client);
            await _dataContext.SaveChangesAsync();
            return client;
        }
        public async Task putAsync(int id, Client client)
        {
            Client c = _dataContext.clients.Find(id);
            if (c != null)
            {
                c.id = id;
                c.name = client.name;
                c.email = client.email;
                c.phone = client.phone;
                if (!string.IsNullOrEmpty(client.password))
                    c.password = client.password;
                await _dataContext.SaveChangesAsync();
            }
        }
        public async Task deleteAsync(int id)
        {
            Client c = _dataContext.clients.Find(id);
            if (c != null)
            {
                _dataContext.clients.Remove(c);
                await _dataContext.SaveChangesAsync();
            }
        }
    }
}
