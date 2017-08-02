import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ActionSheet, AlertController, Alert, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators  } from "@angular/forms";
import { RecetaService } from "../../services/receta.service";
import { Receta } from "../../models/receta";

@Component({
  selector: 'page-edit-receta',
  templateUrl: 'edit-receta.html',
})
export class EditRecetaPage {

  private mode: string;
  private opcionesSelect = ['Facil', 'Media', 'Dificil'];
  private recetaForm: FormGroup;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private fb: FormBuilder,
    private recetaService: RecetaService
  ) {
  }

  ionViewWillLoad() {
    this.mode = this.navParams.get('mode');
    this.initializeForm();
  }

  private initializeForm(): void {
    this.recetaForm = this.fb.group({
      titulo: [null, Validators.required],
      descripcion: [null, Validators.required],
      dificultad: ['Media', Validators.required],
      ingredientes: this.fb.array([])
    });
  }

  private onSubmit(): void {
    console.log(this.recetaForm);
    const formModel: Receta = this.recetaForm.value;
    this.recetaService.recetas = [formModel];
    console.log('recetas', this.recetaService.recetas );
  }

  private adminIngredientes(): void {
    const actionSheet: ActionSheet = this.actionSheetCtrl.create({
      title: '¿Que quieres hacer?',
      buttons: [
        {
          text : "Agregar Ingrediente",
          handler: () => {
            this.crearIngredienteAlerta().present();
          }
        },
        {
          text : "Eliminar todos los ingredientes",
          role: 'destrutive',
          handler: () => {
            if(this.ingredientes.length > 0){
              this.recetaForm.setControl('ingredientes', this.fb.array([]) );
              this.toastCtrl.create({
                message: 'Eliminados!',
                duration: 2000
              }).present();
            }
          }
        },
        {
          text : "Cancelar",
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  private crearIngredienteAlerta(): Alert {
    return this.alertCtrl.create({
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
              this.toastCtrl.create({
                message: 'Por favor ingresa un valor valido',
                duration: 2000
              }).present();
              return;
            }

            this.ingredientes
              .push( this.fb.control(data.nombre, Validators.required) );

            this.toastCtrl.create({
              message: 'Agregado!',
              duration: 2000
            }).present();
          }
        }

      ]
    })

  }

 public get ingredientes() : FormArray {
   return this.recetaForm.get('ingredientes') as FormArray;
 }

}
