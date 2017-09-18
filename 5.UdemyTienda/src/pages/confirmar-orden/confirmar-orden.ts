import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { FormGroup, FormArray, FormBuilder, Validators  } from "@angular/forms";

//Providers
import { CarritoProvider } from "../../providers/carrito/carrito";
import { ClientesProvider } from "../../providers/clientes/clientes";
import { OrdenProvider } from "../../providers/orden/orden";
import { Orden } from "../../providers/orden/models/orden";
import { CarItem } from '../../providers/carrito/models/carItem';

@IonicPage()
@Component({
  selector: 'page-confirmar-orden',
  templateUrl: 'confirmar-orden.html',
})
export class ConfirmarOrdenPage {

  private ordenForm: FormGroup;
  private newClient: FormGroup;
  private newClientFlag: boolean = false;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private cartServ: CarritoProvider,
    private clienteServ: ClientesProvider,
    private ordenServ: OrdenProvider
  ) {
  }

  //Runs when the page is about to enter and become the active page.
  ionViewWillLoad() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.ordenForm = this.fb.group({
      observaciones: [''],
      cliente: ['', Validators.required]
    });

    this.newClient = this.fb.group({
      nombre: ['', Validators.required],
      codCliente: ['', Validators.required]
    })
  }

  showAddressModal () {
    let modal = this.modalCtrl.create("AutocompletePage");
    let me = this;
    modal.onDidDismiss(data => {
       this.ordenForm.controls['cliente'].setValue(data);
    });
    modal.present();
  }

  private onSubmit(): void {
    /**
     * recupero los items del carrito para guardarlos en la orden
     */
    let carItems: CarItem[] = this.cartServ.carItems;
    let observaciones = this.ordenForm.get('observaciones').value;

    if (!this.newClientFlag && this.ordenForm.valid) {
      let form = JSON.parse(JSON.stringify(this.ordenForm.value));
      let orden: Orden = {
        _id : Date.now().toString(),
        nitCliente: form.cliente,
        observaciones: observaciones,
        items: carItems,
        total: this.cartServ.totalPrice
      }
      this.ordenServ.pushItem(orden);
      console.log('form submitted with nit');
    }

    if (this.newClientFlag && this.newClient.valid) {
      let form = JSON.parse(JSON.stringify(this.newClient.value));
      let orden: Orden = {
        _id : Date.now().toString(),
        newClient : form,
        observaciones: observaciones,
        items: carItems,
        total: this.cartServ.totalPrice
      }
      this.ordenServ.pushItem(orden)
      console.log('form submitted new client');
    }

  }

  public get formStatus() : boolean {
    if (this.newClientFlag) {
      return this.newClient.valid;
    }else{
      return this.ordenForm.valid;
    }
  }

}
