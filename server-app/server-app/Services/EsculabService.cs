using AutoMapper;
using server_app.Dtos;
using server_app.Dtos.Esculab;
using server_app.Extensions;
using server_app.Helpers;
using server_app.Models;
using server_app.Repositories;
using System.Net.Http.Headers;
using System.Text.Json;

namespace server_app.Services
{
    public interface IEsculabService
    {
        Task<ServiceResult<string>> RequestCode(string phone);
        Task<ServiceResult<string>> AcceptToken(AcceptTokenRequestDto req);
        Task<ServiceResult<PatientDto>> FindEsculabPatient(string esculabToken);
        Task<ServiceResult<IEnumerable<EsculabRecord>>> GetEsculabOrders(string esculabToken);
        Task<ServiceResult<LabResultDto[]>> GetSpecificEsculabOrder(int id, string esculabToken);
    }

    public class EsculabService : IEsculabService
    {
        private readonly HttpClient _httpClient;
        public readonly IUserRepository _userRepository;
        private readonly IEsculabRepository _esculabRepo;
        public readonly IMapper _mapper;

        public EsculabService(
            HttpClient httpClient,
            IUserRepository userRepository,
            IEsculabRepository esculabRepo,
            IMapper mapper
        )
        {
            _httpClient = httpClient;
            _userRepository = userRepository;
            _esculabRepo = esculabRepo;
            _mapper = mapper;
        }

        public async Task<ServiceResult<string>> RequestCode(string phone)
        {
            var payload = new RequestCodeDto { Phone = phone };

            var response = await _httpClient.PostAsJsonAsync("https://esculab.com/api/auth/authorise", payload);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return ServiceResult<string>.Fail(error, (int)response.StatusCode);
            }

            var user = await _userRepository.GetCurrentUser();
            await _userRepository.UpdateAsync(new UpdateUserDto
            {
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                EsculabPhoneNumber = phone
            });

            return ServiceResult<string>.Ok(payload.Uuid.ToString());
        }

        public async Task<ServiceResult<string>> AcceptToken(AcceptTokenRequestDto req)
        {
            var response = await _httpClient.PostAsJsonAsync("https://esculab.com/api/auth/accept", req);
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return ServiceResult<string>.Fail(content, (int)response.StatusCode);

            try
            {
                var json = JsonSerializer.Deserialize<AcceptTokenResponseDto>(content);
                if (json?.token != null)
                    return ServiceResult<string>.Ok(json.token);

                return ServiceResult<string>.Fail("Token not found in response.");
            }
            catch (JsonException e)
            {
                return ServiceResult<string>.Fail($"Invalid token response: {e.Message}");
            }
        }

        public async Task<ServiceResult<PatientDto>> FindEsculabPatient(string esculabToken)
        {
            var user = await _userRepository.GetCurrentUser();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", esculabToken);

            var response = await _httpClient.PostAsJsonAsync("https://esculab.com/api/customers/findPatientSite", new { phone = user.EsculabPhoneNumber });
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return ServiceResult<PatientDto>.Fail(content, (int)response.StatusCode);

            try
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                options.Converters.Add(new FlexibleDateTimeConverter());

                var patients = JsonSerializer.Deserialize<PatientDto[]>(content, options);
                var patient = patients?.FirstOrDefault();

                if (patient != null)
                {
                    await _userRepository.UpdateAsync(new UpdateUserDto
                    {
                        FullName = user.FullName,
                        PhoneNumber = user.PhoneNumber,
                        EsculabPatientId = patient.Id.ToString()
                    });

                    return ServiceResult<PatientDto>.Ok(patient);
                }

                return ServiceResult<PatientDto>.Fail("No patient data returned.");
            }
            catch (JsonException e)
            {
                return ServiceResult<PatientDto>.Fail($"Failed to deserialize patient: {e.Message}");
            }
        }

        public async Task<ServiceResult<IEnumerable<EsculabRecord>>> GetEsculabOrders(string esculabToken)
        {
            var user = await _userRepository.GetCurrentUser();
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", esculabToken);

            var ordersResponse = await _httpClient
                .GetAsync($"https://esculab.com/api/customers/getPatientOrders/{user.EsculabPatientId}");
            var ordersContent = await ordersResponse.Content.ReadAsStringAsync();

            if (ordersResponse.IsSuccessStatusCode)
            {

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                options.Converters.Add(new FlexibleDateTimeConverter());
                var orderDtos = JsonSerializer.Deserialize<EsculabOrderDto[]>(ordersContent, options)
                                ?? Array.Empty<EsculabOrderDto>();

                var esculabRecords = new List<EsculabRecord>();
                foreach (var dto in orderDtos)
                {
                    var record = _mapper.Map<EsculabRecord>(dto);
                    record.UserId = user.Id;
                    esculabRecords.Add(record);
                }

                await _esculabRepo.AddOrUpdateOrdersAsync(esculabRecords);

                var allDetails = new List<EsculabRecordDetails>();
                foreach (var record in esculabRecords)
                {
                    var specificResponse = await _httpClient
                        .GetAsync($"https://esculab.com/api/customers/getOrdersResult/{record.IdOrder}/{user.EsculabPatientId}");
                    var specificContent = await specificResponse.Content.ReadAsStringAsync();

                    if (!specificResponse.IsSuccessStatusCode)
                    {
                        continue;
                    }

                    var detailsDtos = JsonSerializer.Deserialize<LabResultDto[]>(specificContent, options)
                                       ?? Array.Empty<LabResultDto>();

                    foreach (var detDto in detailsDtos)
                    {
                        var detEntity = _mapper.Map<EsculabRecordDetails>(detDto);
                        detEntity.EsculabRecordId = record.Id;
                        allDetails.Add(detEntity);
                    }
                }

                await _esculabRepo.AddOrUpdateRecordDetailsAsync(allDetails);
            }

            var saved = await _esculabRepo.GetAllAsync();
            return ServiceResult<IEnumerable<EsculabRecord>>.Ok(saved);
        }

        public async Task<ServiceResult<LabResultDto[]>> GetSpecificEsculabOrder(int id, string esculabToken)
        {
            var user = await _userRepository.GetCurrentUser();

            var request = new HttpRequestMessage(HttpMethod.Get,
                $"https://esculab.com/api/customers/getOrdersResult/{id}/{user.EsculabPatientId}");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", esculabToken);
            request.Headers.Add("Accessphone", user.EsculabPhoneNumber);

            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return ServiceResult<LabResultDto[]>.Fail(content, (int)response.StatusCode);

            try
            {
                var options = new JsonSerializerOptions();
                options.Converters.Add(new FlexibleDateTimeConverter());

                var results = JsonSerializer.Deserialize<LabResultDto[]>(content, options);
                return ServiceResult<LabResultDto[]>.Ok(results ?? Array.Empty<LabResultDto>());
            }
            catch (JsonException e)
            {
                return ServiceResult<LabResultDto[]>.Fail($"Failed to deserialize lab results: {e.Message}");
            }
        }
    }
}
