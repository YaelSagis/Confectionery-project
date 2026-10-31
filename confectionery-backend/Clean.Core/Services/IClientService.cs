using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Clean.Core.DTOs;
using Clean.Core.Entities;

namespace Clean.Core.Services
{
    public interface IClientService
    {
        public List<ClientDto> GetList();
        public ClientDto GetById(int id);
        public Task addAsync(ClientDto clientDTO);
        public Task updateAsync(int id, ClientDto clientDto);
        public Task deleteAsync(int id);
    }
}
