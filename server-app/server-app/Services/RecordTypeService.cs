using server_app.Dtos;
using server_app.Helpers;
using server_app.Repositories;

namespace server_app.Services
{
    public interface IRecordTypeService
    {
        Task<ServiceResult<IEnumerable<RecordTypeDto>>> GetAllAsync();
        Task<ServiceResult<RecordTypeDto>> GetByIdAsync(Guid id);
    }

    public class RecordTypeService : IRecordTypeService
    {
        private readonly IRecordTypeRepository _r;

        public RecordTypeService(IRecordTypeRepository r)
        {
            _r = r;
        }

        public async Task<ServiceResult<IEnumerable<RecordTypeDto>>> GetAllAsync()
        {
            var types = await _r.GetAllAsync();
            return ServiceResult<IEnumerable<RecordTypeDto>>.Ok(types);
        }

        public async Task<ServiceResult<RecordTypeDto>> GetByIdAsync(Guid id)
        {
            var type = await _r.GetByIdAsync(id);
            return type == null
                ? ServiceResult<RecordTypeDto>.Fail("Not found", StatusCodes.Status404NotFound)
                : ServiceResult<RecordTypeDto>.Ok(type);
        }
    }
}
