import { Component } from '@angular/core';
import { Global } from './services/global';
import { PersonaService } from './services/persona.service';
import { ProductoService } from './services/producto.service';
// import { ConfiguracionService } from './services/configuracion.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PersonaService, ProductoService]
})
export class AppComponent {
  /*public title: string;
  public identity;
  public quantifyProductsWithLowStock = 0;
  public quantifyProductsToExpire = 0;
  // public header_color: string;

  constructor(
      private _personaService: PersonaService,
      private _productService: ProductoService,
      private _route: ActivatedRoute,
      private _router: Router,
      private toastr: ToastrService,
  ) {
    this.title = 'App';
    // this.header_color = Global.header_color;
  }
  ngOnInit() {
    // this.identity = this._personaService.getIdentity();

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
                  /!*if (errors.status === 511) {
                      messageError = json.errors;
                  } else {
                      messageError = json.errors;
                  }
                  this.toastr.error(messageError);*!/
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
              this.toastr.error(messageError);
              console.log(<any>errors);
          }
      );
  }
  logout() {
      this.identity = null;
      this._router.navigate(['/home']);
      this._personaService.logout().subscribe(
          respose => {
              localStorage.clear();
          }, errors => {
              console.log(errors);
              localStorage.clear();
          }
      );
  }*/
}
