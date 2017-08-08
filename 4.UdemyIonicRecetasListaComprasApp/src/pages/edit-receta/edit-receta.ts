import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ActionSheet, AlertController, Alert, ToastController } from 'ionic-angular';
import { FormGroup, FormArray, FormBuilder, Validators  } from "@angular/forms";
import { RecetaService } from "../../services/receta.service";
import { Ingrediente } from "../../models/ingrediente";
import { Receta } from "../../models/receta";

@Component({
  selector: 'page-edit-receta',
  templateUrl: 'edit-receta.html',
})
export class EditRecetaPage {

  private mode: string;
  private opcionesSelect = ['Facil', 'Media', 'Dificil'];
  private recetaForm: FormGroup;
  private receta: Receta;

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

    if(this.mode == "PUT"){
      this.receta = this.recetaService.recetas[this.navParams.get('index')];
      this.initializeForm(
        this.receta.titulo,
        this.receta.descripcion,
        this.receta.dificultad
      );
      this.setIngredientes(this.receta.ingredientes);
    }else{
      this.initializeForm();
    }
  }

  private initializeForm(
    titulo?:string,
    descripcion?:string,
    dificultad:string = 'Media',
    ingredientes:any = this.fb.array([])
  ): void {
    this.recetaForm = this.fb.group({
      titulo: [titulo, Validators.required],
      descripcion: [descripcion, Validators.required],
      dificultad: [dificultad, Validators.required],
      ingredientes: ingredientes
    });
  }

  private onSubmit(): void {
    console.log(this.recetaForm);
    let formModel = JSON.parse(JSON.stringify(this.recetaForm.value));

    if(formModel.ingredientes.length > 0){
      let ingredientes = formModel.ingredientes.map(
        ing => new Ingrediente(ing as string)
      )
      formModel.ingredientes = ingredientes;
    }

    this.recetaService.recetas = [formModel];
    this.navCtrl.popToRoot();
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
          role: 'destructive',
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

  private setIngredientes(ingredientes: Ingrediente[]) {
    const ingredienteCtrls = ingredientes.map(
      (ingrediente: Ingrediente) => {
        debugger;
        return this.fb.control(ingrediente.nombre, Validators.required)
      }
    );
    const ingredientesFormArray = this.fb.array(ingredienteCtrls);
    this.recetaForm.setControl('ingredientes', ingredientesFormArray);
  }

}
