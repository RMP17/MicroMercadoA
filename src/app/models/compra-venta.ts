
export class CompraVenta {
    constructor(
        public id: number = null,
        public fecha_hora: string = null,
        public tipo: boolean = false,
        public descuento: number = null,
        public efectivo: number = null,
        public proveedor_id: number = null,
        public empleado_id: number = null,
        public cliente_id: number = null,
        public actividad: string = null,
        public venta_menor: boolean = false,
        public destino: boolean = true,
        public f: boolean = false,
        public total: number = null,
        public detalle: any = null
    ) { }
}
