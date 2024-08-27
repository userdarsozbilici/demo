import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
export interface StatsDTO {
  totalPatients: number
  deletedPatients: number
  averageAge: number
  maleCount: number
  femaleCount: number
  averageAgeMale: number
  averageAgeFemale: number
  patientsByCity: {}
  patientsByPoliclinic:{}
  patientsByAdmissionType:{}
}
@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private apiUrl = 'http://localhost:8080/api/stats'

  constructor(private http: HttpClient) {}

  getStats(): Observable<StatsDTO> {
    return this.http.get<StatsDTO>(`${this.apiUrl}/get`)
  }
}
