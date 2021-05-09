import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import axios from "axios";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { personCircle } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { IonItem, IonLabel, IonInput, IonButton, IonIcon, IonAlert } from '@ionic/react';

// function validateUsername(username: string) {
//     const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
//     return re.test(String(username).toLowerCase());
// }
const Login: React.FC = () => {
  // localStorage.setItem("usuario_activo", "null");
  const baseURL = 'http://localhost:3525'
  const history = useHistory();
  const [username, setusername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const handleLogin = () => {
    if (!username) {
        setMessage("¡Tu usuario esta incorrecto!");
        setIserror(true);
        return;
    }
    // if (validateUsername(username) === false) {
    //     setMessage("¡Usuario invalido!");
    //     setIserror(true);
    //     return;
    // }

    if (!password || password.length < 6) {
        setMessage("Por favor ingresa la contraseña correcta.");
        setIserror(true);
        return;
    }

    const loginData = {
        "username": username,
        "password": password
    }
    
    const api = axios.create({
        baseURL: `http://3.142.98.140:3525/`
    })
    // Cognito
    api.post("login", loginData)
    .then(res => {
        var auth_response = res.data.autentication;  
        // console.log(res.data);
        if(auth_response == "true"){
          // localStorage.setItem('usuario_activo', username);
          // history.push("/dashboard/" + username);
        }else{
          setMessage("¡Verifica tu correo primero!");
          setIserror(true)
        }
     })
     .catch(error=>{
        setMessage("¡Ocurrio un error!");
        setIserror(true)
     })

    // BD
    api.post("login2", loginData)
        .then(res => {
            var auth_response = res.data.autentication;  
            // console.log(res.data);
            if(auth_response == "true"){
              localStorage.setItem('usuario_activo', username);
              history.push("/dashboard/" + username);
            }else{
              setMessage("¡Credenciales incorrectas!");
              setIserror(true)
            }
         })
         .catch(error=>{
            setMessage("¡Ocurrio un error!");
            setIserror(true)
         })
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding ion-text-center">
        <IonGrid>
        <IonRow>
          <IonCol>
            <IonAlert
                isOpen={iserror}
                onDidDismiss={() => setIserror(false)}
                cssClass="my-custom-class"
                header={"¡Error!"}
                message={message}
                buttons={["Cerrar"]}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonIcon
                style={{ fontSize: "70px", color: "#0040ff" }}
                icon={personCircle}
            />
          </IonCol>
        </IonRow>
          <IonRow>
            <IonCol>
            <IonItem>
            <IonLabel position="floating"> Username </IonLabel>
            <IonInput
                type="text"
                value={username}
                onIonChange={(e) => setusername(e.detail.value!)}
                >
            </IonInput>
            </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
            <IonItem>
              <IonLabel position="floating"> Contraseña </IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
                >
              </IonInput>
            </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <p style={{ fontSize: "small" }}>
                  Al presionar "Iniciar sesión" aceptas nuestra <a href="#">Politica de privacidad</a>
              </p>
              <IonButton expand="block" onClick={handleLogin}>Iniciar sesión</IonButton>
              <p style={{ fontSize: "medium" }}>
                  ¿No tienes cuenta? <a href="registro">¡Registrate!</a>
              </p>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;