import { Component, ViewChild, ElementRef,Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona';
// import * as process from 'process';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-proveedores',
    templateUrl: '../../views/proveedores/proveedores.html',
    providers: [PersonaService]
})

export class ProveedorComponent implements OnInit{
    // @ViewChild('inputNombre') inputEl: ElementRef;
    public titulo: string;
    public modeCreate: boolean;
    public modeEdit: boolean;
    public personas: Persona[];
    public persona: Persona;
    @Output() registerEmitter = new EventEmitter();

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _personaService: PersonaService,
        private toastr: ToastrService,
    // import * as process from 'process'
    ) {
        this.titulo = 'Proveedores';
        this.modeCreate = false;
        this.modeEdit = false;
        this.persona = new Persona(null, '', '', '', '', '');
    }
    ngOnInit() {
        this._personaService.getProveedores().subscribe(
            result => {
                this.personas = result.data;
            },
            error => {
                console.log(<any>error);
            }
        );
    }
    setModeCreate() {
        this.modeCreate = !this.modeCreate;
        // this.persona = new Persona('', '', '', '', '', '', '', '');
    }
    setModeEdit(persona: Persona) {
        this.modeEdit = !this.modeEdit;
        this.modeCreate = !this.modeCreate;
        this.persona = persona;
    }
    cancelModeEdit() {
        this.modeEdit = false;
        this.modeCreate = false;
        this.persona = new Persona(null, '', '', '', '', '');
    }
    onSubmit() {
        if (this.modeEdit) {
            this.persona = new Persona(null, '', '', '', '', '');
            this.ngOnInit();
            this.registerEmitter.emit();
            this.modeEdit = false;
            this.modeCreate = false;
        } else {
            this.registerEmitter.emit();
            this.persona = new Persona(null, '', '', '', '', '');
            this.ngOnInit();
        }
    }
}
