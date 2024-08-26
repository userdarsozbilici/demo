import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {

  private baseUrl = 'http://localhost:8080/api/medicines'; 

  constructor(private http: HttpClient) { }

  getAllMedicines(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getMedicinesByPoliclinicId(policlinicId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/by-policlinic/${policlinicId}`);
  }
}
