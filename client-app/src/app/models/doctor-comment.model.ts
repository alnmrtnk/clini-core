import { DoctorAccess } from "./doctor-access.model";

export type DoctorCommentDto = {
  id: string;
  doctorAccessId: string;
  medicalRecordId: string;
  doctorCommentType: DoctorCommentTypeDto;
  doctorAccess: DoctorAccess;
  content: string;
  date: string;
}

export type CreateDoctorCommentDto = {
  token?: string;
  medicalRecordId?: string;
  esculabRecordId?: string;
  doctorCommentTypeId: string;
  content: string;
  date: string;
  isPublic: boolean;
}

export type DoctorCommentTypeDto = {
  id: string;
  name: string;
}
