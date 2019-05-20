import { Component, OnInit, DoCheck } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductoService} from '../services/producto.service';
import {PersonaService} from '../services/persona.service';

@Component({
    selector: 'app-container',
    templateUrl: '../views/container.html',
})

export class ContainerComponent implements OnInit, DoCheck{
    public title: string;
    public identity;
    public quantifyProductsWithLowStock;
    public quantifyProductsToExpire;
    // public header_color: string;

    constructor(
        private _personaService: PersonaService,
        private _productService: ProductoService,
        private _route: ActivatedRoute,
        private _router: Router,
    ) {
        this.title = 'App';
        this.quantifyProductsToExpire = {
            tienda: 0,
            almacen: 0,
        };
        // this.header_color = Global.header_color;
    }
    ngOnInit() {
        this.showQuantifyProductsWithLowStock();
        this.showQuantifyProductsToExpire();
    }
    ngDoCheck() {
        this.identity = this._personaService.getIdentity();
    }

    showQuantifyProductsWithLowStock() {
        this._productService.getQuantifyProductsWithLowStock().subscribe(
            response => {
                this.quantifyProductsWithLowStock = response;
            }, errors => {
                let json;
                console.log(errors);
                // json = JSON.parse(errors._body);
                if (errors.status === 401) {
                    this.logout();
                    console.log(<any>errors);
                } else {
                    /*if (errors.status === 511) {
                        messageError = json.errors;
                    } else {
                        messageError = json.errors;
                    }
                    this.toastr.error(messageError);*/
                }
            }
        );
    }
    showQuantifyProductsToExpire() {
        this._productService.getQuantifyProductsToExpire().subscribe(
            response => {
                this.quantifyProductsToExpire = response;
            }, errors => {
                let json, messageError;
                // json = JSON.parse(errors._body);
                if (errors.status === 511) {
                    // messageError = json.errors;
                } else {
                    // messageError = json.errors;
                }
                // this.toastr.error(messageError);
                console.log(<any>errors);
            }
        );
    }
    logout() {
        this.identity = null;
        this._personaService.logout().subscribe(
            respose => {
                localStorage.clear();
                this._router.navigate(['/login']);
            }, errors => {
                console.log(errors);
                localStorage.clear();
                this._router.navigate(['/login']);
            }
        );
    }
}
