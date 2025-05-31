using AutoMapper;
using server_app.Dtos;
using server_app.Helpers;
using server_app.Models;
using server_app.Repositories;

namespace server_app.Services
{
    public interface IMedicalRecordService
    {
        Task<ServiceResult<IEnumerable<MedicalRecordDto>>> GetAllAsync();
        Task<ServiceResult<MedicalRecordDto>> GetByIdAsync(Guid id);
        Task<ServiceResult<Guid>> CreateAsync(CreateMedicalRecordDto dto, List<IFormFile> files);
        Task<ServiceResult<bool>> UpdateAsync(Guid id, UpdateMedicalRecordDto dto, List<IFormFile> files);
        Task<ServiceResult<bool>> DeleteAsync(Guid id);
        Task<IEnumerable<MedicalRecordDto>> GetByUserIdsAsync(List<Guid>? ownerIds);
    }

    public class MedicalRecordService : IMedicalRecordService
    {
        private readonly IMedicalRecordRepository _medicalRecordRepository;
        private readonly IMedicalRecordFileRepository _medicalRecordFileRepository;

        private readonly IFileUploadService _fileUploader;
        private readonly IHttpContextAccessor _http;
        private readonly IMapper _map;

        public MedicalRecordService(IMedicalRecordRepository r, IFileUploadService fileUploader, IHttpContextAccessor http, IMedicalRecordFileRepository medicalRecordFileRepository, IMapper mapper)
        {
            _medicalRecordRepository = r;
            _fileUploader = fileUploader;
            _http = http;
            _medicalRecordFileRepository = medicalRecordFileRepository;
            _map = mapper;
        }

        public async Task<ServiceResult<IEnumerable<MedicalRecordDto>>> GetAllAsync()
        {
            var entities = await _medicalRecordRepository.GetAllAsync();

            var dtos = new List<MedicalRecordDto>();

            foreach (var record in entities)
            {
                var dto = _map.Map<MedicalRecordDto>(record);
                dto.Files = BuildFileDtosAsync(record.Files);
                dtos.Add(dto);
            }

            return ServiceResult<IEnumerable<MedicalRecordDto>>.Ok(dtos);
        }

        public async Task<ServiceResult<MedicalRecordDto>> GetByIdAsync(Guid id)
        {
            var recordEntity = await _medicalRecordRepository.GetByIdAsync(id);

            if (recordEntity == null)
                return ServiceResult<MedicalRecordDto>.Fail("Not found", StatusCodes.Status404NotFound);

            var dto = _map.Map<MedicalRecordDto>(recordEntity);

            dto.Files = BuildFileDtosAsync(recordEntity.Files);

            return ServiceResult<MedicalRecordDto>.Ok(dto);
        }

        public async Task<IEnumerable<MedicalRecordDto>> GetByUserIdsAsync(List<Guid>? ownerIds)
        {
            var entities = await _medicalRecordRepository.GetByUserIdsAsync(ownerIds);

            var dtos = new List<MedicalRecordDto>();

            foreach (var record in entities)
            {
                var dto = _map.Map<MedicalRecordDto>(record);
                dto.Files = BuildFileDtosAsync(record.Files);
                dtos.Add(dto);
            }

            return dtos;
        }


        public async Task<ServiceResult<Guid>> CreateAsync(CreateMedicalRecordDto dto, List<IFormFile> files)
        {
            var id = await _medicalRecordRepository.AddAsync(dto);

            foreach (var file in files)
            {
                try
                {
                    var s3Key = await _fileUploader.UploadAsync(file);

                    await _medicalRecordFileRepository.AddAsync(new CreateMedicalRecordFileDto
                    {
                        MedicalRecordId = id,
                        FileName = file.FileName,
                        S3Key = s3Key
                    });
                }
                catch (Exception ex)
                {
                    return ServiceResult<Guid>.Fail(
                        $"Failed to upload file '{file.FileName}': {ex.Message}",
                        StatusCodes.Status500InternalServerError
                    );
                }
            }

            return ServiceResult<Guid>.Ok(id);
        }

        public async Task<ServiceResult<bool>> UpdateAsync(
            Guid id,
            UpdateMedicalRecordDto dto,
            List<IFormFile> newFiles
        )
        {
            var success = await _medicalRecordRepository.UpdateAsync(id, dto);
            if (!success)
                return ServiceResult<bool>.Fail("Record not found", StatusCodes.Status404NotFound);

            var record = await _medicalRecordRepository.GetByIdAsync(id);
            if (record == null)
                return ServiceResult<bool>.Fail("Not found", StatusCodes.Status404NotFound);

            foreach (var fileId in dto.RemovedFiles)
            {
                await _medicalRecordFileRepository.DeleteAsync(fileId);
            }

            var existingNames = record.Files.Select(f => f.FileName).ToHashSet(StringComparer.OrdinalIgnoreCase);
            foreach (var file in newFiles.Where(f => !existingNames.Contains(f.FileName)))
            {
                var s3Key = await _fileUploader.UploadAsync(file);
                await _medicalRecordFileRepository.AddAsync(new CreateMedicalRecordFileDto
                {
                    MedicalRecordId = id,
                    FileName = file.FileName,
                    S3Key = s3Key
                });
            }

            return ServiceResult<bool>.Ok(true);
        }


        public async Task<ServiceResult<bool>> DeleteAsync(Guid id)
        {
            var success = await _medicalRecordRepository.DeleteAsync(id);
            return success
                ? ServiceResult<bool>.Ok(true)
                : ServiceResult<bool>.Fail("Record not found", StatusCodes.Status404NotFound);
        }

        private List<MedicalRecordFileDto> BuildFileDtosAsync(IList<MedicalRecordFileDto> files)
        {
            var result = new List<MedicalRecordFileDto>();

            foreach (var file in files)
            {
                result.Add(new MedicalRecordFileDto
                {
                    Id = file.Id,
                    MedicalRecordId = file.MedicalRecordId,
                    FileName = file.FileName,
                    S3Key = file.S3Key,
                    Url = _fileUploader.GetPresignedUrl(file.S3Key)
                });
            }

            return result;
        }

    }
}
