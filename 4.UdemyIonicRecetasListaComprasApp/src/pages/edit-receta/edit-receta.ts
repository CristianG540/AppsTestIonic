import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ActionSheet, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";

@Component({
  selector: 'page-edit-receta',
  templateUrl: 'edit-receta.html',
})
export class EditRecetaPage {

  private mode: string;
  public opcionesSelect = ['Facil', 'Media', 'Dificil'];
  private recetaForm: FormGroup;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {
  }

  ionViewWillLoad() {
    this.mode = this.navParams.get('mode');
    this.initializeForm();
  }

  private initializeForm(): void {
    this.recetaForm = new FormGroup({
      titulo: new FormControl(null, Validators.required),
      descripcion: new FormControl(null, Validators.required),
      dificultad: new FormControl('Media', Validators.required),
      ingredientes: new FormArray([])
    });
  }

  private onSubmit(): void {
    console.log(this.recetaForm);
  }

  private adminIngredientes(): void {
    const actionSheet: ActionSheet = this.actionSheetCtrl.create({
      title: '¿Que quieres hacer?',
      buttons: [
        {
          text : "Agregar Ingrediente",
          handler: () => {

          }
        },
        {
          text : "Eliminar todos los ingredientes",
          role: 'destrutive',
          handler: () => {

          }
        },
        {
          text : "Cancelar",
          role: 'cancel'
        }
      ]
    })
  }

  private crearIngredienteAlerta(): void {
    const nuevoIngredienteAlert = this.alertCtrl.create({
      title: 'Agregar ingrediente',
      inputs: [
        {
          name: 'nombre',
          placeholder: 'Nombre'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: data => {
            if (data.nombre.trim() == '' || data.nombre == null ) {

            }
          }
        }

      ]
    })

  }


}
