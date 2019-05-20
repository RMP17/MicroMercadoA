import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {PersonaService} from './persona.service';
import {Global} from './global';
import {CompraVenta} from '../models/compra-venta';

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
export class CompraVentaService {
    public url: string;

    constructor(
        private _http: HttpClient,
        private _personaService: PersonaService,
    ) {
        this.url = Global.url;
        // const _ttpOptions = this._httpOptions.getHttpOptions();
    }
    setAuthorization() {
        httpOptions.headers = httpOptions.headers.set('Authorization', this._personaService.getToken());
        httpOptions2.headers = httpOptions2.headers.set('Authorization', this._personaService.getToken());
    }
    storeCompraVenta(compraVenta: CompraVenta) {
        let json = JSON.stringify(compraVenta);
        let params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'compras-ventas', params, httpOptions2);
    }
    realizarPago(pago) {
        let json, params;
        json = JSON.stringify(pago);
        params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'compras/realizar-pago', params, httpOptions2);
    }
    registerPagoDeudor(pago) {
        let json, params;
        json = JSON.stringify(pago);
        params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'ventas/register-pago-deudor', params, httpOptions2);
    }
    getCompras(search) {
        if (!search.empleado_id) {
            search.empleado_id = '';
        }
        this.setAuthorization();
        return this._http.get<any>(this.url + 'compras/search/' + search.date1 + '/' + search.date2 + '/' + search.empleado_id,
            httpOptions);
    }
    getVentas(search) {
        if (!search.empleado_id) {
            search.empleado_id = '';
        }
        this.setAuthorization();
        return this._http.get<any>(this.url + 'ventas/search/' + search.date1 + '/' + search.date2 + '/' + search.empleado_id,
            httpOptions);
    }
    cancelSale(idVenta) {
        this.setAuthorization();
        return this._http.put(this.url + 'ventas/cancel-sale/' + idVenta, {},
            httpOptions);
    }
    cancelInvoice(idVenta) {
        this.setAuthorization();
        return this._http.put(this.url + 'ventas/cancel-invoice/' + idVenta, {},
            httpOptions);
    }
    addInvoice(factura) {
        let json, params;
        json = JSON.stringify(factura);
        params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'ventas/invoice', params, httpOptions2);
    }
    getCreditos() {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'compras/creditos', httpOptions);
    }
    getCreditosVentas() {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'ventas/creditos', httpOptions);
    }
    getVentasExport(dates) {
        this.setAuthorization();
        return this._http.get(this.url + 'ventas/export/' + dates.date1 + '/' + dates.date2, httpOptions);
    }
    getVentasMenoresExport(dates) {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'ventas/menores/export/' + dates.date1 + '/' + dates.date2, httpOptions);
    }
    generateLowerSalesInvoice(date) {
        let json, params;
        json = JSON.stringify(date);
        params = 'json=' + json;
        this.setAuthorization();
        return this._http.post(this.url + 'ventas/generate-lower-sales-invoice', params, httpOptions2);
    }
    getLowerSalesInvoice(dates) {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'ventas/get-lower-sales-invoice/' + dates.date1 + '/' + dates.date2,
            httpOptions);
    }
    getDetailOfLowerSales(idFactura) {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'ventas/detail-of-lower-sales/'  + idFactura, httpOptions);
    }
    cancelMinorSalesInvoice(idFactura) {
        this.setAuthorization();
        return this._http.put(this.url + 'ventas/cancel-minor-sales-invoice/' + idFactura, {}, httpOptions);
    }
}
