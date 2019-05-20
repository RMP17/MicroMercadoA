import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria';
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
export class CategoriaService {
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
    getCategorias() {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'categorias', httpOptions);
    }
    addCategoria(categoria: Categoria) {
        let json, params;
        json = JSON.stringify(categoria);
        params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'categorias', params, httpOptions2);
    }
    updateCategoria(id, categorias: Categoria) {
        let json, params;
        json = JSON.stringify(categorias);
        params = 'json=' + json;
        this.setAuthorization();
        return this._http.put<any>(this.url + 'categorias/' + id, params, httpOptions2);
    }
}