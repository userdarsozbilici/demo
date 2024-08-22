import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admission } from '../models/admission.model';

@Injectable({
  providedIn: 'root'
})
export class AdmissionService {

  private apiUrl = 'http://localhost:8080/api/admissions';  

  constructor(private http: HttpClient) { }

  // Fetch all admissions
  getAllAdmissions(): Observable<Admission[]> {
    return this.http.get<Admission[]>(`${this.apiUrl}/all`);
  }

  getAdmissionById(id: number): Observable<Admission> {
    return this.http.get<Admission>(`${this.apiUrl}${id}`);
  }

  createAdmission(admission: Admission): Observable<Admission> {
    return this.http.post<Admission>(`${this.apiUrl}/create`, admission);
  }

  // Update an existing admission
  updateAdmission(id: number, admission: Admission): Observable<Admission> {
    return this.http.put<Admission>(`${this.apiUrl}/update/${id}`, admission);
  }

  // Delete an admission by ID
  deleteAdmission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
