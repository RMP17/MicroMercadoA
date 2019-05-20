import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {ContainerComponent} from './container.component';
import {ProductosComponent} from './productos/productos.component';
import {UsuarioComponent} from './usuarios/usuarios.component';
import { CajasComponent } from './cajas/cajas.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ClientesComponent } from './clientes/clientes.component';

import {ComprasComponent} from './compras-ventas/compras.component';
import {VentasComponent} from './compras-ventas/ventas.component';
// Guards

import {AdminGuard} from '../guards/admin.guard';

const productoRoutes: Routes = [
    {
        path: 'productos',
        component: ContainerComponent,
        children: [
            {path: '', component: ProductosComponent}
        ]
    },
    {path: 'clientes', component: ClientesComponent },
    {
        path: 'usuarios', component: ContainerComponent,
        canActivate: [AdminGuard],
        children: [
            {path: '', component: UsuarioComponent},
        ]
    },
    {
        path: 'cajas', component: CajasComponent,
    },
    {
        path: 'ventas', component: ContainerComponent,
        children: [
            {path: '', component: VentasComponent},
        ]
    },
    {
        path: 'compras', component: ContainerComponent,
        children: [
            {path: '', component: ComprasComponent}
        ]
    },
    {
        path: 'configuracion', component: ConfigurationComponent, canActivate: [AdminGuard]
    }
];

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule, // required animations module
        RouterModule.forChild(productoRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class ComponentsRoutingModule { }