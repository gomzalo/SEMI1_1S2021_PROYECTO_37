import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import axios from "axios";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { personCircle } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { IonItem, IonLabel, IonInput, IonButton, IonIcon, IonAlert } from '@ionic/react';

function validateEmail(email: string) {
    const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
    return re.test(String(email).toLowerCase());
}
const Registro: React.FC = () => {
  
  const history = useHistory();
  const [nombre, setNombre] = useState<string>("Tepo kun");
  const [email, setEmail] = useState<string>("eve.holt@reqres.in");
  const [username, setUsername] = useState<string>("Teposad");
  const [password, setPassword] = useState<string>("pistol");
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const handleRegistro = () => {
    if (!email) {
        setMessage("¡Correo invalido!");
        setIserror(true);
        return;
    }
    if (validateEmail(email) === false) {
        setMessage("¡Tu correo esta incorrecto!");
        setIserror(true);
        return;
    }

    if (password.length < 6) {
        setMessage("Ingresa una contraseña válida");
        setIserror(true);
        return;
    }

    const registroData = {
        "username": username,
        "nombre": nombre,
        "email": email,
        "password": password
    }

    const api = axios.create({
        baseURL: `http://localhost:3525/`
    })
    api.post("/registro2", registroData)
        .then(res => {
            localStorage.setItem("usuario_activo", username);           
            history.push("/dashboard/" + username);
         })
         .catch(error=>{
            setMessage("¡Error! Por favor crea una cuenta.");
            setIserror(true)
         })
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro</IonTitle>
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
                header={"Error!"}
                message={message}
                buttons={["Dismiss"]}
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
            <IonLabel position="floating"> Nombre</IonLabel>
            <IonInput
                type="text"
                value={nombre}
                onIonChange={(e) => setNombre(e.detail.value!)}
                >
            </IonInput>
            </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
            <IonItem>
            <IonLabel position="floating"> Usuario</IonLabel>
            <IonInput
                type="text"
                value={username}
                onIonChange={(e) => setUsername(e.detail.value!)}
                >
            </IonInput>
            </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
            <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
                type="email"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                >
            </IonInput>
            </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
            <IonItem>
              <IonLabel position="floating"> Password</IonLabel>
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
              <IonButton expand="block" onClick={handleRegistro}>Registrarme</IonButton>
              <p style={{ fontSize: "medium" }}>
                  ¿Ya tienes una cuenta? <a href="login">¡Inicia sesión!</a>
              </p>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Registro;