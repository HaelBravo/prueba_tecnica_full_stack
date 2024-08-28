import { AuthErrorCodes, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import appFirebase from '../credenciales.js'
const auth = getAuth(appFirebase)
const Login = () => {

  const [change, setChange] = useState(false);
  const [icono, setIcono] = useState(true)
  const [alerta, setAlerta] = useState()
  const authentic = async(e) => {
    
    e.preventDefault();
    const email = e.target.email.value;
    const pass = e.target.password.value;
    
    if (change) {
      try {
        //  Usamos firebase para crear un nuevo usuario
        await createUserWithEmailAndPassword(auth, email, pass)
      }
      catch (error) {
        //  Manejamos los distintos errores que se puedan manejar en la creación del nuevo usuario

        switch (error.code) {
          case 'auth/weak-password' :
            setAlerta('Por favor, ingrese una contraseña más segura.');
            break;
          case 'auth/missing-email':
            setAlerta('Por favor, ingrese un correo electŕonico.');
            break;
          case 'auth/missing-password':
            setAlerta('Por favor, asigne una contraseña para su correo electrónico.');
            break;
          case 'auth/email-already-in-use': 
            setAlerta('Este correo electrónico ya está en uso, verifíquelo.');
            break;
          case 'auth/invalid-email':
            setAlerta('El formato del correo electrónico no es válido.')
           
        }
      }
    }
    else {
      try {
        //  Usamos firebase para iniciar sesión
        await signInWithEmailAndPassword(auth, email, pass)
      }
      catch (error) {
        //  Manejamos los distintos errores que se puedan dar en el login
        switch (error.code) {
          case 'auth/missing-password' :
            setAlerta('Por favor, ingrese la contraseña.');
            break;
          case 'auth/invalid-credential':
            setAlerta('El correo elecrrónico o la contraseña son incorrectos.')
            break;
          case 'auth/invalid-email' :
            setAlerta('El correo electrónico no es válido, verifíquelo.');
            break;
        }
        
      }
    }
  }


  return (
    <div className="container">
      <div className="row align-items-center height 100%">
        <div className="col-md-4">
          <div className="padre">
            <div className="card card-body shadow">
              <form onSubmit={authentic}>
                <center>
                  <h4 className="text-login">
                    {change
                      ? "Regístrate con tu correo electrónico"
                      : "Inicia sesión con tu correo electrónico"}
                  </h4>
                  <input
                    type="email"
                    placeholder="example@example.com"
                    className="input-text"
                    id="email"
                    autoComplete="off"
                    onSelect={()=> setAlerta(null)}
                  />

                  <textfield class="input-group-text input-text">
                    <input
                      type={icono ? "password" : "text"}
                      class="custom-transparent-input"
                      placeholder="password"
                      id="password"
                      onSelect={()=> setAlerta(null)}
                    />
                    <i
                      class={icono ? "bi bi-eye" : "bi bi-eye-slash"}
                      type="button"
                      onClick={() => setIcono(!icono)}
                    ></i>
                  </textfield>
                  { alerta?
                    <p><font color="red">{alerta}</font></p>
                    :
                    null
                  }

                  <button
                    className="button-login"
                    onClick={() => {
                      console.log("Damos un click");
                    }}
                  >
                    {change ? "Registrarse" : "Ingresar"}
                  </button>
                </center>
              </form>
              <center>
                <h6>
                  {!change
                    ? "¿Aún no tienes cuenta? "
                    : "¿Ya tienes una cuenta?"}
                </h6>
                <button
                  className="button-switch"
                  onClick={() => setChange(!change)}
                >
                  {change ? "Iniciar sesión" : "Regístrate"}
                </button>
              </center>


            </div>
          </div>
        </div>
        <div className="col-md-8">
          <img src="/src/assets/portada.png" alt="" className="image" />
        </div>
      </div>
    </div>
  );
}

export default Login
