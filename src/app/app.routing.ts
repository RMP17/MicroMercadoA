import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
// import { NgModule } from '@angular/core';

// Componentes
import {ErrorComponent} from './components/error.component';
import { HomeComponent } from './components/home/home.component';
import {LoginComponent} from './components/usuarios/login.component';
import {ProductosComponent} from './components/productos/productos.component';
import {ContainerComponent} from './components/container.component';
import {ConfigurationComponent} from './components/configuration/configuration.component';
import {VentasComponent} from './components/compras-ventas/ventas.component';
import {ComprasComponent} from './components/compras-ventas/compras.component';
import {ClientesComponent} from './components/clientes/clientes.component';
import {UsuarioComponent} from './components/usuarios/usuarios.component';
import {CajasComponent} from './components/cajas/cajas.component';
// Guards
import {AdminGuard} from './guards/admin.guard';
import {AuthGuard} from './guards/auth.guard';

const appRoutes: Routes = [
    {
        path: '',
        component: ContainerComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: HomeComponent,
            }, {
                path: 'home',
                component: HomeComponent,
            }, {
                path: 'productos',
                component: ProductosComponent,
            }, {
                path: 'clientes',
                component: ClientesComponent
            }, {
                path: 'usuarios', component: UsuarioComponent,
                canActivate: [AdminGuard],
            }, {
                path: 'cajas',
                component: CajasComponent,
            }, {
                path: 'ventas',
                component: VentasComponent,
            }, {
                path: 'compras',
                component: ComprasComponent,
            }, {
                path: 'configuracion',
                component: ConfigurationComponent,
                canActivate: [AdminGuard]
            }
        ]
    },
    {path: 'login', component: LoginComponent},
    {path: '**', component: ErrorComponent},
];

@NgModule({
    imports: [ RouterModule.forRoot(appRoutes) ],
    exports: [ RouterModule ]
})
export class RoutingCustom { }
