import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators  } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {
  private signInForm: FormGroup;
  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navParams: NavParams,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.signInForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email : [
        null,
        [
          Validators.required,
          Validators.email
        ]
      ],
      password : [
        null,
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
    });
  }

  private onSubmit(): void {
    console.log(this.signInForm.value);
    let formVal = this.signInForm.value;

    let loading = this.loadingCtrl.create({
      content: 'Accediendo...'
    });
    loading.present();

    this.authService.acceder(formVal.email, formVal.password)
      .then(data => {
        console.log(data);
        loading.dismiss();
      })
      .catch(err => {
        console.log(err);
        this.alertCtrl.create({
          title: "Fallo al acceeder.",
          message: err.message,
          buttons: ['Ok']
        }).present();
        loading.dismiss();
      });
  }

}
