import { Component, Renderer2, ViewChild, EventEmitter, ElementRef, Output, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona';


@Component({
    selector: 'app-suggestions-local',
    templateUrl: 'local-suggestions.component.html',
    providers: [PersonaService]
})

export class LocalSuggestionsComponent {
    @ViewChild('listSeggestions') listSeggestions: ElementRef;
    @Input() config: any;
    @Input() data: any[];
    @Input() set inputValue(value) {
        if (value) {
            this.input = value[this.config.sourceField];
        }
    }
    public indexElement: number;
    public selectedSuggestion: any;
    public input: string;
    public suggestions: string[];
    public showSuggestions: boolean;
    public mouseOverSuggestions: boolean;
    @Output() selectedSuggestionEvent = new EventEmitter();
    // this.personaIdEmitter.emit(response.data.id);
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _personaService: PersonaService,
        private renderer: Renderer2,
    ) {
        this.showSuggestions = false;
        this.suggestions = [];
        this.indexElement = 0;
        this.input = '';
    }
    query() {
        let _object;
        if (!this.showSuggestions) {
            this.showSuggestions = true;
        }
        this.selectedSuggestion = null;
        _object =  {};
        // _data._suggestion = true;
        this.selectedSuggestionEvent.emit(_object);
        if (this.input.length > 1) {
            if (this.mouseOverSuggestions) {
                this.indexElement = 0;
            }
            let count = 0, cadena;
            this.suggestions = this.data.filter(_dat => {
                count ++;
                if (count === 10) {
                    return false;
                } else {
                    return this.getCleanedString(_dat[this.config.sourceField].toLowerCase())
                        .indexOf(this.getCleanedString(this.input.toLowerCase())) > -1;
                }
            });
        }
    }
    getCleanedString(string: string) {
        string = string.replace(/á/gi, 'a');
        string = string.replace(/é/gi, 'e');
        string = string.replace(/í/gi, 'i');
        string = string.replace(/ó/gi, 'o');
        string = string.replace(/ú/gi, 'u');
        string = string.replace(/ñ/gi, 'n');
        return string;
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
        this.selectedSuggestionEvent.emit(target);
        this.showSuggestions = false;
        this.input = target[this.config.sourceField];
    }
    pressSelectSuggestion() {
        if (this.suggestions && this.suggestions.length > 0 && this.showSuggestions) {
            this.selectedSuggestion = this.suggestions[this.indexElement];
            this.selectedSuggestionEvent.emit(this.suggestions[this.indexElement]);
            this.showSuggestions = false;
            this.input = this.suggestions[this.indexElement][this.config.sourceField];
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
