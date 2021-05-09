import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonPage, IonFab, IonFabButton, IonRow, IonTitle, IonToolbar, IonIcon, IonInput, IonItem, IonLabel, IonAlert, IonItemOption, IonItemOptions, IonItemSliding, IonList, IonSelect, IonSelectOption } from '@ionic/react';
import axios from 'axios';
import { useHistory, RouteComponentProps } from "react-router-dom";
import { camera, closeCircle } from 'ionicons/icons';
import React, { useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {

  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [etiquetasA, setEtiquetasA] = useState<string>("");
  const [descripcionA, setDescripcionA] = useState<string>("");
  const [manualidadesA, setManualidadesA] = useState<string>("");
  const [idioma, setIdioma] = useState<string>();
  const [idiomaElegido, setIdiomaElegido] = useState<string>();
  // const etiquetas = "";

  var user_data = localStorage.getItem("user_data")
  // console.log(user_data)
  var user = "";
  var img = "";
  if(user_data != null){
    var user_actual = JSON.parse(user_data);
    user = user_actual.username;
    img = user_actual.img;
    // console.log(img)
  }
  const history = useHistory();
  var etiquetas = "";
  var descripciones = "";
  var manualidades = "";

  const handleAnalizar = () => {
    const analizarData = {
      "foto": img
    }
  
  const api = axios.create({
      baseURL: `http://localhost:3525/`
  })

  function descripcion(tags: string | string[]){
    var tipo_material = "";

    if(tags.includes('Bottle') || tags.includes('Perfume') || tags.includes('Beverage') || tags.includes('Glass'))
    {
      tipo_material = "Vidrio"
      descripciones = "El vidrio es inorgánico y puede ser reciclado tantas veces como sea posible, dado que, no pierde características ni propiedades, ya que en la naturaleza puede tardar hasta 4000 años en destruirse. Además puede ser usado para almacenar bebidas o alimentos ya que no altera su sabor."
      manualidades = "https://ar.pinterest.com/marcezanetti/reciclado-vidrio/"
    } else if(tags.includes('Plastic'))
    {
      tipo_material = "Plastico"
      descripciones = "El plástico es inorgánico y uno de los desechos sólidos que más abundan ya que muchos son de un solo uso lo que significa “usar y tirar” es conveniente llevar las botellas de bebidas, envases de cosméticos, bolsas, etc. a un lugar donde puedan ser clasificados según su tipo y transformados de manera que no estén contaminando la flora y fauna del planeta."
      manualidades = "https://ar.pinterest.com/marcezanetti/reciclado-vidrio/"
    } else if(tags.includes('Carton') || tags.includes('Box') || tags.includes('Cylinder'))
    {
      tipo_material = "Cartón"
      descripciones = "El cartón es inorgánico y  debe llevarse a un centro de recolección y lo más limpio posible para evitar procesos largos de recuperación del material. \nPor cada tonelada de cartón que se recicla se ahorran 140 litros de petróleo, cincuenta mil litros de agua y 900 kilos de dióxido de carbono (CO2), el principal causante del cambio climático, frente a lo que requiere fabricar una tonelada de cartón nuevo."
      manualidades = "https://www.pinterest.es/search/pins/?q=reciclaje%20de%20carton&rs=typed&term_meta[]=reciclaje%7Ctyped&term_meta[]=de%7Ctyped&term_meta[]=carton%7Ctyped"
    } else if(tags.includes('Aluminium') || tags.includes('Can') || tags.includes('Canned Good'))
    {
      tipo_material = "Lata"
      descripciones = "Las latas son inorganicas y una vez usadas y desechadas, han de depositarse en los contenedores de color amarillo de las ciudades. Estos contenedores son los que muchos conocen como contenedores para envases y plástico. Estos materiales son fáciles de fundir por lo mismo cuando llegan a las grandes plantas de reciclaje, se separan las impurezas, se funden y se convierten en otras piezas."
      manualidades = "https://www.pinterest.es/search/pins/?rs=ac&len=2&q=reciclaje%20de%20latas%20de%20aluminio&eq=reciclaje%20de%20latas&etslf=7852&term_meta[]=reciclaje%7Cautocomplete%7C1&term_meta[]=de%7Cautocomplete%7C1&term_meta[]=latas%7Cautocomplete%7C1&term_meta[]=de%7Cautocomplete%7C1&term_meta[]=aluminio%7Cautocomplete%7C1"
    } else if(tags.includes('Newspaper') || tags.includes('Paper') || tags.includes('Text') || tags.includes('Page'))
    {
      tipo_material = "Papel"
      descripciones = "El papel es orgánico, puede deshacerse fácilmente en la naturaleza aunque muchas veces como llevan tinta esto hace que se contamine el suelo, el papel está compuesto principalmente de celulosa de árboles jóvenes, por lo que la producción de papel representa un 35% de la tala de árboles a nivel mundial, he allí la importancia de reciclar el papel que usamo."
      manualidades = "https://www.pinterest.es/search/pins/?q=reciclaje%20de%20papel&rs=typed&term_meta[]=reciclaje%7Ctyped&term_meta[]=de%7Ctyped&term_meta[]=papel%7Ctyped"
    } else {
      tipo_material = "Desconocido"
      descripciones = "Material no reconocido."
      manualidades = "https://plantillasdememes.com/img/plantillas/a-sos-re-troll11604026694.jpg"
      setMessage("No se reconocio el material, vuelve a intentarlo.");
      setIserror(true)
    }
    
    console.log(descripciones);
    setDescripcionA(descripciones);
    setManualidadesA(manualidades)
    
  }
  

  api.post("analizarBasura", analizarData)
    .then(res => {
        var texto = res.data.texto;  
        console.log(res.data.texto);
        console.log(texto.length)
        if(texto.length > 0){
          // texto.forEach(e => {
          //   etiquetas += e.Name;
          // });
          for (let index = 0; index < texto.length; index++) {
            const element = texto[index].Name;
            etiquetas += element + ", ";
          }
          console.log(etiquetas);
          descripcion(etiquetas);
          setEtiquetasA(etiquetas);
          // $('#id_etiquetas').text(etiquetas);
          // if(etiquetas != ""){
          //   document.getElementById('id_etiquetas').textContent;
          // }
          setMessage("¡Se ha completado el analisis!");
          setIserror(false)
        }        
      })
      .catch(error=>{
        setMessage("¡Ocurrio un error!");
        setIserror(true)
      })

      
  };

  const handleSubir = () => {
    const subirData = {
      "username": user,
      "foto": img
    }
  
  const api = axios.create({
      baseURL: `http://localhost:3525/`
  })
  api.post("subirFoto", subirData)
    .then(res => {
        // var auth_response = res.data.autentication;  
        // console.log(res.data);
        
        setMessage("¡Se ha guardado la imagen en tu cuenta!");
        setIserror(true)
        
      })
      .catch(error=>{
        setMessage("¡Ocurrio un error!");
        setIserror(true)
      })
  };
 
  const handleTraducir = () => {
    console.log("Idioma elegido: ", idioma)
    const traducirData = {
      "descripcion": descripcionA,
      "idioma": idioma
    }
    console.log(JSON.stringify(traducirData));
  const api = axios.create({
      baseURL: `http://localhost:3525/`
  })
  api.post("traducirDescripcion", traducirData)
    .then(res => {
        var traduccion = res.data.message.TranslatedText;  
        console.log(res.data);
        setDescripcionA(traduccion);
        setMessage("¡Se ha traducido la descripción correctamente!");
        setIserror(true)
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
          <IonRow>
            <IonCol>
              <IonTitle onClick={() => {
                    history.push("/dashboard/" + user);
                  }}>Imagen</IonTitle>
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
              <IonAlert
                  isOpen={iserror}
                  onDidDismiss={() => setIserror(false)}
                  cssClass="my-custom-class"
                  header={"¡Muy bien!"}
                  message={message}
                  buttons={["Aceptar"]}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonImg src={img}></IonImg>
                <IonButton expand="block" onClick={handleSubir}>Guardar imagen</IonButton>
                <IonButton expand="block" onClick={handleAnalizar}>Analizar imagen</IonButton>
              </IonItem>
              
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
            <IonItem>
                <IonLabel position="floating"> Etiquetas </IonLabel>
                <IonInput
                  type="text"
                  value={etiquetasA}
                  readonly
                  onIonChange={(e) => setEtiquetasA(e.detail.value!)}
                  >
                </IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating"> Clasificación </IonLabel>
                <IonInput
                  type="text"
                  value={descripcionA}
                  readonly
                  onIonChange={(e) => setDescripcionA(e.detail.value!)}
                  >
                </IonInput>
                <IonButton expand="block" onClick={handleTraducir}>Traducir</IonButton>
              </IonItem>
              <IonItem>
                <IonItem>
                  <IonLabel>Idioma</IonLabel>
                  <IonSelect value={idioma} placeholder="Elige un idioma a traducir:" onIonChange={e => setIdioma(e.detail.value)}>
                    <IonSelectOption value="en">Inglés</IonSelectOption>
                    <IonSelectOption value="it">Italiano</IonSelectOption>
                    <IonSelectOption value="pt">Portugués</IonSelectOption>
                    <IonSelectOption value="de">Alemán</IonSelectOption>
                    <IonSelectOption value="fr">Fránces</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              {/* <IonItem>
               
              </IonItem> */}
              <p></p>
              <a href={manualidadesA} target='_blank'>Manualidades sugeridas</a>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;

