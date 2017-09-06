import { Producto } from "../../productos/models/producto";

export class CarItem {
  constructor(
    public _id: string,
    public producto: Producto,
    public cantidad: number,
    public _rev?: string
  ) {}
}
