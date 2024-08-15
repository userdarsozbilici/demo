import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8080/api/patients';
  private searchResults = new BehaviorSubject<Patient[]>([]);

  constructor(private http: HttpClient) {}

  createPatient(patient: Patient): Observable<Object> {
    return this.http.post(`${this.apiUrl}/create`, patient);
  }

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/getAll`);
  }

  updatePatient(patient: Patient): Observable<Object> {
    return this.http.put(`${this.apiUrl}/update/${patient.id}`, patient);
  }

  deletePatient(id: number): Observable<Object> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  searchPatients(searchBy: string, searchTerm: string): Observable<Patient[]> {
    let params = new HttpParams();
    if (searchBy === 'nameSurname') {
      const names = JSON.parse(searchTerm);
      params = params.append('nameSurname', JSON.stringify(names));
    } else {
      params = params.append(searchBy, searchTerm);
    }
    return this.http.get<Patient[]>(`${this.apiUrl}/search`, { params });
  }

  setSearchResults(patients: Patient[]): void {
    this.searchResults.next(patients);
  }

  getSearchResults(): Observable<Patient[]> {
    return this.searchResults.asObservable();
  }
}
