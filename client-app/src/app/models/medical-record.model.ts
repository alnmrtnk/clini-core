export type MedicalRecord = {
  id: string;
  userId: string;
  recordTypeName: string;
  title: string;
  date: string;
  notes?: string;
  files: MedicalRecordFile[];
};

export type CreateMedicalRecord = {
  recordTypeId: string;
  title: string;
  date: string;
  notes?: string;
}

export type MedicalRecordFile = {
  id: string;
  medicalRecordId: string;
  fileName: string;
  s3Key: string;
  url: string;
};
