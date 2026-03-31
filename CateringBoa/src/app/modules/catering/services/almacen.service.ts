import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AlmacenOption {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  private baseUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<AlmacenOption[]>(
      `${this.baseUrl}/almacenes`
    );
  }
}