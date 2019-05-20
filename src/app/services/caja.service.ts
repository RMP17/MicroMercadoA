
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { Observable } from 'rxjs';
import { Caja } from '../models/caja';
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
export class CajaService {
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
    getAllCajas() {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'cajas', httpOptions);
    }
    getEfectivo() {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'cajas/efectivo', httpOptions);
    }
    storeBoxData(caja: Caja) {
        let json = JSON.stringify(caja);
        let params = 'json=' + json;
       this.setAuthorization();
        return this._http.post<any>(this.url + 'cajas', params, httpOptions2);
    }
    updateCaja(id, caja) {

        let json = JSON.stringify(caja);
        let params = 'json=' + json;
        this.setAuthorization();
        return this._http.put<any>(this.url + 'cajas/' + id, params, httpOptions2);
    }
    deleteCaja(id) {
        this.setAuthorization();
        return this._http.delete<any>(this.url + 'cajas/' + id, httpOptions);
    }
    saveMovement(monto) {
        let json, params;
        json = JSON.stringify(monto);
        params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'cajas/movements', params, httpOptions2);
    }
    getMovements(search) {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'cajas/movements/' + search.date1 + '/' + search.date2, httpOptions);
    }
    getCashClosing(search) {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'cajas/cash-closing/' + search.date1 + '/' + search.date2, httpOptions);
    }
    storeCashClosing() {
        this.setAuthorization();
        return this._http.post<any>(this.url + 'cajas/cash-closing', null, httpOptions2);
    }
}
