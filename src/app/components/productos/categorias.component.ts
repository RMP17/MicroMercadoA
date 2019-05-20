import { Component, ViewChild, ElementRef, Output, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria';
import * as process from 'process';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'categorias',
    templateUrl: '../../views/productos/categorias.html',
    providers: [CategoriaService]
})

export class CategoriasComponent implements OnInit{
    @ViewChild('inputDescripcion') inputEl: ElementRef;
    public titulo: string;
    public modeCreate: boolean;
    public modeEdit: boolean;
    public categorias: Categoria[];
    public categoria: Categoria;
    public process: any;
    @Output() categoriasEmitter = new EventEmitter();

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _categoriaService: CategoriaService,
        private toastr: ToastrService,
    ) {
        this.titulo = 'Categorías';
        this.modeCreate = false;
        this.modeEdit = false;
        this.categoria = new Categoria('', '');
    }
    ngOnInit() {
        this._categoriaService.getCategorias().subscribe(
            result => {
                if (result.status != 200) {
                    console.log(result);
                } else {
                    this.categorias = result.data;
                    this.categoriasEmitter.emit(result.data);
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }
    setModeCreate() {
        this.modeCreate = !this.modeCreate;
        this.categoria = new Categoria('', '');
    }
    setModeEdit(categoria: Categoria) {
        this.modeEdit = !this.modeEdit;
        this.modeCreate = !this.modeCreate;
        this.categoria = categoria;
        process.nextTick( () => {this.inputEl.nativeElement.focus(); });
    }
    cancelModeEdit() {
        this.modeEdit = false;
        this.modeCreate = false;
    }
    onSubmit() {
        if (!this.categoria.id) {
            this.inputEl.nativeElement.focus();
            this._categoriaService.addCategoria(this.categoria).subscribe(
                response => {
                    this.ngOnInit();
                    this.categoria = new Categoria('', '');
                    this.toastr.success('Operación Exitosa');
                },
                error => {
                    console.log(<any>error);
                    this.toastr.error('Error');
                }
            );
        } else {
            this._categoriaService.updateCategoria(this.categoria['id'], this.categoria).subscribe(
                response => {
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