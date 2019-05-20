import {map, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Persona} from '../models/persona';
import {Cuenta} from '../models/cuenta';
import {Global} from '../services/global';

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

@Injectable(
    {
        providedIn: 'root',
    }
)
export class PersonaService {
    public url: string;
    public identity;
    public token: string;
    constructor(
        private _http: HttpClient
    ) {
        this.url = Global.url;
    }
    setAuthorization() {
        httpOptions.headers = httpOptions.headers.set('Authorization', this.getToken());
        httpOptions2.headers = httpOptions2.headers.set('Authorization', this.getToken());
    }
    getProveedores(): Observable<any> {
        /*let headers;
        headers = new HttpHeaders({
            'Authorization': this.getToken()
        });*/
        this.setAuthorization();
        return this._http.get<any>(this.url + 'proveedores', httpOptions);
    }

    getEmpleados() {
        /* let headers;
         headers = new HttpHeaders({
             'Authorization': this.getToken()
         });*/
        this.setAuthorization();
        return this._http.get<any>(this.url + 'personas/empleados', httpOptions);
    }

    getProveedoresNames() {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'proveedores-names', httpOptions);
    }

    getFrequentClients(dates) {
        this.setAuthorization();
        return this._http.get(this.url + 'personas/frequent-clients/' + dates.initialDate + '/' + dates.endDate,
            httpOptions);
    }

    addPersona(persona: Persona) {
        let json, params;
        json = JSON.stringify(persona);
        params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'personas', params, httpOptions2);
    }

    updatePersona(id, persona: Persona) {
        let json, params;
        json = JSON.stringify(persona);
        params = 'json=' + json;
        this.setAuthorization();
        return this._http.put<any>(this.url + 'personas/' + id, params, httpOptions2);
    }

    searchPersonaCi(ci) {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'personas/search/' + ci, httpOptions);
    }

    contratar(id) {
        this.setAuthorization();
        return this._http.put(this.url + 'personas/contratar/' + id, [], httpOptions2);
    }

    getCuentas() {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'cuentas', httpOptions);
    }

    addCuenta(cuenta: Cuenta): Observable<any> {
        let json, params;
        json = JSON.stringify(cuenta);
        params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'cuentas', params, httpOptions2);
    }

    editCuenta(id, cuenta: Cuenta) {
        let json, params;
        json = JSON.stringify(cuenta);
        params = 'json=' + json;
        this.setAuthorization();
        return this._http.put<any>(this.url + 'cuentas/' + id, params, httpOptions2);
    }

    deleteCuenta(id) {
        this.setAuthorization();
        return this._http.delete<any>(this.url + 'cuentas/' + id, httpOptions);
    }

    signup(user_to_login, gettoken = null): Observable<any> {
        if (gettoken != null) {
            user_to_login.gettoken = gettoken;
        }
        let json = JSON.stringify(user_to_login);
        let headers = new HttpHeaders({'Content-type': 'application/json'});
        return this._http.post<any>(this.url + 'login', json, {headers: headers});
    }

    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));
        if (identity != 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

    getToken() {
        let token = localStorage.getItem('token');
        if (token != 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }
        return 'Bearer ' + this.token;
    }

    getSuggestions(query) {
        let json, params;
        json = JSON.stringify({q: query});
        params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'personas/suggestions', params, httpOptions2);
        // return this._http.get(this.url + 'personas/suggestions/' + query).map(response => response.json());
    }

    logout() {
        let headers;
        headers = new HttpHeaders({
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded',
            'Authorization': this.getToken()
        });
        return this._http.post<any>(this.url + 'logout', {}, {headers: headers});
    }

    getSessions(dates) {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'show-sessions/' + dates.date1 + '/' + dates.date2, httpOptions2);
    }
}
