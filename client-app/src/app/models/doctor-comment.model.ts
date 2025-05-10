export type DoctorCommentDto = {
  id: string;
  doctorAccessId: string;
  medicalRecordId: string;
  doctorCommentTypeId: string;
  content: string;
  date: string;
}

export type CreateDoctorCommentDto = {
  token?: string;
  medicalRecordId: string;
  doctorCommentTypeId: string;
  content: string;
  date: string;
}

export type DoctorCommentTypeDto = {
  id: string;
  name: string;
}
