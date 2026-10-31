using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Clean.Core.DTOs;
using Clean.Core.Entities;
using Clean.Core.Repositories;
using Clean.Core.Services;

namespace Clean.Service
{
    public class ClientService:IClientService
    {
        private readonly IClientRepository _clientRepository;
        private readonly IMapper _mapper;
        public ClientService(IClientRepository clientRepository, IMapper mapper)
        {
            _clientRepository = clientRepository;
            _mapper = mapper;
        }

        public List<ClientDto> GetList()
        {
            //TODO business logic
            var l = _clientRepository.GetAll();
            return _mapper.Map<List<ClientDto>>(l);

        }
        public ClientDto GetById(int id)
        {
            var cli=_clientRepository.GetById(id);
            return _mapper.Map<ClientDto>(cli);
        }
        public async Task addAsync(ClientDto clientDTO)
        {
            var client = _mapper.Map<Client>(clientDTO);
            await _clientRepository.PostAsync(client);
        }
        public async Task updateAsync(int id, ClientDto clientDTO)
        {
            var client = _mapper.Map<Client>(clientDTO);
            await _clientRepository.putAsync(id, client);
        }
        public async Task deleteAsync(int id)
        {
            await _clientRepository.deleteAsync(id);
        }

    }
}
