export interface PatientDiagnosis {
    id?: number;  // Optional, since it will be generated by the backend
    patientId: number;
    admissionId: number;
    diagnosis: string;
    medicineNames: string[];
  }
  