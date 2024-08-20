export interface Patient {
  id?: number;
  firstName: string;
  lastName: string;
  identityNumber: string;
  birthDate: string; 
  birthPlace: number;
  birthPlaceName?: string; 
  residence: number; 
  residenceName?: string; 
  address: string;
  gender: string;
  phoneNumbers: {
    mobilePhone: string;
    officePhone: string;
    homePhone: string;
  }[];
}
