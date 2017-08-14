import firebase from "firebase";
export class AuthService {

  public registro(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  public acceder(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  public desconectar(): firebase.Promise<any> {
    return firebase.auth().signOut();
  }

  public usuarioActivo(): firebase.User {
    return firebase.auth().currentUser;
  }

}
