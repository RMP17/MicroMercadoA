import { Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona';
import { ConfiguracionService } from '../../services/configuracion.service';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { Configuration} from '../../models/configuration';
import {isBoolean} from 'util';

@Component({
    selector: 'app-factura',
    templateUrl: '../../views/compras-ventas/factura.html',
    providers: [PersonaService, ConfiguracionService, DatePipe, DecimalPipe]
})


export class FacturaComponent implements OnChanges {
    @Input() invoice: any;
    public persona: Persona;
    public personas: Persona[];
    public configuracion: any;
    public dataForQr: string;
    @Output() OnFinalize = new EventEmitter();
    constructor(
        private _configuracionService: ConfiguracionService,
        private datePipe: DatePipe,
        private _number: DecimalPipe
    ) {
        this.persona = new Persona(null, '', '', '', '', '');
        this.configuracion = new Configuration;
        this.dataForQr = ' ';
    }
    async ngOnChanges() {
        if (this.invoice.total && this.invoice.factura) {
            this.configuracion = await this.getConfiguracion();
            this.printInvoice();
        }
    }
    getConfiguracion() {
        let promise;
        promise = new Promise((resolve, reject) => {
            this._configuracionService.getConfiguracion().subscribe(
                response => {
                    resolve(response);
                }, error => {
                    reject(new Configuration());
                }
            );
        });
        return promise;
    }
    printInvoice(): void {
        this.dataForQr = this.configuracion.nit + '|' +
            this.invoice.factura.nro_factura + '|' +
            this.invoice.factura.nro_autorizacion + '|' +
            this.datePipe.transform(this.invoice.fecha_hora, 'dd/MM/yyyy') + '|' +
            this._number.transform(this.invoice.total, '0.2-2') + '|' +
            this._number.transform(this.invoice.total * 0.13, '0.2-2') + '|' +
            this.invoice.factura.codigo_control + '|' +
            this.invoice.cliente.ci;
        setTimeout(() => {
            window.print();
            this.invoice.total = null;
        }, 50);
    }
}
