export class Cliente {
  constructor(
    public _id: string,
    public uid_asesor: number,
    public asesor: string,
    public ciudad: string,
    public direccion: string,
    public nombre_cliente: string,
    public _rev?: string
  ) {}
}
