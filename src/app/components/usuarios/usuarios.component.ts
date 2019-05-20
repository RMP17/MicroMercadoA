import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { Cuenta } from '../../models/cuenta';
import { Persona } from '../../models/persona';

// import * as process from 'process';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'usuarios',
    templateUrl: '../../views/usuarios/usuarios.html',
    providers: [PersonaService]
})

export class UsuarioComponent implements OnInit {
    public titulo: string;
    public modeCreate: boolean;
    public modeEdit: boolean;
    public createModeCaja: boolean;
    public editModeCaja: boolean;
    public cuentas: Cuenta[];
    public cuenta: Cuenta;
    public empleados: Persona[];
    public editCuenta: Cuenta;
    public dataToDelete: any;
    public sessions: any;
    public sessionsFilterText: string;
    public dates: {
        date1: any,
        date2: any
    };
    configEmpleados: any = {'placeholder': 'Nombre del Empleado', 'sourceField': ['nombre']};
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _personaService: PersonaService,
        private toastr: ToastrService,
    ) {
        this.titulo = 'Usuarios';
        this.modeCreate = false;
        this.dataToDelete = {
            id: null,
            data: ''
        };
        this.modeEdit = false;
        this.cuenta = new Cuenta(null, '', '', '', true, {option1: true, option2: true}, true);
        this.sessions = [];
        this.sessionsFilterText = '';
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
        this.dates = {
            date1 : year + '-' + month + '-' + day,
            date2 : year + '-' + month + '-' + day
        };
    }
    ngOnInit() {
        this.getSessions();
        this.getEmpleado();
        this._personaService.getCuentas().subscribe(
            result => {
                if (result.status != 200) {
                    console.log(result);
                } else {
                    this.cuentas = result.data;
                }
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
    getEmpleado() {
        this._personaService.getEmpleados().subscribe(
            response => {
                this.empleados = response.data;
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
    checkboxChange(tag) {
        if (tag == 'p1') {
            this.editCuenta.permisos.option1 = !this.editCuenta.permisos.option1;
            return;
        }
        if (tag == 'p2') {
            this.editCuenta.permisos.option2 = !this.editCuenta.permisos.option2;
            return ;
        }
    }
    setModeEdit(cuenta) {
        this.modeEdit = true;
        this.editCuenta = cuenta;
        this.editCuenta.permisos.option1 = this.editCuenta.permisos.option1 ? this.editCuenta.permisos.option1 : null;
        this.editCuenta.permisos.option2 = this.editCuenta.permisos.option2 ? this.editCuenta.permisos.option2 : null;
        return false;
    }
    cancelModeEdit() {
        this.modeEdit = false;
        this.editCuenta = new Cuenta(null, '', '', '', true, {option1: true, option2: true}, true);
    }
    setIdCuenta(event) {
        if (event && event.id) {
            this.cuenta.id_persona = event.id;
        }
    }
    setDataToDelete(id, data) {
        this.dataToDelete.id = id;
        this.dataToDelete.data = data;
        return false;
    }
    deleteData() {
        if (this.dataToDelete.data === 'cuenta') {
            this._personaService.deleteCuenta(this.dataToDelete.id).subscribe(
                response => {
                    if (response.status != 200) {
                        console.log(response);
                    } else {
                        this.toastr.success('Operación Exitosa');
                        let index = this.cuentas.findIndex((cuenta) => { return cuenta.id_persona == this.dataToDelete.id ;});
                        this.cuentas.splice(index, 1);
                        this.dataToDelete = {
                            id: null,
                            data: ''
                        };
                    }
                }, error => {
                    console.log(<any>error);
                    this.toastr.error('Error');
                }
            );
        }
    }
    onSubmit() {
        this._personaService.addCuenta(this.cuenta).subscribe(
            response => {
                this.toastr.success('Operación Exitosa');
                this.ngOnInit();
                this.cuenta = new Cuenta(null, '', '', '', true, {option1: true, option2: true}, true);
            },
            errors => {
                /*let messageError;
                if (errors.status === 511) {
                    messageError = errors;
                } else {
                    messageError = errors;
                }*/
                this.toastr.error(errors.error);
                console.log(<any>errors);
            }
        );
    }
    onSubmitEdit() {
        // this._personaService.addCuenta().subscribe();
        this._personaService.editCuenta(this.editCuenta.id_persona, this.editCuenta).subscribe(
            response => {
                this.modeEdit = false;
                this.toastr.success('Operación Exitosa');
                this.ngOnInit();
                this.cuenta = new Cuenta(null, '', '', '', true, {option1: true, option2: true}, true);
            },
            errors => {
                this.toastr.error(errors.error);
                console.log(<any>errors);
            }
        );
    }
    clean() {
        event.preventDefault();
        this.cuenta = new Cuenta(null, '', '', '', true, {option1: true, option2: true}, true);
    }
    selectedDate(event, numericDate) {
        if (numericDate === 1) {
            if  (new Date(event.target.value).getTime() > new Date(this.dates.date2).getTime()) {
                this.dates.date1 = event.target.value;
                this.dates.date2 = event.target.value;
            } else {
                this.dates.date1 = event.target.value;
            }
        } else {
            if  (new Date(event.target.value).getTime() < new Date(this.dates.date1).getTime()) {
                this.dates.date1 = event.target.value;
                this.dates.date2 = event.target.value;
            } else {
                this.dates.date2 = event.target.value;
            }
        }
        this.getSessions();
    }
    selectedEmpleado(event) {
        if (event && event.id) {
            this.sessionsFilterText = event.nombre;
        } else {
            this.sessionsFilterText = '';
        }
    }
    getSessions() {
        this._personaService.getSessions(this.dates).subscribe(
            response => {
                this.sessions = response.data;
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
