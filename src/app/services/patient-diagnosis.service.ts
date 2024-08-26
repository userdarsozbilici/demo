import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatientDiagnosis } from '../models/patient-diagnosis.model';

@Injectable({
  providedIn: 'root'
})
export class PatientDiagnosisService {

  private baseUrl = 'http://localhost:8080/api/diagnoses';  

  constructor(private http: HttpClient) { }

  createDiagnosis(diagnosis: PatientDiagnosis): Observable<PatientDiagnosis> {
    return this.http.post<PatientDiagnosis>(this.baseUrl, diagnosis);
  }

}
