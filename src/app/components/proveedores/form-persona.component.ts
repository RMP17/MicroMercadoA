import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {PersonaService} from '../../services/persona.service';
import {Persona} from '../../models/persona';
// import * as process from 'process';
import {ToastrService} from 'ngx-toastr';


@Component({
    selector: 'form-persona',
    providers: [PersonaService],
    templateUrl: '../../views/proveedores/form-persona.html'

})

export class FormPersonaComponent implements  OnInit {
    @Input() rol: string; // personal=p; proveedor=r; cliente=c
    _persona: Persona;
    @Input() set persona(persona: Persona) {
        this._persona = (persona) || new Persona(null, '', '', '', '', this.rol);
    }

    @Input() modeEdit;
    @Input() modeCreate;
    public existPersona: {
        exist: boolean,
        id: string,
        nombre: string
    };
    @Output() personaIdEmitter = new EventEmitter();
    @Output() onSubmitEmitter = new EventEmitter();

    constructor(private _route: ActivatedRoute,
                private _router: Router,
                private _personaService: PersonaService,
                private toastr: ToastrService
    ) {
        this.rol = '';
        this.modeEdit = false;
        this.existPersona = {
            exist: false,
            id: '',
            nombre: ''
        };
        this._persona = new Persona(null, '', '', '', '', this.rol);
    }

    ngOnInit() {
        // this.persona = new Persona('','','','','','','',this.rol);
    }
    getIdPersonaPromise() {
        return new Promise((resolve, reject) => {
            if (!this.modeEdit) {
                this._personaService.searchPersonaCi(this._persona.ci).subscribe(
                    response => {
                        if (response.data) {
                            this.existPersona.exist = true;
                            this.existPersona.nombre = response.data.nombre;
                            this.existPersona.id = response.data.id;
                            this.personaIdEmitter.emit(response.data);
                            resolve(response.data);
                        } else {
                            this._persona.id = null;
                            this.existPersona.exist = false;
                            this.existPersona.nombre = '';
                            this.existPersona.id = '';
                            this.personaIdEmitter.emit(null);
                            resolve('');
                        }
                    },
                    error => {
                        console.log(<any>error);
                        reject('');
                    }
                );
            }
        }); /*.then(
            (data) => { console.log(data); },
            (err) => { console.log(err); }
        );*/
    }
    async contratar(event) {
        try {
            await this.getIdPersonaPromise();
            event.preventDefault();
            this._personaService.contratar(this.existPersona.id).subscribe(
                response => {
                    // this.personaIdEmitter.emit(this.existPersona.id);
                    this._persona.ci = '';
                    this.existPersona.exist = false;
                    this.existPersona.nombre = '';
                    this.existPersona.id = '';
                    this.toastr.success('Operación Exitosa');
                },
                error => {
                    console.log(<any>error);
                }
            );

        } catch (err) {
            console.log(err);
        }
    }

    reset() {
        this.existPersona.exist = false;
        this._persona = new Persona(null, '', '', '', '', this.rol);
    }

    cancelModeEdit() {
        this.onSubmitEmitter.emit();
        // this.marca = new Marca('','');
    }

    onSubmit() {
        this._persona.rol = this.rol;
        if (!this._persona.id) {
            this._personaService.addPersona(this._persona).subscribe(
                response => {
                    this.toastr.success('Operación Exitosa');
                    this.onSubmitEmitter.emit();
                    this.existPersona.exist = false;
                    this.existPersona.nombre = '';
                    this.existPersona.id = '';
                    // this.ngOnInit();
                    this._persona = new Persona(null, '', '', '', '', this.rol);
                    this.personaIdEmitter.emit(response);
                },
                error => {
                    console.log(<any>error);
                    this.toastr.error('Error');
                }
            );
        } else {
            this._personaService.updatePersona(this._persona.id, this._persona).subscribe(
                response => {
                    this.toastr.success('Operación Exitosa');
                    this.onSubmitEmitter.emit();
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
}
