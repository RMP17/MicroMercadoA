import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// libs
import { QRCodeModule } from 'angularx-qrcode';

// Directivas

import { NumberPositiveDirective } from '../directivas/number.directive';
import { NumberFloatDirective } from '../directivas/number-float.directive';
import { ClickStopPropagationDirective } from '../directivas/click-stop-propagation.directive';
// Rutas
import { ComponentsRoutingModule } from './components.routing.module';

// Componentes

import { MarcasComponent } from './productos/marcas.component';
import { ContainerComponent } from './container.component';
import { SidebarContentProveedorComponent } from './proveedores/sidebar-content-proveedor.component';
import { CategoriasComponent } from './productos/categorias.component';
import { ProductosComponent } from './productos/productos.component';
import { ProveedorComponent } from './proveedores/proveedores.component';
import { VentasComponent } from './compras-ventas/ventas.component';
import { UsuarioComponent } from './usuarios/usuarios.component';
import { FormPersonaComponent } from './proveedores/form-persona.component';
import { LocalSuggestionsComponent } from './suggestion/local-suggestions.component';
// import { LoginComponent } from './usuarios/login.component';
import { CompraVentasComponent } from './compras-ventas/compras-ventas.component';
import { ComprasComponent } from './compras-ventas/compras.component';
import { SuggestionsComponent } from './clientes/suggestions.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { CajasComponent } from './cajas/cajas.component';
import { FacturaComponent } from './compras-ventas/factura.component';
import { ClientesComponent } from './clientes/clientes.component';

// Pipes

import { MovementPipe } from '../pipes/movements.pipe';
import { FilterByPipe } from '../pipes/filter-by.pipe';
import { NumbersToLettersPipe } from '../pipes/numbers-to-letters.pipe';
import { CentavosPipe } from '../pipes/centavos.pipe';
import { SessionFilterPipe } from '../pipes/session-filter.pipe';

// Guards

import {PersonaService} from '../services/persona.service';
import {AdminGuard} from '../guards/admin.guard';

@NgModule({
    declarations: [
        /*MarcasComponent,
        ContainerComponent,
        CategoriasComponent,
        // ProductosComponent,
        SidebarContentProveedorComponent,
        ProveedorComponent,
        FormPersonaComponent,
        NumberPositiveDirective,
        ClickStopPropagationDirective,
        NumberFloatDirective,
        UsuarioComponent,
        // LoginComponent,
        VentasComponent,
        CompraVentasComponent,
        ComprasComponent,
        SuggestionsComponent,
        LocalSuggestionsComponent,
        ConfigurationComponent,
        CajasComponent,
        MovementPipe,
        FilterByPipe,
        CentavosPipe,
        NumbersToLettersPipe,
        SessionFilterPipe,
        FacturaComponent,
        ClientesComponent*/
    ],
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        // ComponentsRoutingModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            enableHtml: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-bottom-right'
        }), // ToastrModule added
        QRCodeModule
    ],
    providers: [AdminGuard, PersonaService],
})
export class ComponentsModule { }
