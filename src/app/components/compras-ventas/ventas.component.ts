import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { CompraVentaService } from '../../services/compras-ventas.service';
import { Persona } from '../../models/persona';
import { Factura } from '../../models/factura';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, DecimalPipe } from '@angular/common';
import * as XLSX from 'xlsx';
import {CompraVenta} from '../../models/compra-venta';

type AOA = any[][];

@Component({
    selector: 'app-ventas',
    templateUrl: '../../views/compras-ventas/ventas.html',
    providers: [PersonaService, CompraVentaService, DatePipe, DecimalPipe]
})

export class VentasComponent implements OnInit {
    public data = [];
    public titulo: string;
    public currentTab: number;
    public inProcess = false;
    public refreshCompraVenta: boolean;
    public refreshAutocomplete: boolean;
    public toggleSeeSales: boolean;
    public persona: Persona;
    public personas: Persona[];
    public empleados: Persona[];
    public dataCuotas: any;
    public dataFactura: Factura;
    public ventas: any;
    public creditos: any;
    public filteredDataForSale: any;
    public lowerSalesInvoice: any;
    public detailMinorSales: any;
    public updateLowerSalesInvoice: any;
    public detalles: any;
    public detailOfLowerSales: any;
    public total: number;
    public totalVentasMenores: number;
    public descuento: number;
    public compraVenta: any;
    public selectedSale: any;
    public invoice: any;
    public datesToExportSales: {
        date1: string,
        date2: string,
    };
    public salesInLocalStorage: any;
    public saleForLocalStorage: any;
    public datesToGetMinorSalesInvoice: {
        date1: string,
        date2: string,
    };
    public totalVentas: number;
    public credito: {
        cambio: number,
        cuota: number,
        totalPagar: number,
        totalCuotas: number,
        deudor: string,
        deudor_id: number,
    };
    public searchCompra: {
        date1: any,
        date2: any
    };
    public dateForGenerateInvoive: string;
    public dataToFilter: {
        clientName: string,
        empleadoName: string,
        venta_menor: string,
        nro_factura: number
    };
    configEmpleados: any = {'placeholder': 'Nombre del Empleado', 'sourceField': ['nombre']};
    // data: AOA = [ [1, 2, 5], [3, 4] ];
    public dataExportVentasMenores: AOA = [];
    public dataExportVentasGenerales: AOA = [];
    // public dataExportVentaMenoresList = [];
    wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
    fileName: string = 'Ventas.xlsx';
    fileNameMenores: string = 'VentasMenores.xlsx';
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _personaService: PersonaService,
        private _ventasService: CompraVentaService,
        private datePipe: DatePipe,
        private _number: DecimalPipe,
        private toastr: ToastrService,
    ) {
        this.titulo = 'Ventas';
        this.currentTab = null;
        this.refreshCompraVenta = false;
        this.inProcess = false;
        this.toggleSeeSales = true; // true = ventas normales : false = ventas menores
        this.persona = new Persona(null, '', '', '', '', '');
        this.ventas = [];
        this.compraVenta = [];
        this.lowerSalesInvoice = [];
        this.detailMinorSales = [];
        this.invoice = {
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
        this.detalles = [];
        this.dataCuotas = [];
        this.dataFactura = new Factura();
        this.total = 0;
        this.totalVentasMenores = 0;
        this.descuento = 0;
        this.totalVentas = 0;
        this.selectedSale = null;
        this.salesInLocalStorage = {
            currentId: 0,
            sales: []
        };
        this.saleForLocalStorage = {
            id: 1,
            persona: new Persona(null, '', '', '', '', ''),
            venta: new CompraVenta()
        };
        this.dataToFilter = {
            clientName: '',
            empleadoName: '',
            venta_menor: '1',
            nro_factura: null,
        };
        this.credito = {
            cambio: 0,
            cuota: null,
            totalPagar: 0,
            totalCuotas: 0,
            deudor: '',
            deudor_id: null
        };
        this.filteredDataForSale = [];
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
            date2 : year + '-' + month + '-' + day
        };
        this.datesToExportSales = {
            date1 : year + '-' + month + '-' + day,
            date2 : year + '-' + month + '-' + day
        };
        this.datesToGetMinorSalesInvoice = {
            date1 : year + '-' + month + '-' + day,
            date2 : year + '-' + month + '-' + day
        };
        this.dateForGenerateInvoive = year + '-' + month + '-' + day;
    }
    ngOnInit() {
        let salesInLocalStorage;
        salesInLocalStorage = JSON.parse(localStorage.getItem('salesInLocalStorage'));
        if (localStorage.getItem('salesInLocalStorage') && salesInLocalStorage.sales) {
            this.salesInLocalStorage = JSON.parse(localStorage.getItem('salesInLocalStorage'));
        } else {
            this.salesInLocalStorage.currentId = 1;
            this.salesInLocalStorage.sales.push(JSON.parse(JSON.stringify(this.saleForLocalStorage)));
        }
        this.selectedSale = this.salesInLocalStorage.sales[0];
        this.currentTab = this.selectedSale.id;
        this.persona  = this.selectedSale.persona;
        this.initialize();
    }
    initialize() {
        this.getVentas();
        this.getEmpleado();
        this.getCreditosVentas();
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
    getVentas() {
        this._ventasService.getVentas(this.searchCompra).subscribe(
            response => {
                let totalVenta, totalDescuento, filtered, totalVentasMenores;
                totalVenta = totalDescuento = 0;
                this.ventas = response.data;
                response.data.forEach( value => {
                    if (!value.nulo && value.factura) {
                        totalVenta += value.total;
                        totalDescuento += value.descuento;
                    }
                });
                /*ventasMenores = response.data.reduce((previous, current) => {
                    /!*if (!previous[current[property]]) {
                        previous[current[property]] = [current];
                    } else {
                        previous[current[property]].push(current);
                    }

                    *!/
                    console.log(previous);
                    console.log(current);
                    return previous;
                }, {});*/
                filtered = this.ventas;
                filtered = filtered.filter(venta => {
                    return venta.factura || venta.venta_menor === 1;
                });
                totalVentasMenores = 0;
                this.detailMinorSales = [];
                filtered.forEach(value => {
                    if (value.venta_menor) {
                        totalVentasMenores += value.total - value.descuento;
                        value.detalle.forEach(_value => {
                            let detail;
                            detail = Object.assign({}, _value);
                            detail.empleado = value.empleado;
                            detail.fecha_hora = value.fecha_hora;
                            detail.nulo = value.nulo;
                            this.detailMinorSales.push(detail);
                        });
                    }
                });
                this.totalVentasMenores = totalVentasMenores;
                this.filteredDataForSale = filtered;
                this.totalVentas = totalVenta - totalDescuento;
            }, errors => {
                console.log(<any>errors);
            }
        );
    }
    setClientAndRefreshClients(event) {
        if (event != null) {
            Object.assign(this.persona, event);
            this.refreshAutocomplete = true;
            setTimeout( () => {
                this.refreshAutocomplete = false;
            }, 1);
            this.storeLocally();
            // this.initialize();
        }
    }
    searchPersona() {
        this._personaService.searchPersonaCi(this.persona.ci).subscribe(
            response => {
                if (response.data && response.data.id) {
                    this.persona = response.data;
                    this.storeLocally();
                } else {
                    this.persona.id = null;
                }
            }, error => {
                console.log(<any>error);
            }
        );
    }
    getSuggestedClient(event) {
        Object.assign( this.selectedSale.persona, event);
        this.storeLocally();
    }
    showCuotas(cuotas) {
        this.dataCuotas = cuotas;
    }
    showFactura(factura) {
        this.dataFactura = factura;
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
        this.getVentas();
    }
    selectedDateForExport(event, numericDate) {
        if (numericDate === 1) {
            if  (new Date(event.target.value).getTime() > new Date(this.datesToExportSales.date2).getTime()) {
                this.datesToExportSales.date1 = event.target.value;
                this.datesToExportSales.date2 = event.target.value;
            } else {
                this.datesToExportSales.date1 = event.target.value;
            }
        } else {
            if  (new Date(event.target.value).getTime() < new Date(this.datesToExportSales.date1).getTime()) {
                this.datesToExportSales.date1 = event.target.value;
                this.datesToExportSales.date2 = event.target.value;
            } else {
                this.datesToExportSales.date2 = event.target.value;
            }
        }
    }
    showDetalles(detalles, total, descuento) {
        this.detalles = detalles;
        this.total = total;
        this.descuento = descuento;
    }
    setEmpleadoId(event) {
        if (event && event.id) {
            this.dataToFilter.empleadoName = event.nombre;
        } else {
            this.dataToFilter.empleadoName = '';
        }
        this.filter();
    }
    setClient(event) {
        this.dataToFilter.clientName = event.nombre;
       if (this.dataToFilter.clientName.length > 0) {
           this.filter();
       }
    }
    setUpdateLowerSalesInvoice(invoice) {
        this.updateLowerSalesInvoice = invoice;
        return false;
    }
    filter() {
        let filtered, totalVenta, totalDescuento, totalVentasMenores;
        totalVenta = totalDescuento = 0;
        filtered = this.ventas;
        if (!this.dataToFilter.nro_factura) {
            if (this.dataToFilter.venta_menor) {
                if (this.dataToFilter.venta_menor === '1') {
                    filtered = this.ventas;
                }
                if (this.dataToFilter.venta_menor === '2') {
                    filtered = filtered.filter(venta => {
                        return venta.venta_menor;
                    });
                }
            }
            if (this.dataToFilter.empleadoName.length > 0) {
                filtered = filtered.filter(venta => {
                    return venta.empleado === this.dataToFilter.empleadoName;
                });
            }
            if (this.dataToFilter.clientName.length > 0) {
                filtered = filtered.filter(venta => {
                    return venta.cliente.nombre === this.dataToFilter.clientName;
                });
            }
        } else {
            filtered = filtered.filter(venta => {
                return venta.factura && venta.factura.nro_factura === this.dataToFilter.nro_factura;
            });
        }
        filtered.forEach(value => {
            if (!value.nulo) {
                totalVenta += value.total;
                totalDescuento += value.descuento;
            }
        });
        totalVentasMenores = 0;
        this.detailMinorSales = [];
        filtered.forEach(value => {
            if (value.venta_menor) {
                totalVentasMenores += value.total - value.descuento;
                value.detalle.forEach(_value => {
                    let detail;
                    detail = Object.assign({}, _value);
                    detail.empleado = value.empleado;
                    detail.fecha_hora = value.fecha_hora;
                    detail.nulo = value.nulo;
                    this.detailMinorSales.push(detail);
                });
            }
        });
        this.totalVentasMenores = totalVentasMenores;
        this.filteredDataForSale = filtered;
        this.totalVentas = totalVenta - totalDescuento;
        // this.totalDescuento = totalDescuento;
    }
    cancelSale() {
        this.refreshCompraVenta = true;
        this._ventasService.cancelSale(this.compraVenta.id).subscribe(
            response => {
                this.refreshCompraVenta = false;
                this.compraVenta.nulo = true;
                /*let formtToExport;
                if (this.compraVenta.factura) {
                    this.compraVenta.factura.nulo = true;
                }
                formtToExport = this.formatToExport(this.filteredDataForSale);
                this.dataExportVentasMenores = formtToExport[0];
                this.dataExportVentasGenerales = formtToExport[1];*/
                this.filter();
                this.toastr.success('Operación Exitosa');
            }, errors => {
                this.toastr.error(JSON.parse(errors._body).errors);
                this.refreshCompraVenta = false;
            }
        );
    }
    cancelInvoice() {
        this.refreshCompraVenta = true;
        this._ventasService.cancelInvoice(this.compraVenta.id).subscribe(
            response => {
                this.compraVenta.factura.nulo = true;
                /*let formtToExport;
                formtToExport = this.formatToExport(this.filteredDataForSale);
                this.dataExportVentasMenores = formtToExport[0];
                this.dataExportVentasGenerales = formtToExport[1];*/
                this.filter();
                this.toastr.success('Operación Exitosa');
            }, errors => {
                this.toastr.error(JSON.parse(errors._body).errors);
            }
        );
    }
    cancelMinorSalesInvoice() {
        this._ventasService.cancelMinorSalesInvoice(this.updateLowerSalesInvoice.id).subscribe(
            response => {
                this.updateLowerSalesInvoice.nulo = 1;
                this.updateLowerSalesInvoice.nulo = 1;
                this.toastr.success('Operación Exitosa');
            }, errors => {
                this.toastr.error(JSON.parse(errors._body).errors);
            }
        );
    }
    addInvoice() {
        this.dataFactura.id_compra_venta = this.compraVenta.id;
        this._ventasService.addInvoice(this.dataFactura).subscribe(
            response => {
                // let formtToExport;
                this.compraVenta.factura = response.data;
                /*formtToExport = this.formatToExport(this.filteredDataForSale);
                this.dataExportVentasMenores = formtToExport[0];
                this.dataExportVentasGenerales = formtToExport[1];
                this.filter();*/
                this.dataFactura = new Factura();
                this.toastr.success('Operación Exitosa');
            }, errors => {
                this.toastr.error(JSON.parse(errors._body).errors);
            }
        );
    }
    getVentaCompra(venta) {
        this.compraVenta = venta;
        this.dataFactura = new Factura();
    }
    printerCompraVenta(compraVenta) {
        this.invoice = Object.assign({}, compraVenta);
        return false;
    }

    formatToExport(response) {
        let ventasFacturadas, date;
        ventasFacturadas = Array([
            'NIT',
            'Nombre',
            'Nro. Factura',
            'Autorizacion',
            'Fecha',
            'Monto',
            'Descuento',
            'Total Neto',
            'Debito',
            'Validez',
            'Cod. Control']
        );
        response.data.forEach( value => {
            date = this.datePipe.transform(value.fecha_hora, 'dd/MM/yyyy');
            ventasFacturadas.push([
                value.cliente.ci,
                value.cliente.nombre,
                value.nro_factura,
                value.nro_autorizacion,
                date,
                value.total,
                value.descuento,
                value.total - value.descuento,
                (value.total - value.descuento) * 0.13,
                value.nulo ? 'NV' : 'V',
                value.codigo_control,
            ]);
        });
        response.lowerSalesInvoice.forEach( value => {
            date = this.datePipe.transform(value.fecha, 'dd/MM/yyyy');
            ventasFacturadas.push([
                value.cliente.ci,
                value.cliente.nombre,
                value.nro_factura,
                value.nro_autorizacion,
                date,
                value.total,
                value.descuento,
                value.total - value.descuento,
                (value.total - value.descuento) * 0.13,
                value.nulo ? 'NV' : 'V',
                value.codigo_control,
            ]);
        });
        return ventasFacturadas;
    }
    setPersonaDeudor(event) {
        this.credito.cambio = 0;
        if (event.id != null) {
            this.credito.deudor_id = event.id;
            this.credito.deudor = event.nombre;
            this.getCreditosVentas();
        } else {
            this.credito.deudor_id = null;
            this.credito.deudor = '';
        }
    }
    getCreditosVentas() {
        this._ventasService.getCreditosVentas().subscribe(
            response => {
                this.credito.totalPagar = 0;
                let cuotas;
                if (this.credito.deudor_id === null) {
                    this.creditos = response.data;
                } else {
                    this.creditos = response.data.filter(credito => {
                        return credito.cliente.id === this.credito.deudor_id;
                    });
                }
                this.creditos.forEach( credito => {
                    cuotas = 0;
                    credito.pagos.forEach( pago => {
                        cuotas += pago.cuota;
                    });
                    credito.cuotas = cuotas;
                    this.credito.totalCuotas += cuotas;
                    this.credito.totalPagar = this.credito.totalPagar + ( credito.total - credito.descuento - cuotas);
                });
            }, errors => {
                console.log(<any>errors);
                let json;
                json = JSON.parse(errors._body);
                this.toastr.error(json.errors);
            }
        );
    }
    submitPago() {
        if (!this.inProcess) {
            this.inProcess = true;
            this._ventasService.registerPagoDeudor({cuota: this.credito.cuota, deudor_id: this.credito.deudor_id}).subscribe(
                response => {
                    this.credito.cambio = response.cambio;
                    this.credito.cuota = null;
                    this.getCreditosVentas();
                    this.inProcess = false;
                }, errors => {
                    console.log(<any>errors);
                    let json;
                    json = JSON.parse(errors._body);
                    this.toastr.error(json.errors);
                    this.inProcess = false;
                }
            );
        }
    }
    onClickGetCredits() {
        this.credito.deudor_id = null;
        this.getCreditosVentas();
        this.refreshAutocomplete = true;
        setTimeout( () => {
            this.refreshAutocomplete = false;
        }, 1);
    }
    expotVentas() {
        this._ventasService.getVentasExport(this.datesToExportSales).subscribe(
            response => {
                console.log(response);
                let formtToExport;
                formtToExport = this.formatToExport(response);
                /* generate worksheet */
                const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(formtToExport);

                /* generate workbook and add the worksheet */
                const wb: XLSX.WorkBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Ventas Generales');

                /* save to file */
                XLSX.writeFile(wb, this.fileName);
            }, errors => {
                console.log(errors);
            }
        );
    }
    expotVentasMenores() {
        this._ventasService.getVentasMenoresExport(this.datesToExportSales).subscribe(
            response => {
                let ventasMenores, /*date, monto, ventasMenoresPorDia,*/
                    fecha, /*ventasMenoresFormatted,*/ workSheet: XLSX.WorkSheet, workBook: XLSX.WorkBook;
                // Ventas menores por dia total de dia
                // ventasMenoresPorDia = [];
                workBook = XLSX.utils.book_new();
                /*ventasMenoresFormatted = Array(['Nombre'], ['Nit'], ['Autorizacion'],
                    ['Fecha', 'Nro. Factura',  'Nombre', 'Monto']);
                response.forEach( value => {
                    date = this.datePipe.transform(value.fecha, 'dd/MM/yyyy');
                    if (ventasMenoresPorDia[date]) {
                        ventasMenoresPorDia[date].push(value);
                    } else {
                        ventasMenoresPorDia[date] = [];
                        ventasMenoresPorDia[date].push(value);
                    }
                });
                Object.keys(ventasMenoresPorDia).forEach( key => {
                    monto = 0;
                    ventasMenoresPorDia[key].forEach( value => {
                        monto = monto + value.total - value.descuento;
                    });
                    ventasMenoresFormatted.push([key, '', 'ventas menores', monto]);
                });*/
                // Ventas menores realizadas mas detalle
                /*workSheet = XLSX.utils.aoa_to_sheet(ventasMenoresFormatted);
                XLSX.utils.book_append_sheet(workBook, workSheet, 'Ventas Menores');*/
                fecha = null;
                ventasMenores = [];
                ventasMenores = Array([
                        'Detalle',
                        'Precio Unitario',
                        'Cantidad',
                        'Total',
                    ]
                );
                response.forEach( value => {
                    if (!fecha) {
                        fecha = value.fecha;
                        ventasMenores.push(['', '', '', '', 'descuento', value.descuento]);
                        value.detalle.forEach( detalle => {
                            ventasMenores.push([
                                detalle.descripcion,
                                detalle.precio_unitario,
                                detalle.cantidad_producto,
                                parseFloat((detalle.precio_unitario * detalle.cantidad_producto).toFixed(2))
                            ]);
                        });
                    } else {
                        if (fecha === value.fecha) {
                            ventasMenores.push(['', '', '', '', 'descuento', value.descuento]);
                            value.detalle.forEach( detalle => {
                                ventasMenores.push([
                                    detalle.descripcion,
                                    detalle.precio_unitario,
                                    detalle.cantidad_producto,
                                    parseFloat((detalle.precio_unitario * detalle.cantidad_producto).toFixed(2))
                                ]);
                            });
                        } else {
                            workSheet = XLSX.utils.aoa_to_sheet(ventasMenores);
                            XLSX.utils.book_append_sheet(workBook, workSheet, fecha);
                            fecha = value.fecha;
                            ventasMenores = new Array([
                                    'Detalle',
                                    'Precio Unitario',
                                    'Cantidad',
                                    'Total',
                                ]
                            );
                            ventasMenores.push(['', '', '', '', 'descuento', value.descuento]);
                            value.detalle.forEach( detalle => {
                                ventasMenores.push([
                                    detalle.descripcion,
                                    detalle.precio_unitario,
                                    detalle.cantidad_producto,
                                    parseFloat((detalle.precio_unitario * detalle.cantidad_producto).toFixed(2))
                                ]);
                            });
                        }
                    }
                });
                workSheet = XLSX.utils.aoa_to_sheet(ventasMenores);
                XLSX.utils.book_append_sheet(workBook, workSheet, fecha);
                XLSX.writeFile(workBook, this.fileNameMenores);
            }, errors => {
                console.log(errors);
            }
        );
    }
    export(): void {
        /* generate worksheet */
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.dataExportVentasGenerales);
        const ws2: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.dataExportVentasMenores);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Ventas Generales');
        XLSX.utils.book_append_sheet(wb, ws2, 'Ventas Menores');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }
    generateLowerSalesInvoice() {
        this._ventasService.generateLowerSalesInvoice(this.dateForGenerateInvoive).subscribe(
            response => {
                this.toastr.success('Operación Exitosa');
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
    getLowerSalesInvoice() {
        this._ventasService.getLowerSalesInvoice(this.datesToGetMinorSalesInvoice).subscribe(
            response => {
                this.lowerSalesInvoice = response.data;
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
    getDetailOfLowerSales(idFactura) {
        this._ventasService.getDetailOfLowerSales(idFactura).subscribe(
            response => {
                this.detailOfLowerSales = response.data;
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
        return false;
    }
    selectDateMinorSalesInvoice(event, numericDate) {
        if (numericDate === 1) {
            if  (new Date(event.target.value).getTime() > new Date(this.datesToGetMinorSalesInvoice.date2).getTime()) {
                this.datesToGetMinorSalesInvoice.date1 = event.target.value;
                this.datesToGetMinorSalesInvoice.date2 = event.target.value;
            } else {
                this.datesToGetMinorSalesInvoice.date1 = event.target.value;
            }
        } else {
            if  (new Date(event.target.value).getTime() < new Date(this.datesToGetMinorSalesInvoice.date1).getTime()) {
                this.datesToGetMinorSalesInvoice.date1 = event.target.value;
                this.datesToGetMinorSalesInvoice.date2 = event.target.value;
            } else {
                this.datesToGetMinorSalesInvoice.date2 = event.target.value;
            }
        }
    }
    printlowerSalesInvoice(factura) {
        this._ventasService.getDetailOfLowerSales(factura.id).subscribe(
            response => {
                let compraVentaDia;
                compraVentaDia = {
                    cliente: {
                        ci: '0',
                        id: null,
                        nombre : 'VENTAS MENORES',
                    },
                    total: factura.total,
                    descuento: factura.descuento,
                    detalle: response.data,
                    efectivo: factura.total - factura.descuento,
                    fecha_hora: factura.fecha + ' 23:59:59',
                    factura: {
                        nro_factura: factura.nro_factura,
                        nro_autorizacion: factura.nro_autorizacion,
                        nulo: 0,
                        codigo_control: factura.codigo_control
                    }
                };
                this.printerCompraVenta(compraVentaDia);
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
        return false;
    }
    storeLocally() {
        localStorage.setItem('salesInLocalStorage', JSON.stringify(this.salesInLocalStorage));
    }
    selectSale(sale) {
        event.stopPropagation();
        this.selectedSale = sale;
        this.currentTab = sale.id;
        this.persona = this.selectedSale.persona;
        return false;
    }
    newTab() {
        let newSaleForLocalStorage;
        newSaleForLocalStorage = JSON.parse(JSON.stringify(this.saleForLocalStorage));
        newSaleForLocalStorage.id = ++this.salesInLocalStorage.currentId ;
        this.salesInLocalStorage.sales.push(newSaleForLocalStorage);
        this.selectedSale = this.salesInLocalStorage.sales[this.salesInLocalStorage.sales.length - 1];
        this.currentTab = this.selectedSale.id;
        this.persona = this.selectedSale.persona;
        this.storeLocally();
        return false;
    }
    closeTab(index) {
        let sale;
        sale = this.salesInLocalStorage.sales.splice(index, 1);
        if (this.salesInLocalStorage.sales.length < 1) {
            this.salesInLocalStorage.currentId = 1;
            this.salesInLocalStorage.sales.push(JSON.parse(JSON.stringify(this.saleForLocalStorage)));
            this.selectedSale = this.salesInLocalStorage.sales[0];
            this.currentTab = this.selectedSale.id;
            this.persona = this.selectedSale.persona;
        } else if (sale[0].id === this.selectedSale.id) {
            if (this.salesInLocalStorage.sales.length === index && index > 0) {
                this.selectedSale = this.salesInLocalStorage.sales[index - 1];
            } else {
                this.selectedSale = this.salesInLocalStorage.sales[index];
            }
            this.currentTab = this.selectedSale.id;
            this.persona = this.selectedSale.persona;
        }
        this.storeLocally();
        return false;
    }
    printVenta(venta) {
        this.invoice = venta;
        let persona;
        persona = new Persona(null, '', '', '', '', '');
        Object.assign(this.persona, persona);
        this.storeLocally();
    }
}
