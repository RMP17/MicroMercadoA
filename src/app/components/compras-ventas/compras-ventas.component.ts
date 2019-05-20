import { Component, ViewChild, ElementRef, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { ProductoService } from '../../services/producto.service';
import { CompraVentaService } from '../../services/compras-ventas.service';
import { Producto } from '../../models/producto';
import { Detalle } from '../../models/detalle';
import { Global } from '../../services/global';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
// import { trigger, state, style, transition, animate } from '@angular/animations';
// import { FacturaComponent } from '../../components/compras-ventas/factura.component';

// import * as process from 'process';
import { ToastrService } from 'ngx-toastr';
import {CompraVenta} from '../../models/compra-venta';


@Component({
    selector: 'app-compras-ventas',
    templateUrl: '../../views/compras-ventas/compras-ventas.html',
    providers: [PersonaService, ProductoService, CompraVentaService, DatePipe, DecimalPipe],
    /*animations: [
         trigger('img',[
             state('activo',style({
                 transform: 'scale(1)'
             })),
             state('inactivo', style({
                transform: 'scale(0)'
             })),
             state('none', style({
                transform: 'scale(1)'
             })),
             transition('none => activo', animate('200ms ease-in')),
             transition('activo => none', animate('10ms')),
             transition('none => inactivo', animate('200ms ease-out'))
         ])
    ]*/
})

export class CompraVentasComponent implements OnInit {
    @ViewChild('inputAutocompleteSuggestion') inputAutocompleteSuggestion: ElementRef;
    @ViewChild('inputCantidad') inputCantidad: ElementRef;
    @ViewChild('inputCodigo') inputCodigo: ElementRef;
    @ViewChild('btmSi') btmSi: ElementRef;
    @Output() eventChangeSales = new EventEmitter();
    @Output() eventMakeSale = new EventEmitter();
    @Input() actividad: string; // c = compra, v = venta
    @Input() persona: number;
    @Input() set getVenta(venta) {
        if (venta) {
            if (!venta.venta.detalle) {
                venta.venta.detalle = [];
            }
            this.detalles = venta.venta.detalle;
            this.compraVenta = venta.venta;
            this.calcularTotalPagar();
        }
    }
    public dataForQr: string;
    public registeredCompraVenta: any;
    public fieldSearchProducto: string;
    public inProcess: boolean;
    public refreshAutocomplete: boolean;
    public existProducto: boolean;
    public producto: Producto;
    public productos: Producto[];
    public imgProducto: any;
    public imgEstado: any; // 0=no existe img; 1=existe producto sin img; 2=existe img
    public existPersona;
    public compraVenta: CompraVenta;
    public detalles: Detalle[];
    public detalle: Detalle;
    public img: string;
    public totalPagar: number;
    configProducto: any = {'placeholder': 'Descripción del producto', 'sourceField': ['descripcion']};
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _personaService: PersonaService,
        private _productoService: ProductoService,
        private _compraVentaService: CompraVentaService,
        private toastr: ToastrService,
        private datePipe: DatePipe,
        private _number: DecimalPipe
        // import * as process from 'process'
    ) {
        this.imgProducto = '';
        this.dataForQr = '';
        this.imgEstado = 3;
        this.detalles = [];
        this.compraVenta = new CompraVenta();
        this.producto = new Producto();
        // this.persona = new Persona(null, '', '', '', '', '');
        this.fieldSearchProducto = '';
        this.detalle = new Detalle();
        this.totalPagar = 0;
        this.inProcess = false;
        this.existProducto = false;
        this.refreshAutocomplete = false;
        this.registeredCompraVenta = {
            cliente: {
                ci: '',
                id: null
            },
            nombre: '',
            descuento: null,
            detalle: null,
            efectivo: null,
            empleado: '',
            factura: {
                nro_factura: '',
                nro_autorizacion: '',
                nulo: null,
                codigo_control: ''
            },
            fecha_hora: null,
            id: null,
            tipo: '',
            total: null
        };
    }
    ngOnInit() {
        this.getAllProductos();
    }
    getAllProductos() {
        this._productoService.getProductos().subscribe(
            response => {
                if (response.status !== 200) {
                    console.log(response);
                } else {
                    this.productos = response.data;
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }
    onCreadito() {
        this.compraVenta.tipo = !this.compraVenta.tipo;
        this.eventChangeSales.emit();
    }
    onVentaMenor() {
        this.compraVenta.venta_menor = !this.compraVenta.venta_menor;
        this.eventChangeSales.emit();
    }
    onSelectProducto(event) {
        if (event && event.id) {
            this.imgEstado = 3;
            this.producto = event;
            this.detalle.id_producto = event.id;
            if (this.actividad === 'v') {
                this.detalle.precio_unitario = event.precio_venta_unidad;
            } else {
                this.detalle.precio_unitario = event.precio_compra_unidad;
            }
            this.detalle.producto = event.descripcion;
            this.existProducto = true;
            if (event.img) {
                this.urlRefreshImg();
                this.transitionTimeOfTheImage(2);
            } else {
                this.transitionTimeOfTheImage(1);
            }
            this.inputCantidad.nativeElement.select();
        } else {
            this.producto = new Producto();
            this.detalle = new Detalle();
            this.existProducto = false;
            this.transitionTimeOfTheImage(0);
        }
    }
    getProductoByCode() {
        let _fieldSearchProducto = this.fieldSearchProducto.replace(/ /g, '');
        if (!(_fieldSearchProducto.length > 0)) {
            return;
        }
        this.imgEstado = 3;
        this._productoService.getProducto(this.fieldSearchProducto).subscribe(
            response => {
                if (response.status !== 200) {
                    console.log(response);
                } else {
                    this.producto = response.data;
                    this.existProducto = true;
                    this.detalle.id_producto = response.data.id;
                    this.detalle.precio_unitario = response.data.precio_venta_unidad;
                    this.detalle.producto = response.data.descripcion;
                    if (response.data.img) {
                        this.transitionTimeOfTheImage(2);
                        this.urlRefreshImg();
                    } else {
                        this.transitionTimeOfTheImage(1);
                    }
                    if (this.producto) {
                        this.inputCantidad.nativeElement.select();
                    }
                }
            },
            error => {
                this.toastr.error('No Existe El Código Introducido');
                this.transitionTimeOfTheImage(0);
                this.producto = new Producto();
                console.log(<any>error);
            }
        );
    }
    addDetalles() {
        if (this.actividad === 'v') {
            if (this.detalle.cantidad_producto > this.producto.stock) {
                return ;
            }
        }
        if (this.detalle.id_producto && this.existProducto && this.detalle.cantidad_producto && this.detalle.precio_unitario) {
            let index = this.detalles.findIndex(
                detalle => {
                    return detalle.id_producto === this.detalle.id_producto;
                });
            if (index === -1) {
                this.detalle.subtotal = parseFloat((this.detalle.precio_unitario * this.detalle.cantidad_producto).toFixed(2));
                this.detalles.push(this.detalle);
                this.fieldSearchProducto = '';
                this.inputCodigo.nativeElement.focus();
                this.detalle = new Detalle();
                this.producto = new Producto();
                this.imgEstado = 3;
                this.calcularTotalPagar();
                if (this.actividad === 'v') {
                    this.eventChangeSales.emit();
                    // localStorage.setItem('detalles', JSON.stringify(this.detalles));
                }
            } else {
                let detalle: Detalle;
                detalle = this.detalles[index];
                detalle.cantidad_producto += this.detalle.cantidad_producto;
                detalle.subtotal += parseFloat((this.detalle.precio_unitario * this.detalle.cantidad_producto).toFixed(2));
                this.fieldSearchProducto = '';
                this.inputCodigo.nativeElement.focus();
                this.detalle = new Detalle();
                this.producto = new Producto();
                this.imgEstado = 3;
                this.calcularTotalPagar();
                if (this.actividad === 'v') {
                    this.eventChangeSales.emit();
                }
            }
            /*this.refreshAutocomplete = true;
            setTimeout( () => {
                this.refreshAutocomplete = false;
            }, 1);*/
        }
    }
    getProductoAndChange() {
        event.preventDefault();
        this.getProductoByCode();
    }
    calcularTotalPagar() {
        let total = 0;
        this.detalles.forEach( detalle => {
            total = total + (detalle.cantidad_producto * detalle.precio_unitario);
        });
        this.totalPagar = parseFloat(total.toFixed(2));
        if (this.actividad === 'v') {
            localStorage.setItem('totalPagar', JSON.stringify(this.totalPagar));
        }
        this.compraVenta.total = total;
    }
    setVerify() {
        this.existProducto = false;
        this.detalle = new Detalle();
        this.producto = new Producto();
        this.imgEstado = 3;
    }
    changeCantidad(detalle, event) {
        if (event.target.value.length > 0) {
            detalle.cantidad_producto = parseFloat(event.target.value);
            detalle.subtotal = parseFloat((detalle.precio_unitario * detalle.cantidad_producto).toFixed(2));
            this.calcularTotalPagar();
            if (this.actividad === 'v') {
                localStorage.setItem('detalles', JSON.stringify(this.detalles));
            }
        }
    }
    changePrecio(detalle, event) {
        if (event.target.value.length > 0) {
            detalle.precio_unitario = parseFloat(event.target.value);
            detalle.subtotal = parseFloat((detalle.precio_unitario * detalle.cantidad_producto).toFixed(2));
            this.calcularTotalPagar();
            if (this.actividad === 'v') {
                localStorage.setItem('detalles', JSON.stringify(this.detalles));
            }
        }
    }
    onSubmit() {
        if (this.actividad === 'v') {
            this.compraVenta.cliente_id = this.persona;
        } else if (this.actividad === 'c') {
            this.compraVenta.proveedor_id = this.persona;
        } else {
            return ;
        }
        if (!(this.detalles.length > 0)) {
            this.toastr.error('Lista de productos vacía');
            return;
        }
        this.compraVenta.actividad = this.actividad;
        this.compraVenta.detalle = this.detalles;
        if (!this.inProcess) {
            this.inProcess = true;
            this._compraVentaService.storeCompraVenta(this.compraVenta).subscribe(
                response => {
                    let venta_menor, tipo, compraVenta;
                    // this.registeredCompraVenta = response.data;
                    this.toastr.success('Operación Exitosa');
                    this.detalles = [];
                    venta_menor = this.compraVenta.venta_menor;
                    tipo = this.compraVenta.tipo;
                    // this.compraVenta = new CompraVenta();
                    compraVenta = new CompraVenta();
                    /*this.compraVenta.venta_menor = venta_menor;
                    this.compraVenta.tipo = tipo;*/
                    compraVenta.venta_menor = venta_menor;
                    compraVenta.tipo = tipo;
                    Object.assign(this.compraVenta, compraVenta);
                    // this.compraVenta.detalle =  [];
                    this.producto = new Producto();
                    this.imgProducto = '';
                    this.imgEstado = 3;
                    this.fieldSearchProducto = '';
                    this.detalle = new Detalle();
                    this.inProcess = false;
                    if (this.actividad === 'v') {
                        this.eventChangeSales.emit();
                        this.eventMakeSale.emit(response.data);
                    }
                    this.getAllProductos();
                }, errors => {
                    console.log(errors);
                    this.toastr.error(errors.error);
                    this.inProcess = false;
                }
            );
        }
    }
    quitarDetalle(index) {
        this.detalles.splice(index, 1);
        this.eventChangeSales.emit();
        this.calcularTotalPagar();
    }
    cancelCompraVenta() {
        this.detalles = [];
        this.compraVenta = new CompraVenta();
        this.producto = new Producto();
        this.imgProducto = '';
        this.imgEstado = 3;
        this.fieldSearchProducto = '';
        this.detalle = new Detalle();
        this.inProcess = false;
        if (this.actividad === 'v') {
            this.eventChangeSales.emit();
        }
    }
    /*searchPersona() {
        event.preventDefault();
        this._personaService.searchPersonaCi(this.persona.ci).subscribe(
            response => {
                if (response.data && response.data.id) {
                    this.compraVenta.cliente_id = response.data;
                    this.existPersona = response.data;
                } else {
                    this.existPersona.id = null;
                    if ( this.compraVenta.cliente_id) {
                        this.compraVenta.cliente_id = null;
                    }
                }
            }, error => {
                console.log(<any>error);
            }
        );
    }*/
    urlRefreshImg() {
        if (this.producto) {
            if (this.producto.img) {
                this.imgProducto = Global.urlImg + this.producto.img + '?' + new Date().getTime();
            } else {
                this.imgProducto = null;
            }
        }
    }
    venta(value) {
        this.compraVenta.f = value;
        setTimeout(() => {
            this.btmSi.nativeElement.focus();
        }, 350);
    }
    transitionTimeOfTheImage(state) {
        setTimeout(() => {
            this.imgEstado = state;
        },300);
    }
}
