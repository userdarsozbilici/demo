import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Policlinic {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class PoliclinicService {

  private apiUrl = 'http://localhost:8080/api/policlinics'; 

  constructor(private http: HttpClient) { }

  getAllPoliclinics(): Observable<Policlinic[]> {
    return this.http.get<Policlinic[]>(`${this.apiUrl}`);
  }
}
