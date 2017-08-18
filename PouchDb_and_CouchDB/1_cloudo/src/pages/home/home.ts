import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { TodosProvider } from "../../providers/todos/todos";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private todos: any;

  constructor(
    private navCtrl: NavController,
    private todoService: TodosProvider,
    private alertCtrl: AlertController
  ) {}

  ionViewDidLoad(){
    this.todoService.getTodos()
      .then( () => console.log('melo!', this.todoService.data) )
      .catch( err => console.error(err) );
  }

  createTodo(){

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

  updateTodo(todo){

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

  deleteTodo(todo){
    this.todoService.deleteTodo(todo);
  }

}
