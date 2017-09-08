import { Producto } from "../../productos/models/producto";

export class CarItem {
  constructor(
    public _id: string,
    public cantidad: number,
    public _rev?: string
  ) {}
}
