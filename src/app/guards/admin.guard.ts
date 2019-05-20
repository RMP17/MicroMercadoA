import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { PersonaService } from '../services/persona.service';


@Injectable()

export class AdminGuard implements CanActivate {
    constructor(
        private _router: Router,
        private _personaService: PersonaService
    ) {}
    canActivate() {
        let identity;
        identity = this._personaService.getIdentity();
        if (identity && identity.nivel_acceso === 0 ) {
            return true;
        } else {
            // this._router.navigate(['/']);
            window.alert('No tienes permiso para acceder a esta sección');
            return false;
        }
    }
}