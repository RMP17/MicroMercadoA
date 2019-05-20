export class Factura {
    constructor(
        public id_compra_venta: number = null,
        public nro_factura: string = '',
        public nro_autorizacion: string = '',
        public nulo: boolean = false,
        public codigo_control: string = '',
    ) {}
}
