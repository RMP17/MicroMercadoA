import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { ConfiguracionService } from '../../services/configuracion.service';
import { Persona } from '../../models/persona';
import { Configuration } from '../../models/configuration';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-configuration',
    templateUrl: '../../views/configuration/configuration.html',
    providers: [PersonaService, ConfiguracionService]
})

export class ConfigurationComponent implements OnInit {
    public titulo: string;
    public persona: Persona;
    public personas: Persona[];
    public configuracion: Configuration;
    public editModeValue: string;
    public testControlCode: {
        nro_autorizacion: string,
        nro_factura: number,
        nit: string,
        fecha: string,
        monto: number,
        llave: string
    };
    public controlCode: string;
    public llaveServer: string;
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _personaService: PersonaService,
        private _configuracionService: ConfiguracionService,
        private toastr: ToastrService,
    ) {
        this.titulo = 'Configuración';
        this.configuracion = new Configuration();
        this.editModeValue = '';
        this.controlCode = '_';
        this.llaveServer = '';
        this.testControlCode = {
            nro_autorizacion: '3904004067389',
            nro_factura: 649766,
            nit: '4881206',
            fecha: '2008/04/10',
            monto: 84914,
            llave: 'j=}_s*BZ*HPBsRqTpBm-La]J}_uz8s(jvdE_wp69qmCpvf43b7L]9y*fvqryb%4e'
        };
    }
    ngOnInit() {
        this._configuracionService.getConfiguracion().subscribe(
            response => {
                this.configuracion = response;
            }, errors => {
                console.log(errors);
            }
        );
    }
    sendDataCondiguration() {
        this._configuracionService.storeConfiguracion(this.configuracion).subscribe(
            response => {
                this.toastr.success('Operación Exitosa');
            }, errors => {
                this.toastr.error(errors.error);
                console.log(<any>errors);
            }
        );
    }
    getTestControlCode() {
        console.log(this.testControlCode);
        this._configuracionService.getTestControlCode(this.testControlCode).subscribe(
            response => {
                this.controlCode = response.codigo_control;
                this.llaveServer = response.llave;
            }, errors => {
                this.toastr.error(errors.error);
            }
        );
    }
}
