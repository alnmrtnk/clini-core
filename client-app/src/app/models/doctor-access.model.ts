export interface CreateDoctorAccess {
  name: string;
  expiresAt: Date;
  targetEmail?: string;
}

export interface DoctorAccess {
  id: string;
  name: string;
  token?: string;
  expiresAt: Date;
  revoked: boolean;
}
