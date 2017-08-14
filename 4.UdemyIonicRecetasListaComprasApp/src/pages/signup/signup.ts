import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators  } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  private signUpForm: FormGroup;
  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navParams: NavParams,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.signUpForm = this.createForm();
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
    console.log(this.signUpForm.value);
    let loading = this.loadingCtrl.create({
      content: 'Procesando el registro...'
    });
    loading.present();
    let formVal = this.signUpForm.value;
    this.authService.registro(formVal.email, formVal.password)
      .then(data => {
        console.log(data);
        loading.dismiss();
      })
      .catch(err => {
        console.log(err);
        this.alertCtrl.create({
          title: "El registro fallo.",
          message: err.message,
          buttons: ['Ok']
        }).present();
        loading.dismiss();
      });
  }

}
