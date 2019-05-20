export class Cuenta {
    constructor(
        public id_persona: number,
        public nombre: string,
        public usuario: string,
        public contrasenia: string,
        public nivel_acceso: boolean,
        public permisos: {
            option1: boolean,
            option2: boolean,
        },
        public habilitada: boolean
    ) {}
}