import { Component, Renderer2, ViewChild, EventEmitter, ElementRef, Output, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona';


@Component({
    selector: 'app-suggestions',
    templateUrl: '../../views/clientes/suggestions.html',
    providers: [PersonaService]
})

export class SuggestionsComponent {
    @ViewChild('listSeggestions') listSeggestions: ElementRef;
    @Input() set inputValue(value) {
        if (value) {
            this.input = value.nombre;
        }
    }
    @Input() inputPlaceholder: string;
    public personas: Persona[];
    public indexElement: number;
    public selectedSuggestion: any;
    public input: string;
    public showSuggestions: boolean;
    public mouseOverSuggestions: boolean;
    @Output() selectedSuggestionEmitter = new EventEmitter();
    // this.personaIdEmitter.emit(response.data.id);
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _personaService: PersonaService,
        private renderer: Renderer2,
    ) {
        this.showSuggestions = false;
        this.indexElement = 0;
        this.input = '';
    }
    query() {
        let persona;
        if (!this.showSuggestions) {
            this.showSuggestions = true;
        }
        this.selectedSuggestion = null;
        persona =  new Persona(null, '', '', '', '', '');
        persona._suggestion = true;
        this.selectedSuggestionEmitter.emit(persona);
        if (this.input.length > 2) {
            this._personaService.getSuggestions(this.input).subscribe(
                response => {
                    if (this.mouseOverSuggestions) {
                        this.indexElement = 0;
                    }
                    this.personas = response.data;
                }, errors => {
                    console.log(<any>errors);
                }
            );
        }
    }
    down() {
        event.preventDefault();
        let children = this.listSeggestions.nativeElement.children;
        if (children.length - 1 > this.indexElement) {
            this.indexElement++;
        } else {
            this.indexElement = 0;
        }
        // this.renderer.nextSibling(event.target).focus();
        /*this.renderer.nextSibling(event.target).nextSibling.children[0].focus();
        console.log(this.renderer.nextSibling(event.target).nextSibling.children.firstChild);*/
    }
    up() {
        event.preventDefault();
        let children = this.listSeggestions.nativeElement.children;
        if (this.indexElement > 0) {
            this.indexElement--;
        } else {
            this.indexElement = children.length - 1;
        }
    }
    clickSelectSuggestion(target) {
        this.indexElement = 0;
        this.selectedSuggestion = target;
        this.selectedSuggestionEmitter.emit(target);
        this.showSuggestions = false;
        this.input = target.nombre;
    }
    pressSelectSuggestion() {
        if (this.personas && this.personas.length > 0 && this.showSuggestions) {
            this.selectedSuggestion = this.personas[this.indexElement];
            this.selectedSuggestionEmitter.emit(this.personas[this.indexElement]);
            this.showSuggestions = false;
            this.input = this.personas[this.indexElement].nombre;
            this.indexElement = 0;
        }
    }
    suggestionOnBlur() {
        if (!this.mouseOverSuggestions) {
            this.showSuggestions = false;
        }
    }
    suggestionHidden() {
        this.showSuggestions = false;
    }
    indexChange(index) {
        this.indexElement = index;
    }
}
