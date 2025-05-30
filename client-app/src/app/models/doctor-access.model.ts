export interface CreateDoctorAccess {
  name: string;
  expiresAt: Date;
  targetUserEmail?: string;
}

export interface DoctorAccess {
  id: string;
  name: string;
  token?: string;
  targetUserEmail?: string;
  expiresAt: Date;
  revoked: boolean;
}
