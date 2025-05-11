using server_app.Dtos;
using server_app.Models;
using AutoMapper;

namespace server_app.Profiles
{
    public class CliniCoreProfile : Profile
    {
        public CliniCoreProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<CreateUserDto, User>()
                .ForMember(d => d.Id, o => o.MapFrom(_ => Guid.NewGuid()))
                .ForMember(d => d.PasswordHash, o => o.MapFrom(s => s.Password));
            CreateMap<UpdateUserDto, User>();

            CreateMap<MedicalRecord, MedicalRecordDto>()
                .ForMember(d => d.RecordTypeName, o => o.MapFrom(s => s.RecordType.Name))
                .ForMember(d => d.Files, o => o.MapFrom(s => s.Files));

            CreateMap<RecordType, RecordTypeDto>()
                .ForMember(d => d.MedicalRecords, o => o.MapFrom(s => s.MedicalRecords));

            CreateMap<RecordTypeDto, RecordType>();

            CreateMap<MedicalRecordFile, MedicalRecordFileDto>();

            CreateMap<CreateMedicalRecordDto, MedicalRecord>()
                .ForMember(d => d.Id, o => o.MapFrom(_ => Guid.NewGuid()));
            CreateMap<UpdateMedicalRecordDto, MedicalRecord>();

            CreateMap<MedicalRecordFileDto, CreateMedicalRecordFileDto>();

            CreateMap<CreateMedicalRecordFileDto, MedicalRecordFile>()
                 .ForMember(d => d.Id, o => o.MapFrom(_ => Guid.NewGuid()));

            CreateMap<DoctorAccess, DoctorAccessDto>();
            CreateMap<CreateDoctorAccessDto, DoctorAccess>()
                .ForMember(d => d.Id, o => o.MapFrom(_ => Guid.NewGuid()))
                .ForMember(d => d.GrantedAt, o => o.MapFrom(_ => DateTime.UtcNow));

            CreateMap<CreateDoctorCommentDto, DoctorComment>();
            CreateMap<DoctorComment, DoctorCommentDto>();
            CreateMap<DoctorCommentType, DoctorCommentTypeDto>();
        }
    }
}
