export interface ClinicLocation {
  lat: number;
  lng: number;
}

export interface ClinicSchedule {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Clinic {
  id: string;
  userId: string;
  name: string;
  address: string;
  phone: string;
  location: ClinicLocation;
  examinationFee: number;
  slotDuration: number;
  schedules: ClinicSchedule[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClinicListItem {
  id: string;
  name: string;
  phone: string;
  examinationFee: number;
  isActive: boolean;
}

export interface AvailableSlot {
  id?: string;
  date?: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  available?: boolean;
  status?: string;
}

export type CreateClinicPayload = Omit<Clinic, "id" | "createdAt" | "updatedAt">;
export type UpdateClinicPayload = Partial<CreateClinicPayload>;
