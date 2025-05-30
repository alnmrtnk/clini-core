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
                .ForMember(d => d.Files, o => o.MapFrom(s => s.Files))
                .ForMember(d => d.DoctorComments, o => o.MapFrom(s => s.DoctorComments));

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
            CreateMap<DoctorComment, DoctorCommentDto>()
                .ForMember(d => d.DoctorCommentTypeName,
                           o => o.MapFrom(s => s.DoctorCommentType.Name))
                .ForMember(d => d.DoctorCommentTypeId,
                           o => o.MapFrom(s => s.DoctorCommentType.Id));
            CreateMap<DoctorCommentType, DoctorCommentTypeDto>();
        }
    }
}
