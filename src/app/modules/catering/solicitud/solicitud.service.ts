import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

    constructor(
        private _http: HttpClient
    ) { }

    getList(){
        return this._http.get('api/catering/list').pipe(
            tap( (response: any) =>{
                console.warn('getList', response);
                return response;
            })
        )
    }
}
