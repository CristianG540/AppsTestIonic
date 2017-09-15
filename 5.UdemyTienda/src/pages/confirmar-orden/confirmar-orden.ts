import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { FormGroup, FormArray, FormBuilder, Validators  } from "@angular/forms";
import { CarritoProvider } from "../../providers/carrito/carrito";
import { ClientesProvider } from "../../providers/clientes/clientes";

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
    private clienteServ: ClientesProvider
  ) {
  }

  //Runs when the page is about to enter and become the active page.
  ionViewWillLoad() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.ordenForm = this.fb.group({
      observaciones: ['', Validators.required],
      cliente: ['']
    });

    this.newClient = this.fb.group({
      nombre: ['', Validators.required],
      codCliente: ['', Validators.required]
    })
  }

  //CONTINNUAR AQUI CREANDO EL METODO DE INDEXACION MUY IMPORTANTE !!!!!!!
  private indexDb(): void {
    this.clienteServ.indexDbClientes()
    .then(res=>{

    })
    .catch(err=>{

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

  }

}
