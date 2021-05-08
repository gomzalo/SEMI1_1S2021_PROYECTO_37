import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
         IonItemDivider, IonFab, IonFabButton, IonIcon,
         IonImg, IonActionSheet} from '@ionic/react';
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
          
          {/* <IonRow>
              <IonCol>
                <IonFab vertical="bottom" horizontal="center" slot="fixed">
                  <IonFabButton onClick={() => takePhoto()}>
                    <IonIcon icon={camera}></IonIcon>
                  </IonFabButton>
                </IonFab>
                  <IonItemDivider></IonItemDivider>
              </IonCol>
          </IonRow> */}
         
          {/* <IonRow>
            <IonCol>
              {users.map((user, i) => {
                return (
                  <IonItem key={i}>
                    <IonAvatar>
                        <img src={user.avatar} />
                    </IonAvatar>
                    <IonLabel>
                        <h2 style={{ paddingLeft: "10px" }}>{user.first_name + " " + user.last_name} </h2>
                        <p style={{ paddingLeft: "10px" }}>{user.email}</p>
                    </IonLabel>
                  </IonItem>
                );
              })}
            </IonCol>
          </IonRow> */}

          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" key={index}>
                <IonImg src={photo.webviewPath} />
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