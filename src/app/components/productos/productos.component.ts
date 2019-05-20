import {Component, ViewChild, ElementRef} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

// Servicios
import {ProductoService} from '../../services/producto.service';
import {PersonaService} from '../../services/persona.service';
import {MarcaService} from '../../services/marca.service';
import {CategoriaService} from '../../services/categoria.service';
import {Global } from '../../services/global';
import {Observable} from 'rxjs';
// Models
import {Producto} from '../../models/producto';
import {Codigo} from '../../models/codigo';
import {Persona} from '../../models/persona';
import {Marca} from '../../models/marca';
import {Categoria} from '../../models/categoria';
// import * as process from 'process';
import {ToastrService} from 'ngx-toastr';


@Component({
    selector: 'productos',
    templateUrl: '../../views/productos/productos.html',
    providers: [
        ProductoService,
        PersonaService,
        MarcaService,
        CategoriaService
    ],
})

export class ProductosComponent {
    @ViewChild('inputFile') inputEl: ElementRef;
    public typeMode: boolean;
    public viewAllProductos: boolean = false;
    public viewAllProductosInfo: boolean = false;
    public modeEdit: boolean = false;
    public productos: Producto[];
    public _producto: Producto;
    public producto: Producto;
    public infoProducto: Producto;
    public fechaCaducidadUpdated: string;
    public proveedores: Persona[];
    public persona: Persona;
    public marcas: Marca[];
    public productoMarcas: Marca[];
    public codigos: Codigo[];
    public newCodigo: Codigo;
    public proveedoresPorProdcuto;
    public categorias: Categoria[];
    public productoCategorias: Categoria[];
    public limitsToShowNotifications = {
        stock: 0,
        days: 0
    };
    public limitDate;
    public productoMarcasIds: {
        id_producto: number,
        id_marca: number
    };
    public productoCategoriasIds: {
        id_producto: number,
        id_categoria: number
    };
    // public categoriasProducto: Categoria[];
    public searchProductoInput: string;
    public imgProducto;
    public today;
    public filesToUpload = null;
    public resultUpload;
    // public da = this.today.getFullYear()+'-'+this.today.getMonth()+1+'-'+this.today.getDate();
    // selectedItem: any = '';
    private inputChanged: any = '';
    configInfoProducto: any = {'placeholder': 'Descripción del Producto', 'sourceField': 'descripcion'};
    configProveedor: any = {'placeholder': 'Proveedor', 'sourceField': 'nombre'};
    configMarca: any = {'placeholder': 'Nombre de la marca', 'sourceField': 'nombre'};
    configCategoria: any = {'placeholder': 'Descripción', 'sourceField': 'descripcion'};

    constructor(private _route: ActivatedRoute,
                private _router: Router,
                private _productoService: ProductoService,
                private _personaService: PersonaService,
                private _marcaService: MarcaService,
                private _categoriaService: CategoriaService,
                private toastr: ToastrService) {
        this.producto = new Producto();
        this.infoProducto = new Producto();
        this.persona = new Persona(null, '', '', '', '', '');
        this.typeMode = false;
        this.today = new Date();
        this.searchProductoInput = '';
        this.newCodigo = new Codigo();
        this.productos = [];
        this.productoMarcasIds = {
            id_producto: null,
            id_marca: null
        };
        this.productoCategoriasIds = {
            id_producto: null,
            id_categoria: null
        };
        this.proveedoresPorProdcuto = [];
    }
    ngOnInit() {
        this.getProductoInit();
        this.getProveedoresNameInit();
        this.getLimitsToShowNotifications();
    }
    getLimitsToShowNotifications() {
        this._productoService.getLimitsToShowNotifications().subscribe(
            response => {
                this.limitsToShowNotifications.stock = response.stock;
                this.limitsToShowNotifications.days = response.dias_antes;
                let today = Date.now();
                let limitDate = new Date(today);
                this.limitDate = limitDate.setDate(limitDate.getDate() + response.dias_antes);
            }, errors => {
                let json, messageError;
                json = JSON.parse(errors._body);
                if (errors.status === 511) {
                    messageError = json.errors;
                } else {
                    messageError = json.errors;
                }
                this.toastr.error(messageError);
                console.log(<any>errors);
            }
        );
    }
    setTypeMode() {
        this.typeMode = !this.typeMode;
    }
    getProductoInit() {
        this._productoService.getProductos().subscribe(
            result => {
                if (result.status != 200) {
                    console.log(result);
                } else {
                    this.productos = result.data;
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }
    onSelectProducto(item: any) {
        this.infoProducto = item ? item : new Producto();
        this.urlRefreshImg();
    }
    getProducto() {
        var res = this.searchProductoInput.replace(/ /g, '');
        if (!(res.length > 0)) return;
        this._productoService.getProducto(this.searchProductoInput).subscribe(
            result => {
                if (result.status != 200) {
                    console.log(result);
                } else {
                    this.infoProducto = result.data;
                    this.urlRefreshImg();
                }
            },
            error => {
                this.toastr.error('No Existe El Código Introducido');
                console.log(<any>error);
            }
        );
    }
    // Actualiza cantidades de los productos
    toTransfer(field, producto) {
        this._productoService.transferirProductos(producto.id, {cantidad: field.value}).subscribe(
            response => {
                producto.stock += parseInt(field.value);
                producto.cantidad_almacen -= parseInt(field.value);
                field.value = 0;
                this.toastr.success('Operación Exitosa');
            },
            errors => {
                let messageError;
                if(errors.status === 511) {
                    messageError = errors.error;
                } else {
                    messageError = errors.error;
                }
                this.toastr.error(messageError);
                console.log(errors);
            }
        );
    }
    onSubmit() {

        this._productoService.addProducto(this.producto).subscribe(
            response => {
                this._productoService.makeFileRequest(Global.url + 'productos/upload-image', response,
                    this.filesToUpload)
                    .then(response => {
                            this.filesToUpload = null;
                        }, error => {
                            console.log(error);
                        }
                    );
                this.producto = new Producto();
                this.toastr.success('Operación Exitosa');
                this.getProductoInit();
            },
            errors => {
                console.log(errors);
                let messageError;
                if(errors.status === 511) {
                    messageError = errors.error;
                } else {
                    messageError = errors.error.codigo[0];
                }
                this.toastr.error(messageError);
                console.log(errors);
            }
        );
    }
    onSubmitEditedProdcuto() {
        if ( this.filesToUpload != null && this.filesToUpload.length > 0){
            this._productoService.updateProducto(this._producto.id, this._producto).subscribe(
                response => {
                    this._productoService.makeFileRequest(Global.url+'productos/upload-image', this._producto.id,
                        this.filesToUpload)
                        .then( responseImg => {
                                console.log();
                                this.infoProducto = response.data;
                                this.filesToUpload = null;
                                this.infoProducto.img = <string>responseImg;
                                this._producto = new Producto();
                                this.toastr.success('Operación Exitosa');
                                this.urlRefreshImg();
                                this.getProductoInit();
                            }, error => {
                                console.log(error);
                            }
                        );
                },
                errors => {
                    console.log(errors);
                }
            );
        } else {
            this._producto.img = this.infoProducto.img;
            this._productoService.updateProducto(this._producto.id, this._producto).subscribe(
                response => {
                    this.infoProducto = response.data;
                    this._producto = new Producto();
                    this.toastr.success('Operación Exitosa');
                    this.getProductoInit();
                },
                errors => {
                    if (errors.status === 511) {
                        this.toastr.error(errors.error);
                    } else {
                        console.log(<any>errors);
                    }
                }
            );
        }
    }
    getProveedoresNameInit() {
        this._personaService.getProveedoresNames().subscribe(
            result => {
                this.proveedores = result.data;
            },
            error => {
                console.log(<any>error);
            }
        );
    }
    onSelectProveedor(item: any) {
        this.producto.id_proveedor = item ? item.id : null;
    }
    getCategorias(event) {
        this.categorias = event;
    }
    getCodigos(id) {
        this._productoService.getCodigos(id).subscribe(
            response => {
                if (response.status != 200) {
                    console.log(response);
                } else {
                    this.codigos = response.data;
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }
    onSubmitCodigo() {
        this.newCodigo.producto_id = this.infoProducto.id;
        this._productoService.addCodigo(this.newCodigo).subscribe(
            response => {
                this.getCodigos(this.newCodigo.producto_id);
                this.newCodigo = new Codigo();
                this.toastr.success('Operación Exitosa');
            },
            error => {
                console.log(<any>error);
                this.toastr.error('Error');
            }
        );
    }
    deleteCodigo(id) {
        this._productoService.deleteCodigo(id).subscribe(
            response => {
                this.getCodigos(this.infoProducto.id);
                this.toastr.success('Operación Exitosa');
            },
            errors => {
                if (errors.status === 511) {
                    this.toastr.error(errors.error);
                } else {
                    console.log(<any>errors);
                }
            }
        );
    }
    onSelectMarca(item: any) {
        this.producto.id_marca = item ? item.id : null;
    }
    getMarcas(event) {
        this.marcas = event;
    }
    onSelectProductoMarcas(item: any) {
        if (item && item.id) {
            this.productoMarcasIds.id_marca = item ? item.id : null;
            this.onSubmitProductoMarcas();
        }
    }
    onSubmitProductoMarcas() {
        this.productoMarcasIds.id_producto = this.infoProducto.id;
        this._productoService.addProductoMarcas(this.productoMarcasIds).subscribe(
            response => {
                this.getMarcasProducto(this.infoProducto.id);
                this.toastr.success('Operación Exitosa');
            },
            error => {
                console.log(<any>error);
                this.toastr.error('Error');
            }
        );
    }
    getMarcasProducto(id) {
        this._productoService.getMarcasProducto(id).subscribe(
            response => {
                if (response.status != 200) {
                    console.log(response);
                } else {
                    this.productoMarcas = response.data;
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }
    deleteProductoMarcas(id) {
        this.productoMarcasIds.id_producto = this.infoProducto.id;
        this.productoMarcasIds.id_marca = id;
        this._productoService.deleteProductoMarcas(this.productoMarcasIds).subscribe(
            response => {
                this.getMarcasProducto(this.infoProducto.id);
                this.productoMarcasIds.id_producto = null;
                this.productoMarcasIds.id_marca = null;
                this.toastr.success('Operación Exitosa');
            },
            errors => {
                if (errors.status === 511) {
                    this.toastr.error(errors.error);
                } else {
                    console.log(<any>errors);
                }
            }
        );
    }
    getProductoCategorias(id) {
        this._productoService.getProductoCategorias(id).subscribe(
            response => {
                if (response.status != 200) {
                    console.log(response);
                } else {
                    this.productoCategorias = response.data;
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }
    editProducto(producto: Producto) {
        this._producto = producto;
    }
    /*cancelModeEdit() {
        this._producto = new Producto();
    }*/
    onSelectCategoria(item: any) {
        this.producto.id_categoria = item ? item.id : null;
    }
    onSelectProductoCategorias(item: any) {
        if (item && item.id) {
            this.productoCategoriasIds.id_categoria = item ? item.id : null;
            this.onSubmitProductoCategorias();
        }
    }
    onSubmitProductoCategorias() {
        this.productoCategoriasIds.id_producto = this.infoProducto.id;
        this._productoService.addProductoCategorias(this.productoCategoriasIds).subscribe(
            response => {
                this.getProductoCategorias(this.infoProducto.id);
                this.toastr.success('Operación Exitosa');
            },
            error => {
                console.log(<any>error);
                this.toastr.error('Error');
            }
        );
    }
    deleteProductoCategorias(id) {
        this.productoCategoriasIds.id_producto = this.infoProducto.id;
        this.productoCategoriasIds.id_categoria = id;
        this._productoService.deleteProductoCategorias(this.productoCategoriasIds).subscribe(
            response => {
                this.getProductoCategorias(this.infoProducto.id);
                this.productoCategoriasIds.id_producto = null;
                this.productoCategoriasIds.id_categoria = null;
                this.toastr.success('Operación Exitosa');
            },
            errors => {
                this.toastr.error(errors.error);
                console.log(<any>errors);
            }
        );
    }
    fileChabgeEvent(event) {
        this.filesToUpload = <Array<File>>event.target.files;
    }
    urlRefreshImg() {
        if (this.infoProducto) {
            if (this.infoProducto.img)
                this.imgProducto = Global.urlImg + this.infoProducto.img + '?' + new Date().getTime();
            else
                this.imgProducto = null;
        }
    }

    productosPorCaducar() {
        if(!this.productos) return [];
        var prod=[];
        this.productos.forEach(producto => {
            if (this.viewAllProductos) {
                if(new Date(producto.fecha_caducidad).getTime() < new Date(this.limitDate).getTime())
                    prod.push(producto)
            } else {
                if(new Date(producto.fecha_caducidad).getTime() < new Date(this.limitDate).getTime() && producto.notificar)
                    prod.push(producto)
            }
        });
        var prod=prod.sort(function(a,b){
            var c: any = new Date(a.fecha_caducidad);
            var d: any = new Date(b.fecha_caducidad);
            return c-d;
        });
        return prod;
    }
    productosPorCaducarAlmacen() {
        if(!this.productos) return [];
        var prodAlmacen=[];
        this.productos.forEach(producto => {
            if (this.viewAllProductos) {
                if(new Date(producto.fecha_caducidad_almacen).getTime() < new Date(this.limitDate).getTime())
                    prodAlmacen.push(producto)
            } else {
                if(new Date(producto.fecha_caducidad_almacen).getTime() < new Date(this.limitDate).getTime() && producto.notificar_fecha_caducidad)
                    prodAlmacen.push(producto)
            }
        });
        var prodAlmacen=prodAlmacen.sort(function(a,b){
            var c: any = new Date(a.fecha_caducidad_almacen);
            var d: any = new Date(b.fecha_caducidad_almacen);
            return c-d;
        });
        return prodAlmacen;
    }
    stockProductos() {
        if(!this.productos) return [];
        var stock=[];
        this.productos.forEach(producto => {
            if (this.viewAllProductos) {
                if(producto.stock <= this.limitsToShowNotifications.stock)
                    stock.push(producto)
            } else {
                if(producto.stock <= this.limitsToShowNotifications.stock && producto.notificar)
                    stock.push(producto)
            }
        });
        var stock=stock.sort(function(a,b){
            return a.stock-b.stock;
        });
        return stock;
    }
    validateDate(date) {
        let valid = false;
        let month = parseInt(date[1]);
        switch (month) {
            case 2:
                if ((date[0] % 4 == 0 && date[0] % 100 != 0) || date[0] % 400 == 0) {
                    if(date[2]<=29) valid = true;
                } else if(date[2]<29) {
                     valid = true;
                }
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                if (date[2] <= 30) valid = true;
                break;
            case 1:
            case 3:
            case 5:
            case 8:
            case 10:
            case 12:
                if (date[2] <= 31) valid = true;
        }
        return valid;
    }
    formatDate(value) {
        let dateString = value.split('-');
        if (!this.validateDate(dateString)) return 'Invalid Date';
        let date = new Date(dateString[0], dateString[1]-1, dateString[2]);
        let dd: any = date.getDate();
        let mm: any = date.getMonth()+1; //January is 0!
        let yyyy = date.getFullYear();
        if(dd<10){
            dd = '0'+dd;

        }
        if(mm<10){
            mm = '0'+mm;
        }

        return yyyy+'-'+mm+'-'+dd;
    }
    updateFechaVencimiento(field ,producto) {
        if (field.value.length > 7) {
            let date = this.formatDate(field.value);
            if (date == 'Invalid Date' || field.value == producto.fecha_caducidad) {
                // field.value = producto.fecha_caducidad;
                return;
            }
            this._productoService.updateDate(producto.id, {fecha_caducidad: date}).subscribe(
                response => {
                    producto.fecha_caducidad = date;
                    this.toastr.success('Operación Exitosa');
                },
                error => {
                    console.log(<any>error);
                    this.toastr.error('Error');
                }
            );
        }
    }
    cancelFechaVencimientoUpdate(field ,producto){
        field.value = producto.fecha_caducidad;
    }
    updateFechaVencimientoAlmacen(field ,producto) {
        if (field.value.length > 7){
            let date = this.formatDate(field.value);
            if (date =='Invalid Date' || field.value == producto.fecha_caducidad_almacen) {
                field.value = producto.fecha_caducidad_almacen;
                return;
            }
            this._productoService.updateDate(producto.id, {fecha_caducidad_almacen: date}).subscribe(
                response => {
                    producto.fecha_caducidad_almacen = date;
                    this.toastr.success('Operación Exitosa');
                },
                error => {
                    console.log(<any>error);
                    this.toastr.error('Error');
                }
            );
        }
    }
    cancelFechaVencimientoUpdateAlmacen(field ,producto){
        field.value = producto.fecha_caducidad_almacen;
    }
    cancelToTransfer(field ,producto){
        field.value = 0;
    }
    notify(event, producto) {
        if(parseInt(event.target.value)) {
            producto.notificar = 0;
        } else {
            producto.notificar = 1;
        }
        this._productoService.updateNotifications(producto.id, {notificar: producto.notificar}).subscribe(
            response => {
                this.toastr.success('Operación Exitosa');
            },
            error => {
                console.log(<any>error);
                this.toastr.error('Error');
            }
        );
    }
    notifyAlmacen(event, producto) {
        if(parseInt(event.target.value))
            producto.notificar_fecha_caducidad = 0;
        else
            producto.notificar_fecha_caducidad = 1;
        this._productoService.updateNotifications(producto.id, {notificar_fecha_caducidad: producto.notificar_fecha_caducidad}).subscribe(
            response => {
                this.toastr.success('Operación Exitosa');
            },
            error => {
                console.log(<any>error);
                this.toastr.error('Error');
            }
        );
    }
    setViewAllProductos() {
        this.viewAllProductos = !this.viewAllProductos
    }
    updateStock(event, producto) {

    }
    getProveedoresPorProducto(idProducto) {
        this._productoService.getProveedoresPorProducto(idProducto).subscribe(
            response => {
                this.proveedoresPorProdcuto = response.data;
            }, errors => {
                console.log(<any>errors);
            }
        );
    }
    /*toDate(date) {
     if (date !== undefined && date.length >= 10) {
     let dateInput = date.split('-');
     console.log(dateInput);
     let dateMilliseconds = new Date(dateInput[0], dateInput[1], dateInput[2]).getTime();
     console.log(dateMilliseconds);
     let dateNow = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).getTime();
     if(dateMilliseconds > dateNow)
     return false;
     }
     return true;
     }*/
}