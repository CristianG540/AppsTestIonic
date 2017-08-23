import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController } from 'ionic-angular';
import { TodosProvider } from "../../providers/todos/todos";
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private todoService: TodosProvider,
    private authService: AuthProvider,
    private alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad(){
    this.todoService.getTodos()
      .then( () => console.log('melo!', this.todoService.data) )
      .catch( err => console.error(err) );
  }

  private logout(): void{
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();

    this.authService.logout()
    .then( () => {
      loading.dismiss();
      this.navCtrl.setRoot('LoginPage');
    })
    .catch( err => {
      loading.dismiss();
      console.log.bind(console)
    })
  }

  createTodo() {

    let prompt = this.alertCtrl.create({
      title: 'Add',
      message: 'What do you need to do?',
      inputs: [
        {
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.todoService.createTodo({
              _id: Date.now().toString(),
              title: data.title
            });
          }
        }
      ]
    });

    prompt.present();

  }

  updateTodo(todo) {

    let prompt = this.alertCtrl.create({
      title: 'Edit',
      message: 'Change your mind?',
      inputs: [
        {
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.todoService.updateTodo({
              _id: todo._id,
              _rev: todo._rev,
              title: data.title
            });
          }
        }
      ]
    });

    prompt.present();
  }

  deleteTodo(todo) {
    this.todoService.deleteTodo(todo);
  }

}
