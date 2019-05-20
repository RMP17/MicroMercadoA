export class Configuration {
    constructor(
        public id: number = null,
        public nit: string = '',
        public nombre_super_mercado: string = '',
        public propietario_a: string = '',
        public casa_matriz: string = '',
        public telefono: string = '',
        public autorizacion: string = '',
        public dosificacion: string = '',
        public fecha_limite_emision: string = '',
        public numero_factura: number = null,
        public dias_antes_mostrar_vencimiento: number = null,
        public stock_min_antes_mostrar: number = null,
    ) {}
}
