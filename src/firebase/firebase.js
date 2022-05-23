import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDjNcDKtAJ2o-jBnoBzDcnVvfxZp1y5eos",
  authDomain: "urlsh1.firebaseapp.com",
  projectId: "urlsh1",
  storageBucket: "urlsh1.appspot.com",
  messagingSenderId: "298028199354",
  appId: "1:298028199354:web:241ef4e2f60b1967ea4183",
  measurementId: "G-96ZYM8XNBY",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const logInWithEmailAndPassword = async (email, password) => {
  let status = undefined;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    status = "loggedin";
  } catch (error) {
    status = error.message;
    console.error(error);
  }
  return status;
};

const registerWithEmailAndPassword = async (name, email, password) => {
  let status = undefined;
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
    status = "registered";
  } catch (error) {
    status = error.message;
    console.error(error);
  }
  return status;
};

const sendPasswordReset = async (email) => {
  let status = undefined;
  try {
    await sendPasswordResetEmail(auth, email);
    status = "sent";
  } catch (error) {
    status = error.message;
  }
  return status;
};

const logOut = () => signOut(auth);

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logOut,
};
