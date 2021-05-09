import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
         IonItemDivider, IonFab, IonFabButton, IonIcon,
         IonImg, IonActionSheet, IonList, IonThumbnail, useIonViewDidEnter} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useHistory, RouteComponentProps } from "react-router-dom";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { IonItem, IonLabel, IonAvatar } from '@ionic/react';

import { camera, trash, close, closeCircle } from 'ionicons/icons';

//Importando hook galeria
import { usePhotoGallery } from '../hooks/usePhotoGallery';
interface ResetProps
  extends RouteComponentProps<{
    id: string;
  }> {}

// type Item = {
//   src: string;
//   text: string;
// };
// const items: Item[] = [{ src: 'http://placekitten.com/g/200/300', text: 'a picture of a cat' }];

const Dashboard: React.FC<ResetProps> = ({ match }) => {
  useIonViewDidEnter(() => {
    console.log('ionViewDidEnter event fired');
    var usuario_activo = localStorage.getItem("usuario_activo");
    // usuario_activo = JSON.parse(usuario_activo);
    console.log(usuario_activo);
    // var usuario =  usuario_activo.username
  });
  
    const history = useHistory();
    const { photos, takePhoto } = usePhotoGallery();
    const [users, setUsers] = useState<Array<any>>([]);
    const [iserror, setIserror] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
          <IonRow>
            <IonCol>
              <IonTitle>Galeria</IonTitle>
            </IonCol>
            <IonCol>
              <IonFab vertical="center" horizontal="end">
                <IonFabButton onClick={() => {
                    history.push("/login");
                  }}>
                  <IonIcon icon={closeCircle}></IonIcon>
                </IonFabButton>
              </IonFab>
            </IonCol>
          </IonRow>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding ion-text-center">
          <IonRow>
              <IonCol>
                  <h4>Bienvenido: {match.params.id}</h4>
                  <IonItemDivider></IonItemDivider>
              </IonCol>
          </IonRow>
          <IonGrid>
            <IonRow>
              {photos.map((photo, index) => (
                <IonCol size="6" key={index}>
                  <IonImg src={photo.webviewPath} onClick={() => {
                    var user_data = {
                      username: match.params.id,
                      img: photo.webviewPath
                    }
                    
                    localStorage.setItem('user_data', JSON.stringify(user_data));
                    // console.log(JSON.stringify(imagen_data));
                    history.push("/home/");
                  }}/>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
          <IonFab vertical="bottom" horizontal="center" slot="fixed">
            <IonFabButton onClick={() => takePhoto()}>
              <IonIcon icon={camera}></IonIcon>
            </IonFabButton>
          </IonFab>
        </IonContent>
      </IonPage>
    );
  
};

export default Dashboard;