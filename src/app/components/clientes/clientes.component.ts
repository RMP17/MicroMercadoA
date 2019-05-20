import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Persona} from '../../models/persona';
import { PersonaService } from '../../services/persona.service';

@Component({
    selector: 'clientes',
    templateUrl: '../../views/clientes/clientes.html'
})

export class ClientesComponent implements OnInit {
    public title: string;
    public persona: Persona;
    public frequentClients: any;
    public searchClient: {
        initialDate: any,
        endDate: any
    };
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _personaService: PersonaService
    ) {
        this.title = 'Clientes';
        this.frequentClients = [];
        this.persona = new Persona(null, '', '', '', '', '');
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
        this.searchClient = {
            initialDate: year + '-' + month + '-' + day,
            endDate: year + '-' + month + '-' + day
        };
    }
    ngOnInit() {
        this.getFrequentClients();
    }
    getSuggestedClient(event) {
        this.persona = event;
    }
    disableForm(event) {
        this.persona = new Persona(null, '', '', '', '', '');
    }
    selectedDate(event, numericDate) {
        if (numericDate === 1) {
            if  (new Date(event.target.value).getTime() > new Date(this.searchClient.endDate).getTime()) {
                this.searchClient.initialDate = event.target.value;
                this.searchClient.endDate = event.target.value;
            } else {
                this.searchClient.initialDate = event.target.value;
            }
        } else {
            if  (new Date(event.target.value).getTime() > new Date(this.searchClient.endDate).getTime()) {
                this.searchClient.initialDate = event.target.value;
                this.searchClient.endDate = event.target.value;
            } else {
                this.searchClient.endDate = event.target.value;
            }
        }
        this.getFrequentClients();
    }
    getFrequentClients() {
        this._personaService.getFrequentClients(this.searchClient).subscribe(
            response => {
                this.frequentClients = response;
            }, errors => {
                console.log(errors);
            }
        );
    }
}
