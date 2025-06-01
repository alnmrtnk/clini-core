using server_app.Dtos.Esculab;

namespace server_app.Dtos
{
    public class EsculabRecordDto : EsculabOrderDto
    {
        public required Guid Id { get; set; }
        public required Guid UserId { get; set; }
        public UserDto User { get; set; } = null!;
        public IList<DoctorCommentDto> DoctorComments { get; set; } = new List<DoctorCommentDto>();

    }
}
