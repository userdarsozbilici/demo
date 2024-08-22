export interface Admission {
    id?: number; 
    patientId: number;
    admissionDate?: Date;  
    type: string;
    policlinicId: number;
    staffId: number;
    note?: string;  
    status?: string;
  }
  