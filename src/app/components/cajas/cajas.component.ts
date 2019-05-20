import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { CajaService } from '../../services/caja.service';
import { Caja } from '../../models/caja';
import { MovementPipe } from '../../pipes/movements.pipe';
import { FilterByPipe } from '../../pipes/filter-by.pipe';

// import * as process from 'process';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-cajas',
    templateUrl: '../../views/cajas/cajas.html',
    providers: [PersonaService, CajaService, MovementPipe, FilterByPipe],
    // pipes: [MovementPipe]
})

export class CajasComponent implements OnInit {
    public modeCreate: boolean;
    public modeEdit: boolean;
    public createModeCaja: boolean;
    public editModeCaja: boolean;
    public caja: Caja;
    public cajas: Caja[];
    public selectCaja;
    public cajaSelected;
    public cajaSelectedForCasjClosing;
    public dataToDelete: any;
    public cashClosing: any;
    public movimiento: {
        descripcion: string,
        empleado: string,
        monto: number,
        fecha_hora: string,
        tipo: string
    };
    public movimientos;
    public monto: number;
    public efectivo: number;
    public inProcess = false;
    public searchMovement: {
        date1: any,
        date2: any
    };
    public searchCashClosing: {
        date1: any,
        date2: any
    };
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _personaService: PersonaService,
        private _cajaService: CajaService,
        private toastr: ToastrService,
    ) {
        this.modeCreate = false;
        this.dataToDelete = {
            id: null,
            data: ''
        };
        this.selectCaja = [];
        this.cashClosing = [];
        this.cajaSelected = '';
        this.cajaSelectedForCasjClosing = '';
        this.movimiento = {
            descripcion: '',
            empleado: '',
            monto: null,
            fecha_hora: '',
            tipo: ''
        };
        this.movimientos = [];
        this.modeEdit = false;
        this.efectivo = 0;
        this.caja = new Caja();
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
        this.searchMovement = {
            date1 : year + '-' + month + '-' + day,
            date2 : year + '-' + month + '-' + day
        };
        this.searchCashClosing = {
            date1 : year + '-' + month + '-' + day,
            date2 : year + '-' + month + '-' + day
        };
        // this.editCuenta = new Cuenta('', '', '', '', true, {option1: true, option2: true}, true);
    }
    ngOnInit() {
        this.getAllCajas();
        this.getEfectivo();
        this.getMovimientos();
        this.getCashClosing();
    }
    getAllCajas() {
        this._cajaService.getAllCajas().subscribe(
            response => {
                this.cajas = response.data;
            }, errors => {
                console.log(<any>errors);
            }
        );
    }
    getEfectivo() {
        this._cajaService.getEfectivo().subscribe(
            response => {
                this.efectivo = response;
            }, errors => {
                this.toastr.error(errors.error);
                console.log(<any>errors);
            }
        );
    }
    getMovimientos() {
        this._cajaService.getMovements(this.searchMovement).subscribe(
            response => {
                this.selectCaja = [];
                this.movimientos = [];
                response.data.forEach(
                    data => {
                        this.selectCaja.push(data.descripcion);
                        data.movimientos.forEach(
                            movimiento => {
                                this.movimiento.descripcion = data.descripcion;
                                this.movimiento.empleado = movimiento.empleado;
                                this.movimiento.monto = movimiento.monto;
                                this.movimiento.fecha_hora = movimiento.fecha_hora;
                                this.movimiento.tipo = movimiento.tipo;
                                this.movimientos.push( Object.assign({}, this.movimiento));
                            }
                        );
                    }
                );
                this.movimientos = this.movimientos.sort(function(a, b) {
                    let c: any, d: any;
                    c = new Date(a.fecha_hora);
                    d = new Date(b.fecha_hora);
                    return c - d;
                });
            }, errors => {
                console.log(<any>errors);
            }
        );
    }
    setModeCreate() {
        this.modeCreate = !this.modeCreate;
    }
    setCreateModeOfCaja() {
        this.createModeCaja = !this.createModeCaja;
    }
    setEditModeOfCaja(caja) {
        this.caja = new Caja();
        this.editModeCaja = true;
        this.createModeCaja = true;
        this.caja = caja;
    }
    cancelModeEdit() {
        this.modeEdit = false;
    }
    setDataToDelete(id, data) {
        this.dataToDelete.id = id;
        this.dataToDelete.data = data;
    }
    deleteData() {
        if (this.dataToDelete.data === 'caja') {
            this._cajaService.deleteCaja(this.dataToDelete.id).subscribe(
                response => {
                    if (response.status !== 200) {
                        console.log(response);
                    } else {
                        this.toastr.success('Operación Exitosa');
                        let index;
                        index = this.cajas.findIndex(
                            caja => {
                                return caja.id === this.dataToDelete.id ;
                            }
                        );
                        this.cajas.splice(index, 1);
                        this.dataToDelete = {
                            id: null,
                            data: ''
                        };
                    }
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
    }
    cleanCaja() {
        this.caja = new Caja();
    }
    cancel() {
        this.caja = new Caja();
        this.editModeCaja = false;
        this.createModeCaja = false;
    }
    sendBoxData() {
        if (this.caja.id) {
            this._cajaService.updateCaja(this.caja.id, this.caja).subscribe(
                response => {
                    this.toastr.success('Operación Exitosa');
                    this.caja = new Caja();
                    this.editModeCaja = false;
                    this.createModeCaja = false;
                    this.getAllCajas();
                },
                errors => {
                    if (errors.status === 511) {
                        this.toastr.error(errors.error);
                    } else {
                        console.log(<any>errors);
                    }
                }
            );
        } else {
            this._cajaService.storeBoxData(this.caja).subscribe(
                response => {
                    this.toastr.success('Operación Exitosa');
                    this.getAllCajas();
                    this.caja = new Caja();
                    this.getAllCajas();
                },
                errors => {
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
    }
    /*
    Tipo
    d = deposito; r = retiro
    */
    sendMovement(tipo) {
        if (!this.inProcess) {
            this.inProcess = true;
            this._cajaService.saveMovement({ monto: this.monto, tipo: tipo }).subscribe(
                response => {
                    console.log(response);
                    this.inProcess = false;
                    this.monto = null;
                    this.toastr.success('Operación Exitosa');
                    this.efectivo = response;
                    this.getMovimientos();
                }, errors => {
                    this.inProcess = false;
                    let json = JSON.parse(errors._body);
                    this.toastr.error(json.errors);
                }
            );
        }
    }
    selectedDate(event, numericDate) {
        if (numericDate === 1) {
            if  (new Date(event.target.value).getTime() > new Date(this.searchMovement.date2).getTime()) {
                this.searchMovement.date1 = event.target.value;
                this.searchMovement.date2 = event.target.value;
            } else {
                this.searchMovement.date1 = event.target.value;
            }
        } else {
            if  (new Date(event.target.value).getTime() < new Date(this.searchMovement.date1).getTime()) {
                this.searchMovement.date1 = event.target.value;
                this.searchMovement.date2 = event.target.value;
            } else {
                this.searchMovement.date2 = event.target.value;
            }
        }
        this.getMovimientos();
    }
    selectedDate2(event, numericDate) {
        if (numericDate === 1) {
            if  (new Date(event.target.value).getTime() > new Date(this.searchMovement.date2).getTime()) {
                this.searchCashClosing.date1 = event.target.value;
                this.searchCashClosing.date2 = event.target.value;
            } else {
                this.searchCashClosing.date1 = event.target.value;
            }
        } else {
            if  (new Date(event.target.value).getTime() < new Date(this.searchMovement.date1).getTime()) {
                this.searchCashClosing.date1 = event.target.value;
                this.searchCashClosing.date2 = event.target.value;
            } else {
                this.searchCashClosing.date2 = event.target.value;
            }
        }
        this.getCashClosing();
    }
    setCajaSelected(event) {
        this.cajaSelected = event.target.value;
    }
    setCajaSelectedForCasjClosing(event) {
        this.cajaSelectedForCasjClosing = event.target.value;
    }
    closeBox() {
        this.inProcess = true;
        this._cajaService.storeCashClosing().subscribe(
            response => {
                this.inProcess = false;
                this.getCashClosing();
            }, errors => {
                console.log(errors);
                this.inProcess = false;
            }
        );
    }
    getCashClosing() {
        this._cajaService.getCashClosing(this.searchCashClosing).subscribe(
            response => {
                this.cashClosing = response;
            }, errors => {
                console.log(errors);
            }
        );
    }
}


