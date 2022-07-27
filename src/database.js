import firebase from "firebase/compat/app";
import "firebase/compat/database";

const config = {
  apiKey: "AIzaSyBAqe0cBZIw_pGY8zfgtmbBzlcywGVYpDM",
  authDomain: "firevuechat-7da77.firebaseapp.com",
  databaseURL: "https://firevuechat-7da77-default-rtdb.firebaseio.com",
  projectId: "firevuechat-7da77",
  storageBucket: "firevuechat-7da77.appspot.com",
  messagingSenderId: "384388858187",
  appId: "1:384388858187:web:99e1a0d6d776e2d7b0e8ce",
  measurementId: "G-6YFPD53Z4E",
};

const database = firebase.initializeApp(config);
export default database;
