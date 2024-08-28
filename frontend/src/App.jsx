import { useState } from 'react'

import './App.css'

import appFirebase from '../src/credenciales';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth(appFirebase)
//  utilizamos firebase para un manejo de usuarios más rápido
import Login from '../src/pantallas/Login';
import Home from '../src/pantallas/Home'

function App() {

  const [user, setUser] = useState(null)
  onAuthStateChanged(auth, (userfirebase)=> {
    if (userfirebase) {
      setUser(userfirebase)
    }
    else {
      setUser(null)
    }
  })
  //  Preguntamos si el usuario ha iniciado sesión o no, y mostramos distintas pantallas en ambos casos
  return <div>{user ? <Home email={user.email}/> : <Login />}</div>;
}

export default App
