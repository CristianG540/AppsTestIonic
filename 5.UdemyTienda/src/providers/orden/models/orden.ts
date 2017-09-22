import { CarItem } from "../../carrito/models/carItem";

export class Orden {
  constructor(
    public _id: string,
    public observaciones: string,
    public items: CarItem[],
    public total: number,
    public nitCliente?: string,
    public newClient?: any, // Aqui meto el cliente nuevo en caso de que el perro exista
    public type: string = "orden",
    public _rev?: string,
  ) {}
}
