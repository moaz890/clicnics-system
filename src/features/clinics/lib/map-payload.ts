import { formSchedulesToApi } from "./normalize";
import type { ClinicFormValues } from "../schemas/clinicFormSchema";
import type { CreateClinicPayload } from "../types/clinic";

export function formValuesToClinicPayload(
  values: ClinicFormValues,
): CreateClinicPayload {
  return {
    userId: values.userId,
    name: values.name.trim(),
    address: values.address.trim(),
    phone: values.phone.trim(),
    location: {
      lat: Number(values.location.lat),
      lng: Number(values.location.lng),
    },
    examinationFee: Number(values.examinationFee),
    slotDuration: Number(values.slotDuration),
    schedules: formSchedulesToApi(values.schedules),
    isActive: values.isActive,
  };
}
