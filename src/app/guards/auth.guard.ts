import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { PersonaService } from '../services/persona.service';


@Injectable()

export class AuthGuard implements CanActivate {
    constructor(
        private _router: Router,
        private _personaService: PersonaService
    ) {}
    canActivate() {
        let identity;
        identity = this._personaService.getIdentity();
        if (identity) {
            return true;
        } else {
            this._router.navigate(['/login']);
            return false;
        }
    }
}