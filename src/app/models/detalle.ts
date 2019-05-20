export class Detalle {
    constructor(
        public id_producto: string = null,
        public producto: string = null,
        public precio_unitario: number = null,
        public cantidad_producto: number = null,
        public subtotal: number = null
    ) { }
}
