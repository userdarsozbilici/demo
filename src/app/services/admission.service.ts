import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admission } from '../models/admission.model';
import { PotentialDiagnosis } from '../models/potential-diagnosis.model'; // Import the model

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {

  private apiUrl = 'http://localhost:8080/api/admissions';  

  constructor(private http: HttpClient) { }

  getAllAdmissions(): Observable<Admission[]> {
    return this.http.get<Admission[]>(`${this.apiUrl}/all`);
  }

  getAdmissionById(id: number): Observable<Admission> {
    return this.http.get<Admission>(`${this.apiUrl}/${id}`);
  }

  createAdmission(admission: Admission): Observable<Admission> {
    return this.http.post<Admission>(`${this.apiUrl}/create`, admission);
  }

  updateAdmission(id: number, admission: Admission): Observable<Admission> {
    return this.http.put<Admission>(`${this.apiUrl}/update/${id}`, admission);
  }

  deleteAdmission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  closeAdmission(id: number): Observable<Admission> {
    return this.http.put<Admission>(`${this.apiUrl}/close/${id}`, null);
  }

  getOpenedAdmissionsByTypeAndPoliclinic(type: string, policlinicId: number): Observable<Admission[]> {
    return this.http.get<Admission[]>(`${this.apiUrl}/type/${type}/policlinic/${policlinicId}/status/opened`);
  }

  getPotentialDiagnosesByAdmissionId(id: number): Observable<PotentialDiagnosis[]> {
    return this.http.get<PotentialDiagnosis[]>(`${this.apiUrl}/${id}/potential-diagnoses`);
  }
}
