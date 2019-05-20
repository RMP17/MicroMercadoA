import { Component, ViewChild, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MarcaService } from '../../services/marca.service';
import { Marca } from '../../models/marca';
import * as process from 'process';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'marcas',
    templateUrl: '../../views/productos/marcas.html',
    providers: [MarcaService]
})

export class MarcasComponent implements OnInit{
    @ViewChild('inputNombre') inputEl: ElementRef;
    public titulo: string;
    public modeCreate: boolean;
    public modeEdit: boolean;
    public marcas: Marca[];
    public marca: Marca;
    private process: any;
    @Output() marcasEmitter = new EventEmitter();
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _marcaService: MarcaService,
        private toastr: ToastrService,
    // import * as process from 'process'
    ) {
        this.titulo = 'Marcas';
        this.modeCreate = false;
        this.modeEdit = false;
        this.marca = new Marca('', '');
    }
    ngOnInit() {
        this._marcaService.getMarcas().subscribe(
            result => {
                if (result.status != 200) {
                    console.log(result);
                } else {
                    this.marcas = result.data;
                    this.marcasEmitter.emit(result.data);
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }
    setModeCreate() {
        this.modeCreate = !this.modeCreate;
        this.marca=new Marca('', '');
    }
    setModeEdit(marca: Marca) {
        this.modeEdit = !this.modeEdit;
        this.modeCreate = !this.modeCreate;
        this.marca = marca;
        process.nextTick( () => {this.inputEl.nativeElement.focus();} );
    }
    cancelModeEdit() {
        this.modeEdit = false;
        this.modeCreate = false;
        // this.marca = new Marca('','');
    }
    onSubmit() {
        // console.log(this.marca);
        if (!this.marca.id) {
            this.inputEl.nativeElement.focus();
            this._marcaService.addMarca(this.marca).subscribe(
                response => {
                    this.ngOnInit();
                    this.marca = new Marca('', '');
                    this.toastr.success('Operación Exitosa');
                }, error => {
                    console.log(<any>error);
                    this.toastr.error('Error');
                }
            );
        } else {
            this._marcaService.updateMarca(this.marca['id'], this.marca).subscribe(
                response => {
                    console.log(response);
                    this.toastr.success('Operación Exitosa');
                    this.modeEdit = false;
                    this.modeCreate = false;
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