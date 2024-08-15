import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComboBoxService {

  private baseUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  // Fetch all cities
  getCities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cities/getAll`);
  }

  // Fetch counties by cityId
  getCounties(cityId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/counties/getByCity?cityId=${cityId}`);
  }

  // Fetch city ID by county ID
  getCityIdByCountyId(countyId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/counties/${countyId}/city-id`);
  }

  // Fetch city name by city ID
getCityNameByCountyId(countyId: number): Observable<string> {
  return this.http.get<{name: string}>(`${this.baseUrl}/counties/${countyId}/city-name`)
      .pipe(
          map(response => response.name)
      );
}

}
