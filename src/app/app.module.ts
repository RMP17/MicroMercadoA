import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// libs
import { QRCodeModule } from 'angularx-qrcode';

// Module

// import {ComponentsModule} from './components/components.module';
// Rutas
import {RoutingCustom} from './app.routing';
// Compponents
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {ProductosComponent} from './components/productos/productos.component';
import {ErrorComponent} from './components/error.component';
import {LoginComponent} from './components/usuarios/login.component';

import { CompraVentasComponent } from './components/compras-ventas/compras-ventas.component';
import { ComprasComponent } from './components/compras-ventas/compras.component';
import { SuggestionsComponent } from './components/clientes/suggestions.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { CajasComponent } from './components/cajas/cajas.component';
import { FacturaComponent } from './components/compras-ventas/factura.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import {PersonaService} from './services/persona.service';
import {CategoriasComponent} from './components/productos/categorias.component';
import {NumberFloatDirective} from './directivas/number-float.directive';
import {ContainerComponent} from './components/container.component';
import {ClickStopPropagationDirective} from './directivas/click-stop-propagation.directive';
import {UsuarioComponent} from './components/usuarios/usuarios.component';
import {ProveedorComponent} from './components/proveedores/proveedores.component';
import {MarcasComponent} from './components/productos/marcas.component';
import {SidebarContentProveedorComponent} from './components/proveedores/sidebar-content-proveedor.component';
import {VentasComponent} from './components/compras-ventas/ventas.component';
import {LocalSuggestionsComponent} from './components/suggestion/local-suggestions.component';
import {NumberPositiveDirective} from './directivas/number.directive';
import {FormPersonaComponent} from './components/proveedores/form-persona.component';
import {ToastrModule} from 'ngx-toastr';

// Pipes

import { MovementPipe } from './pipes/movements.pipe';
import { FilterByPipe } from './pipes/filter-by.pipe';
import { NumbersToLettersPipe } from './pipes/numbers-to-letters.pipe';
import { CentavosPipe } from './pipes/centavos.pipe';
import { SessionFilterPipe } from './pipes/session-filter.pipe';

// Guards
import {AdminGuard} from './guards/admin.guard';
import {AuthGuard} from './guards/auth.guard';
import {from} from 'rxjs/internal/observable/from';


@NgModule({
    declarations: [
        AppComponent,
        ErrorComponent,
        HomeComponent,
        LoginComponent,
        ProductosComponent,
        MarcasComponent,
        ContainerComponent,
        CategoriasComponent,
        SidebarContentProveedorComponent,
        ProveedorComponent,
        FormPersonaComponent,
        NumberPositiveDirective,
        ClickStopPropagationDirective,
        NumberFloatDirective,
        UsuarioComponent,
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
        ClientesComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RoutingCustom,
        // ComponentsRoutingModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            enableHtml: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-bottom-right'
        }), // ToastrModule added
        QRCodeModule
    ],
    providers: [AdminGuard, AuthGuard, PersonaService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
