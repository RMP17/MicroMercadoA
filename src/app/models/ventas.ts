
export class Venta {
    constructor(
        public id_venta: string = null,
        public fecha_hora: string = '00-00-0000',
        public tipo: boolean = false,
        public cliente: any = null,
        public id_empleado: string = null,
        public detalle: any = null
    ) {}
}
