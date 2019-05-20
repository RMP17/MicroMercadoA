import { Component, ViewChild, ElementRef, Output, EventEmitter , OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { CompraVentaService } from '../../services/compras-ventas.service';
import { Persona } from '../../models/persona';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-compras',
    templateUrl: '../../views/compras-ventas/compras.html',
    providers: [PersonaService, CompraVentaService]
})

export class ComprasComponent implements OnInit {
    public titulo: string;
    public _persona: Persona;
    public empleados: Persona[];
    public proveedor;
    public compras: any;
    public refreshAutocomplete: boolean;
    public creditos: any;
    public total: number;
    public descuento: number;
    public totalGastos: number;
    public totalPagar: number;
    public cambio: number;
    public totalCuotas: number;
    public detalles: any;
    public dataCuotas: any;
    public searchCompra: {
        date1: any,
        date2: any,
        empleado_id
    };
    public pago: {
        proveedor_id: number,
        cuota: number
    };
    public personas: Persona[];
    configProveedor: any = {'placeholder': 'Nombre del Proveedor', 'sourceField': ['nombre']};
    configEmpleados: any = {'placeholder': 'Nombre del Empleado', 'sourceField': ['nombre']};
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _personaService: PersonaService,
        private _compraService: CompraVentaService,
        private toastr: ToastrService,
    ) {
        this.titulo = 'Compras';
        this.total = 0;
        this.totalGastos = 0;
        this.totalCuotas = 0;
        this.totalPagar = 0;
        this.proveedor = null;
        this.cambio = 0;
        this.refreshAutocomplete = false;
        this._persona = new Persona(null, '', '', '', '', '');
        let date, year, month, day;
        date = new Date(Date.now());
        year = date.getFullYear();
        if (date.getMonth() + 1 < 10) {
            month = '0' + (date.getMonth() + 1);
        } else {
            month = date.getMonth() + 1;
        }
        if (date.getDate() < 10) {
            day = '0' + date.getDate();
        } else {
            day = date.getDate();
        }
        this.searchCompra = {
            date1 : year + '-' + month + '-' + day,
            date2 : year + '-' + month + '-' + day,
            empleado_id : null
        };
        this.pago = {
            proveedor_id: null,
            cuota: null
        };
    }
    ngOnInit() {
        this.getProveedores();
        this.getEmpleado();
        this.getCompras();
        this.getCreditos();
    }
    getProveedores() {
        this._personaService.getProveedoresNames().subscribe(
            response => {
                this.personas = response.data;
            }, error => {
                console.log(error);
            }
        );
    }
    getEmpleado() {
        this._personaService.getEmpleados().subscribe(
            response => {
                this.empleados = response.data;
            }, errors => {
                console.log(<any>errors);
            }
        );
    }
    onSelectProveedor(event) {
        if (event != null) {
            this._persona = event;
        } else {
            this._persona = null;
        }
    }
    selectProveedorAPagar(event) {
        this.cambio = 0;
        if (event && event.id) {
            this.pago.proveedor_id = event.id;
            this.proveedor = event.nombre;
        } else {
            this.pago.proveedor_id = event;
            this.proveedor = event;
        }
        this.getCreditos();
    }
    setEmpleadoId(event) {
        if (event != null) {
            this.searchCompra.empleado_id = event.id;
        } else {
            this.searchCompra.empleado_id = null;
        }
        this.getCompras();
    }
    selectedDate(event, numericDate) {
        if (numericDate === 1) {
            if  (new Date(event.target.value).getTime() > new Date(this.searchCompra.date2).getTime()) {
                this.searchCompra.date1 = event.target.value;
                this.searchCompra.date2 = event.target.value;
            } else {
                this.searchCompra.date1 = event.target.value;
            }
        } else {
            if  (new Date(event.target.value).getTime() < new Date(this.searchCompra.date1).getTime()) {
                this.searchCompra.date1 = event.target.value;
                this.searchCompra.date2 = event.target.value;
            } else {
                this.searchCompra.date2 = event.target.value;
            }
        }
        this.getCompras();
    }
    setIdProveedor(event) {
        if (event != null) {
            this.refreshAutocomplete = true;
            setTimeout( () => {
                this.refreshAutocomplete = false;
            }, 1);
            this._persona = event;
            this.getProveedores();
        }
    }
    getCompras() {
        this._compraService.getCompras(this.searchCompra).subscribe(
            response => {
                this.totalGastos = 0;
                this.compras = response.data;
                let subtotal;
                this.compras.forEach( compra => {
                    compra.detalle.forEach( detalle => {
                        subtotal = detalle.cantidad * detalle.precio_unitario;
                        detalle.subtotal = subtotal;
                    });
                    this.totalGastos = this.totalGastos + (compra.total - compra.descuento);
                });
            }, errors => {
                console.log(<any>errors);
                let json;
                json = JSON.parse(errors._body);
                this.toastr.error(json.errors);
            }
        );
    }
    onClickGetCredits() {
        this.proveedor = null;
        this.getCreditos();
        this.refreshAutocomplete = true;
        setTimeout( () => {
            this.refreshAutocomplete = false;
        }, 1);
    }
    getCreditos() {
        this._compraService.getCreditos().subscribe(
            response => {
                this.totalPagar = 0;
                let total, subtotal, cuotas;
                if (this.proveedor === null) {
                    this.creditos = response.data;
                } else {
                    this.creditos = response.data.filter(credito => {
                        return credito.proveedor === this.proveedor;
                    });
                }
                this.creditos.forEach( credito => {
                    total = 0;
                    credito.detalle.forEach( detalle => {
                        subtotal = detalle.cantidad * detalle.precio_unitario;
                        detalle.subtotal = subtotal;
                        total = total + subtotal;
                    });
                    cuotas = 0;
                    credito.pagos.forEach( pago => {
                        cuotas += pago.cuota;
                    });
                    credito.cuotas = cuotas;
                    credito.total = total;
                    this.totalCuotas += cuotas;
                    this.totalPagar = this.totalPagar + (total - credito.descuento - cuotas);
                });
            }, errors => {
                console.log(<any>errors);
                let json;
                json = JSON.parse(errors._body);
                this.toastr.error(json.errors);
            }
        );
    }
    showDetalles(detalles, total, descuento) {
        this.detalles = detalles;
        this.total = total;
        this.descuento = descuento;
    }
    showCuotas(cuotas) {
        this.dataCuotas = cuotas;
    }
    submitPago() {
        this._compraService.realizarPago(this.pago).subscribe(
            response => {
                this.cambio = response.cambio;
                this.pago.cuota = null;
                this.getCreditos();
                this.toastr.success('Operación Exitosa');
            }, errors => {
                this.toastr.error(errors.error);
                console.log(<any>errors);
            }
        );
    }
}
