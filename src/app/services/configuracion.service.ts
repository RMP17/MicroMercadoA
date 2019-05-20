import { Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { of ,  Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Global } from '../services/global';
import { PersonaService } from '../services/persona.service';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};
const httpOptions2 = {
    headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};
@Injectable()
export class ConfiguracionService {
    public url: string;

    constructor(
        private _personaService: PersonaService,
        public _http: HttpClient,
    ) {
        this.url = Global.url;
    }
    setAuthorization() {
        httpOptions.headers = httpOptions.headers.set('Authorization', this._personaService.getToken());
        httpOptions2.headers = httpOptions2.headers.set('Authorization', this._personaService.getToken());
    }
    getConfiguracion() {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'configuracion', httpOptions);
    }
    storeConfiguracion(configuracion) {
        return this._http.post<any>(this.url + 'configuracion', configuracion, httpOptions2);
    }

    getTestControlCode(data) {
        let _data;
        _data = Object.assign({}, data) ;
        // json = JSON.stringify(_data);
        // params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'configuracion/test-code', _data, httpOptions2);
    }
}
