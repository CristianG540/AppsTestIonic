import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators  } from "@angular/forms";

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  private signUpForm: FormGroup;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private fb: FormBuilder
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
  }

}
