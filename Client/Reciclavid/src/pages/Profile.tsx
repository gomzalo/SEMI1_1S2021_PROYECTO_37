import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
         IonItemDivider, IonFab, IonFabButton, IonIcon,
         IonImg, IonActionSheet, IonList, IonThumbnail} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useHistory, RouteComponentProps } from "react-router-dom";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { IonItem, IonLabel, IonAvatar } from '@ionic/react';

import { camera, trash, close } from 'ionicons/icons';

//Importando hook galeria
import { usePhotoGallery } from '../hooks/usePhotoGallery';
interface ResetProps
  extends RouteComponentProps<{
    id: string;
  }> {}

type Item = {
  src: string;
  text: string;
};
const items: Item[] = [{ src: 'http://placekitten.com/g/200/300', text: 'a picture of a cat' }];

const Dashboard: React.FC<ResetProps> = ({ match }) => {
  const history = useHistory();
  const { photos, takePhoto } = usePhotoGallery();
  const [users, setUsers] = useState<Array<any>>([]);
  useEffect(() => {
    const api = axios.create({
        baseURL: `https://reqres.in/api`
    })
    api.get("/users")
        .then(res => {             
            setUsers(res.data.data)
        })
        .catch(error=>{
            console.log("Error fetching data")
        })
  }, [])
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Galeria</IonTitle>
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
                  var imagen_data = {
                    username: "test",
                    img: photo.webviewPath
                  }
                  
                  localStorage.setItem('imagen_data', JSON.stringify(imagen_data));
                  // console.log(JSON.stringify(imagen_data));
                  history.push("/home/" + );
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