
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { Observable } from 'rxjs';
import { Marca } from '../models/marca';
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
        'Content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'my-auth-token'
    })
};
@Injectable()
export class MarcaService {
    public url: string;
    constructor(
        private _personaService: PersonaService,
        public _http: HttpClient
    ) {
        this.url = Global.url;
    }
    setAuthorization() {
        httpOptions.headers = httpOptions.headers.set('Authorization', this._personaService.getToken());
        httpOptions2.headers = httpOptions2.headers.set('Authorization', this._personaService.getToken());
    }
    getMarcas() {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'marcas', httpOptions);
    }
    addMarca(marca: Marca) {
        let json, params;
        json = JSON.stringify(marca);
        params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'marcas', params, httpOptions2);
    }
    updateMarca(id, marca: Marca) {
        let json, params;
        json = JSON.stringify(marca);
        params = 'json=' + json;
        this.setAuthorization();
        return this._http.put<any>(this.url + 'marcas/' + id, params, httpOptions2);
    }
}
