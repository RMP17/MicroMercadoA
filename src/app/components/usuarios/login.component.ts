import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { Cuenta } from '../../models/cuenta';

// import * as process from 'process';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-login',
    templateUrl: '../../views/usuarios/login.html',
    providers: [PersonaService]
})

export class LoginComponent implements OnInit {
    public titulo: string;
    public cuenta: Cuenta;
    public identity;
    public token;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _personaService: PersonaService,
        private toastr: ToastrService,
    ) {
        this.titulo = 'Login';
        this.cuenta = new Cuenta(null, '', '', '', true, {option1: true, option2: true}, true);
        this.token = null;
    }
    ngOnInit() {
        if (this._personaService.getIdentity()) {
            this._router.navigate(['/home']);
        }
       /* console.log('login');
        console.log(this._personaService.getIdentity());*/
        // console.log(this._personaService.getToken());
    }
    onSubmit() {
        this._personaService.signup(this.cuenta).subscribe(
            response => {
                // this.identity = response.data;
                console.log(response);
                this.identity = response.user;
                this.token = response.token;
                if (!this.identity || !this.identity.id_persona || !this.token) {
                // if (!this.identity) {
                    alert('El usuario no a iniciado sesión correctamente ');
                } else {
                    localStorage.setItem('identity', JSON.stringify(this.identity));
                    localStorage.setItem('token', this.token);
                    this._router.navigate(['/home']);
                    // this._router.navigate(['/']);
                    // window.location.reload();
                    /*this._personaService.signup(this.cuenta, 'true').subscribe(
                        _response => {
                            this.token = _response.data.token;
                            if (this.token.length <= 0 ) {
                                alert('El token no se logeado correctamente ');
                            } else {
                                localStorage.setItem('token', this.token);
                                this._router.navigate(['/productos']);
                            }
                        }, error => {
                            console.log(<any>error);
                        }
                    );*/
                }
            }, error => {
                console.log(<any>error);
                this.toastr.error('Ingrese correctamente sus credenciales');
            }
        );
    }
}