import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ProductoService} from '../../services/producto.service';
import {PersonaService} from '../../services/persona.service';
import { Global } from '../../services/global';


@Component({
  selector: 'app-home',
  templateUrl: '../../views/home/home.html',
})
export class HomeComponent { }

