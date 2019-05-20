import {Component} from '@angular/core';

@Component({
    selector: 'sidebar-content-prov',
    template: `
        <nav class="col-md-2 d-none d-md-block bg-dark position-fixed sidebar">
            <div class="sidebar-sticky">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link active" [routerLink]="['/proveedores/marcas']" [routerLinkActive]="['active-sidebar']">
                            <span class="oi oi-tag"></span>
                            Proveedor
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" [routerLink]="['/productos/categorias']" [routerLinkActive]="['active-sidebar']">
                            <span class="oi oi-grid-four-up"></span>
                            Categorias
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        `
})

export class SidebarContentProveedorComponent {}