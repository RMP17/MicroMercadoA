
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';

import { PersonaService } from '../services/persona.service';

import {Producto} from '../models/producto';
import {Codigo} from '../models/codigo';
import {Global} from './global';

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
export class ProductoService {
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
    getProductos() {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'productos', httpOptions);
    }
    getProveedoresPorProducto(idProducto) {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'productos/proveedores/' + idProducto, httpOptions);
    }
    getProducto(id) {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'productos/' + id, httpOptions);
    }
    /*getProductoId(id) {
        return this._http.get(this.url + 'producto-id/' + id).map(res => res.json());
    }*/

    addProducto(producto: Producto) {
        let json = JSON.stringify(producto);
        let params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'productos', params, httpOptions2);
    }
    getMarcasProducto(id) {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'marcas/' + id, httpOptions);
    }
    addProductoMarcas(marca) {
        let json = JSON.stringify(marca);
        let params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'productos/producto-marca', params, httpOptions2);
    }
    deleteProductoMarcas(marcaIds) {
        let json = JSON.stringify(marcaIds);
        let params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'productos/delete-producto-marca', params, httpOptions2);
    }
    transferirProductos(id, cantidadProducto) {

        let json = JSON.stringify(cantidadProducto);
        let params = 'json=' + json;
        this.setAuthorization();
        return this._http.put<any>(this.url + 'productos/transferencia/' + id, params, httpOptions2);
    }
    updateProducto(id, producto: Producto) {
        let json = JSON.stringify(producto);
        let params = 'json=' + json;
        this.setAuthorization();
        return this._http.put<any>(this.url + 'productos/' + id, params, httpOptions2);
    }
    updateDate(id, productoDate) {

        let json = JSON.stringify(productoDate);
        let params = 'json=' + json;
        this.setAuthorization();
        return this._http.put<any>(this.url + 'productos/update-date/' + id, params, httpOptions2);
    }
    updateNotifications(id, productoNotify) {

        let json = JSON.stringify(productoNotify);
        let params = 'json=' + json;
        this.setAuthorization();
        return this._http.put<any>(this.url + 'productos/update-notifications/' + id, params, httpOptions2);
    }
    getCodigos(id) {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'codigos/' + id, httpOptions);
    }
    addCodigo(codigo: Codigo) {
        let json = JSON.stringify(codigo);
        let params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'codigos', params, httpOptions2);
    }
    deleteCodigo(id) {
        this.setAuthorization();
        return this._http.delete<any>(this.url + 'codigos/' + id, httpOptions);
    }
    getProductoCategorias(id) {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'productos/categorias/' + id, httpOptions)
            .pipe(map(res => res));
    }
    addProductoCategorias(categoria) {
        let json = JSON.stringify(categoria);
        let params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'productos/categorias/store', params, httpOptions2);
    }
    deleteProductoCategorias(productoCategoriaIds) {
        let json = JSON.stringify(productoCategoriaIds);
        let params = 'json=' + json;
        this.setAuthorization();
        return this._http.post<any>(this.url + 'productos/categorias', params, httpOptions2);
    }
    getQuantifyProductsWithLowStock() {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'productos/quantity', httpOptions);
    }
    getQuantifyProductsToExpire() {
        this.setAuthorization();
        return this._http.get<any>(this.url + 'productos/quantity-to-expire', httpOptions);
    }
    getLimitsToShowNotifications() {
        this.setAuthorization()
        return this._http.get<any>(this.url + 'productos/limits-to-show-notifications', httpOptions);
    }
    makeFileRequest(url: string, params, files) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            var formData: FormData = new FormData();
            // FORMDATA NO SE PUEDE IMPRIMIR CON CONSOLE LOG
            if (files) {
                for (var i = 0; i < files.length; i++) {
                    let filename = files[i].name.split('\\').pop().split('/').pop();
                    let lastIndex = filename.lastIndexOf(".");
                    let extension = '';
                    if (!(lastIndex < 1))
                        extension = filename.substr(lastIndex);
                    formData.append('uploads', files[i], params + extension);
                }
                formData.append('id_producto', params);
                xhr.onreadystatechange = function() {
                    if(xhr.readyState == 4){
                        if(xhr.status == 200) {
                            resolve(JSON.parse(xhr.response));
                        } else {
                            reject(xhr.response);
                        }
                    }
                }
                xhr.open('POST', url, false);
                xhr.setRequestHeader('Authorization', this._personaService.getToken());
                xhr.send(formData);
            }
        });
    }
}
