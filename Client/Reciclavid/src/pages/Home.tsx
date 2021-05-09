import { IonCol, IonContent, IonGrid, IonHeader, IonImg, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  var imagen_data = localStorage.getItem('imagen_data')
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Imagen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Imagen seleccionada</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonImg src={imagen_data.img}></IonImg>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
