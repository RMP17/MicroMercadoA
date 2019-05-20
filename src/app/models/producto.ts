export class Producto {
    constructor(
        public id: number = null,
        public descripcion: string = '',
        public codigo: string = '',
        public tipo_unidad: string = '',
        public precio_compra_unidad: number = null,
        public precio_venta_unidad: number = null,
        public stock: number = null,
        public cantidad_almacen: number = null,
        public fecha_caducidad: string = '',
        public fecha_caducidad_almacen: string = '',
        public notificar: boolean = null,
        public notificar_fecha_caducidad: boolean = null,
        public img: string = '',
        public id_marca = null,
        public id_categoria = null,
        public id_proveedor = null,
    ) { }
}
