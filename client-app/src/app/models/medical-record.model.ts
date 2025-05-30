import { DoctorCommentDto } from './doctor-comment.model';
import { RecordType } from './record-type.model';

export type MedicalRecord = {
  id: string;
  userId: string;
  recordType: RecordType;
  title: string;
  date: string;
  notes?: string;
  files: MedicalRecordFile[];
  doctorComments: DoctorCommentDto[];
};

export type CreateMedicalRecord = {
  recordTypeId: string;
  title: string;
  date: string;
  notes?: string;
};

export type MedicalRecordFile = {
  id: string;
  medicalRecordId: string;
  fileName: string;
  s3Key: string;
  url: string;
};

export type MedicalRecordGroupDto = {
  ownerUserId: string;
  ownerName: string;
  ownerEmail: string;
  records: MedicalRecord[];
};
