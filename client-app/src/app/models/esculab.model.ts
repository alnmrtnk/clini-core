import { DoctorCommentDto } from "./doctor-comment.model";

export type RequestCodeDto = {
  phone: string;
  uuid: string;
}

export type AcceptTokenRequestDto = {
  uuid: string;
  code: string;
}

export type AcceptTokenResponseDto = {
  token: string;
  exist: boolean;
}

export type PatientDto = {
  id: number;
  firstname: string;
  lastname: string;
  fathername: string;
  sex: string;
  birthday?: Date;
  phone: string;
  email: string;
  regDate?: Date;
  constantDisc: number;
  detail: string;
  address: string;
  idUser: number;
  idDoctor: number;
  password?: string;
  login?: string;
  idParent: number;
  patientRole: string;
  main: boolean;
}

export type EsculabOrderDto = {
  id: string;
  dt: string; 
  idGrTest: number;
  address: string;
  ready: string;
  total: number;
  stringAgg?: string;
  packet: string;
  idOrder: number;
  idClient: number; 
  fullname: string;
  state: string;
  deleted: boolean;
  rating: number;
  last: boolean;
  doctorComments: DoctorCommentDto[];
  esculabRecordDetails: LabResultDto[];
}

export type LabResultDto = {
  idOrdertest: number;
  id: number;
  idgrtest: number;
  idtest: number;
  idgrnorm: number;
  result?: string;
  barcode?: string;
  utime?: Date;
  role?: string;
  packet?: string;
  test?: string;
  state?: string;
  resulttype?: string;
  normheader?: string;
  height: number;
  cnt: number;
  idlaborant: number;
  resultlighting: number;
  resulttmlt?: string;
  material?: string;
  post?: string;
  laborant?: string;
  norm?: string;
  units?: string;
  patientId: number;
  patient?: string;
  patientDt?: Date;
  idOrder: number;
  ready: number;
}
