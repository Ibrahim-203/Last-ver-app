import SideBar from '../component/SideBar';
import Header from '../component/Header';
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import offlineIrrad from '../utils/irradiation.json'
import madaJson from '../utils/mg.json'
import { Icon } from '@iconify-icon/react';

import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
  GeoJSON
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { layerGroup } from "leaflet";
import {
  Tabs,
  InputNumber,
  Loader,
  Toggle,
} from "rsuite";
import { useAppContext } from '../context/AppContext';
import { formConsoOnduleur } from '../utils/formule'
import Swal from 'sweetalert2'
import NavButton from '../component/NavButton';
import axios from 'axios';
import MyModal from '../component/MyModal';

// Fix pour le chemin des icônes par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const cities = {
  "Nord": [-12.2833, 49.3] ,
  "Est" : [-21, 47.4023] ,
  "Centre" : [-18.8792, 47.5079],
  "Ouest" : [-15.7167, 46.3167] ,
  "Sud" :  [-23.35, 43.6667] 
};

const Home = () => {
  const navigate = useNavigate();

  const {
    nomProjet,
    setNomProjet,
    productionUnitPanel,
    setProductionUnitPanel,
    installation, 
    setInstallation,
    position, 
    setPosition,
    productionInstallation,
    setProductionInstallation,
    installationInfo, 
    setInstallationInfo,
    onduleur,
    setOnduleur,
    checked,
    setChecked,
    localisation, 
    setLocalisation,
    puissanceTotalInstallation, 
    setPuissanceTotalInstallation,
    infoOnduleur, 
    setInfoOnduleur,
    setInfoBatt,
    dataEns, 
    setDataEns,
    setEnsBatt,
    ensBatt,
    offline, setOffline
    // Ajoute d'autres valeurs ou fonctions ici si nécessaire
  } = useAppContext();

  // Offline variables
  const [selectedCity, setSelectedCity] = useState(null);
  const [regionsStyle, setRegionsStyle] = useState({});
  const [selectedRegion, setSelectedRegion] = useState(null);



  const updateNetworkStatus = () => {
    setOffline(!navigator.onLine);
    setPosition(null)
  };
  const handleFragClick = (city) => {
   const res =  offlineIrrad[city].monthly;
   const res_hour = offlineIrrad[city].daily;

   let hourIrradValue = Array(24).fill(0) 
    let hourIrradlabel = Array(24).fill(0)
    
    res_hour.forEach((item,id)=>{
      hourIrradlabel[id] = item.time
      hourIrradValue[id] = item['G(i)']
    })


   setDataEns(res.map((r) => r["H(i_opt)_m"]));
   setEnsBatt(prevState=>{
    const newInfo = {...prevState};
    newInfo.label = hourIrradlabel;
    newInfo.ens = hourIrradValue;
    return newInfo
    })
    setSelectedCity(city);
  };
  // Mise à jour de la valeur du status
  useEffect(() => {
    // Ajouter des écouteurs pour les événements `online` et `offline`
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Nettoyer les écouteurs lors du démontage du composant
    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  const onEachRegion = (feature, layer) => {

     const regionId = feature.properties.region;
    const currentStyle = regionsStyle[regionId] || {
      fillColor: 'green', // Couleur de remplissage par défaut
      fillOpacity: 0.5,
      color: 'black',     // Couleur du contour par défaut
      weight: 1           // Épaisseur du contour par défaut
    };
    layer.setStyle(currentStyle)
    layer.on({
      click: () => {
        setPosition({ lat :cities[feature.properties.region][0], lng :cities[feature.properties.region][1] });
        setLocalisation({latitude :cities[feature.properties.region][0], longitude :cities[feature.properties.region][1] })
        handleFragClick(feature.properties.region)
      }
    });
  };

  // Offline 
useEffect(()=>{
  console.log(position);
  
},[position])

  const [alertPanel, setAlertPanel] = useState(null)


  const customAlert = (title, content)=>{
    return Swal.fire({
      title: title,
      text: content,
      confirmButtonText: 'Ok',
      backdrop: 'swal2-backdrop-hide',
      buttonsStyling : false,
      height:"60px",
      confirmButtonColor:"orange",
      customClass: {
        title: 'modal_title',
        htmlContainer:'modal_text',
        confirmButton :"modal_confirm_button"
      }
    })
  }
  const mois = ['jan','fev','mars','avr','mai','jiun','juil','août','sept','oct','nov','dec']



    
  useEffect(()=>{
    console.log(dataEns);
    console.log(ensBatt);
  },[dataEns])

  const [manualIrrad, setManualIrrad] = useState(Array(12).fill(0))

  const validateInstallationStep= ()=>{

    let installationTotal = 0  
        let puissanceTotal = []
        let VOC = []
        let ISC = []
        let totalPanel = 0
        // Verifier si l'utilisateur veux entrer une puissance de l'onduleur
        let empty = false;
        let emptyLoc = false;
        let message = ""
        if (checked) {
            if (
              parseInt(onduleur) === 0
            ) {
              empty = true;
              message = "La puissance de l'onduleur ne peux pas être 0"
              
            }else{
              const newInfo = [...infoOnduleur]
              newInfo[0].resultat.puissanceOnduleur = onduleur
              newInfo[0].resultat.consoOnduleur = formConsoOnduleur(onduleur)
              setInfoOnduleur(newInfo)
              setPuissanceTotalInstallation(onduleur)
              return true
            }
        } else {
          // Choix installation
          if(localisation.latitude === 0 ||
            localisation.longitude === 0){
              emptyLoc = true
              console.log("loc vide");
            }
            
            let puissanceInstallation = Array(12).fill(0)
            installation.forEach((item,index) => {
            let puissanceUnitaire = Array(12).fill(0)
            if (
              item.orientation === "" ||
              item.puissInstallation === "" ||
              item.puissUnit === "" ||
              item.rendement === "" ||
              item.surface ==="" ||
              item.panelS ==="" ||
              item.panelP ==="" ||
              item.courantISC ==="" ||
              item.tensionVOC ==="" 
            ) {
              empty = true;
              message = "Veillez vous assurer que tous les champs de l'installation sont bien remplis";
            }else{
              const rendement = parseFloat(item.rendement/100)
              const surface = parseFloat(item.surface)
              const panelP = parseFloat(item.panelP)
              const panelS = parseFloat(item.panelS)
              installationTotal+=parseInt(item.puissInstallation)
              dataEns.forEach((it, id)=>{
                puissanceUnitaire[id] = it*(rendement)*surface*(panelP+panelS)
              })
             totalPanel += rendement*surface*(panelP+panelS)
             console.log("installation", index, " : ",rendement,surface,panelP,panelS);
            
             puissanceUnitaire.forEach((item, id)=>{
              puissanceInstallation[id] += item
             })  
             VOC.push(item.tensionVOC*item.panelS)
             ISC.push(item.courantISC*item.panelP)
             puissanceTotal.push(puissanceUnitaire)    
            }

          });
          setInfoBatt(prevState => {
          
            // Crée une copie de prevState et modifie la propriété en conséquence
            const newState = [...prevState]; // Copie du tableau
            const newResultat = { ...newState[0].resultat }; // Copie de l'objet resultat
          
            // Applique les modifications en fonction de installationTotal
            if (installationTotal > 0 && installationTotal < 500) {
              newResultat.tensionBatt = 12;
            } else if (installationTotal >= 500 && installationTotal < 2000) {
              newResultat.tensionBatt = 24;
            } else {
              newResultat.tensionBatt = 48;
            }
          
            // Remet à jour la copie avec le nouveau resultat
            newState[0] = { ...newState[0], resultat: newResultat };
          
            return newState; // Retourne le nouvel état mis à jour
          });
          totalPanel = parseFloat(totalPanel.toFixed(3))
          setInstallationInfo(prevState=>{
            const newInfo = {...prevState};
            newInfo.VOC = VOC;
            newInfo.ISC = ISC;
            newInfo.totalPanel = totalPanel;
            return newInfo;
          })
          setProductionInstallation(puissanceInstallation);
          setProductionUnitPanel(puissanceTotal);
          setPuissanceTotalInstallation(installationTotal)
          console.log(installationTotal);
        }
        if (emptyLoc) {
          customAlert("Données manquant", "Veillez choisir une emplacement")
          return 
        }
  
        if (empty) {
          customAlert("Données manquant", message)
          return false
        }
        return true
  }
    // Variable pour le panneau solaire
    const [loading, setLoading] = useState(false)
    const [isDataGet, setIsDataGet] = useState(false)
    const [activeKey, setActiveKey] = useState(1);
    const onChecked = (value) => {
      setChecked(value);
      
      setInstallation([
        {
          orientation: "",
          puissInstallation: "",
          puissUnit: "",
          rendement: "",
          surface:"",
          courantISC:"",
          tensionVOC:"",
          panelS:"",
          panelP:""
        },
          ])
    };
    
    const handleChange = (index, event) => {
      const { name, value } = event.target;
      if (!checked) {
        const newInstallation = [...installation];
        if(name === "panelS" && value){
          setAlertPanel(null)
          const nbrPanel = newInstallation[index].puissInstallation/newInstallation[index].puissUnit
          const valPanelP = nbrPanel/value
          if(Number.isInteger(valPanelP)){
            newInstallation[index].panelP = valPanelP
          }else{
            setAlertPanel(`Veillez Choisir un nombre qui divise ${nbrPanel}`)
            newInstallation[index].panelP = ""
            
          }
          
        }
        newInstallation[index][name] = value;
        setInstallation(newInstallation);
      } else {
        setOnduleur(value);
      }
    };
    // valeur défaut
    // Variable pour le panneau solaire


      // Func-Equipement

      const getInfoIrrad = async (localisation) => {
        if (localisation.latitude !== 0 && localisation.longitude !== 0) {
          try {
            const response = await axios.get("http://localhost:3001/proxy/pvcalc", {
              params: localisation,
            });
            const res = response.data.outputs.monthly;
            setIsDataGet(true)
            setDataEns(res.map((r) => r["H(h)_m"]));
            // Kwh/m2
          } catch (error) {
            console.error("Erreur lors de l'appel API", error);
            alert("Erreur lors de la communication au server, veillez verifiez votre connection internet ou entrer manuelement l'irradiation.")
          }finally{
            setLoading(false)
          }
        }
      };
      const getInfohourIrrad = async (localisation) => {
        if (localisation.latitude !== 0 && localisation.longitude !== 0) {
          try {
            const response = await axios.get("http://localhost:3001/proxy/hour", {
              params: localisation,
            });
            let hourIrradValue = Array(24).fill(0) 
            let hourIrradlabel = Array(24).fill(0)
            const res = response.data.outputs.daily_profile;
            
            res.forEach((item,id)=>{
              hourIrradlabel[id] = item.time
              hourIrradValue[id] = item['G(i)']
            })
            setEnsBatt(prevState=>{
            const newInfo = {...prevState};
            newInfo.label = hourIrradlabel;
            newInfo.ens = hourIrradValue;
            return newInfo
            })
            
            
          } catch (error) {
            console.error("Erreur lors de l'appel API", error);
          }
        }
      };

      useEffect(() => {
        if(!offline){
        getInfoIrrad(localisation);
        console.log("here");
        getInfohourIrrad(localisation)
        }

      }, [localisation]);
      const deleteInstallation = (index) => {
        const newInstallation = installation.filter((_, i) => i !== index);
        setInstallation(newInstallation);
        setActiveKey(installation.length - 1);
    };
    const handleClick = () => {
      // Navigue vers la page 'About'
      if(!validateInstallationStep()){
        console.log(validateInstallationStep());
        
        return
      } 
      navigate('/calc-conso');
    };
    const addInstallation = useCallback(() => {
      if (installation.length < 5) {
        setInstallation([
          ...installation,
          {
            orientation: "",
            puissInstallation: "",
            puissUnit: "",
            rendement: "",
            surface:"",
            courantISC:"",
            tensionVOC:"",
            panelS:"",
            panelP:""
          },
        ]);
        setActiveKey(installation.length + 1);
      }
    
  }, [installation, checked]);
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setLoading(true)
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        setLocalisation({ latitude: lat, longitude: lng });
      },
    });
    return null;
  };
  // Func-Equipement
    return (
      <>
    <div className= "page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
    data-sidebar-position="fixed" data-header-position="fixed">
    {/* Sidebar Start */}
      <SideBar/>
    {/*  Sidebar End */}
    {/*  Main wrapper */}
    <div className= "body-wrapper">
      {/*  Header Start */}
      <Header step={"Installation solaire"}/>
      
      {/*  Header End */}
      <div className= "container-fluid pb-1">
      {offline  ? <p className='d-flex align-items-center'><Icon icon="icon-park-outline:dot" style={{fontSize: "2rem", color:"orange"}}/> Hors ligne</p>:
      <p className='d-flex align-items-center'><Icon icon="icon-park-outline:dot" style={{fontSize: "2rem", color:"green"}}/> En ligne</p>
      }
        <div className='card p-2' >
      <div className=" d-md-flex align-items-center justify-content-between m-1">
            <div className="me-3">
                  <div className="form-group d-flex align-items-center ">
                    <label className="col-form-label">Nom du projet</label>
                    <div className="ms-2">
                      <input
                        type="text"
                        className="form-control "
                        value={nomProjet}
                        onChange={(event)=>setNomProjet(event.target.value)}
                      />
                    </div>
                  </div>
            </div>

            <div className="mt-sm-2 mb-sm-2">
              <Toggle checked={checked} onChange={(value) => onChecked(value)}>
                Utiliser la puissance de l'onduleur
              </Toggle>
            </div>
          </div>
          <div className="row mb-1">
            <div className="col-md-4 col-sm-12" style={{position:"relative"}}>
                    {loading && <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      zIndex: 1000,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                    <Loader size="lg" />
                  </div>}
              <MapContainer
                center={[-18.968, 47.546]} // Position initiale (Londres)
                zoom={5}
                style={{ height: "400px" }}
              >
                      {!offline ? (
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                    ) : (
                      <GeoJSON data={madaJson} onEachFeature={onEachRegion}/> // Charger les données GeoJSON pour le mode hors ligne
                    )}
                {/* <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                /> */}
                
                {/* Desactiver le click du map en offline */}
                {!offline && <MapEvents />}
                {position && (
                  <Marker position={[position.lat, position.lng]}>
                    <Popup>
                      Latitude: {position.lat}, Longitude: {position.lng}
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
            <div className="col-sm-12 col-md-7">
            <div className='d-flex'>
                <div className='me-3 mt-sm-2'>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="latitude"
                    value={localisation.latitude}
                    disabled
                  />
                </div>                  
                <div className='mt-sm-2'>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="longitude"
                    value={localisation.longitude}
                    disabled
                  />
                </div>
            </div>
              <Tabs
                activeKey={`${activeKey}`}
                onSelect={(k) => (k !== "add" ? setActiveKey(k) : "")}
                horizontal="true"
                appearance="tabs"
                className="mt-3"
              >
                {!checked &&
                  installation.map((item, index) => (
                    <Tabs.Tab
                      key={index}
                      eventKey={`${index + 1}`}
                      title={`Installation ${index + 1}`}
                    >
                      <div className="text-right">
                        
                      </div>
                      <div className="row">
                        <div className="col-md-6 col-lg-4 col-sm-6 mb-3">
                          <div className="form-group">
                            <label htmlFor="orientation" className='mb-2'>Orientation</label>
                            <InputNumber
                              size="sm"
                              onChange={(value, event) =>
                                handleChange(index, event)
                              }
                              value={item.orientation}
                              id="orientation"
                              name="orientation"
                              placeholder="en °"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-4 col-sm-6 mb-3">
                          <div className="form-group">
                            <label htmlFor="puissInstallation" className='mb-2'>Puissance souhaitée</label>
                            <InputNumber
                              size="sm"
                              onChange={(value, event) =>
                                handleChange(index, event)
                              }
                              value={item.puissInstallation}
                              id="puissInstallation"
                              name="puissInstallation"
                              placeholder="en Wc"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-4 col-sm-6 mb-3">
                          <div className="form-group">
                            <label htmlFor="puissanceUnit" className='mb-2'>
                              Puissance unitaire
                            </label>
                            <InputNumber
                              size="sm"
                              onChange={(value, event) =>
                                handleChange(index, event)
                              }
                              value={item.puissUnit}
                              id="puissUnit"
                              name="puissUnit"
                              placeholder="en Wc"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-4 col-sm-6 mb-3">
                          <div className="form-group">
                            <label htmlFor="rendement" className='mb-2'>Rendement du panneau</label>
                            <InputNumber
                              size="sm"
                              onChange={(value, event) =>
                                handleChange(index, event)
                              }
                              value={item.rendement}
                              id="rendement"
                              name="rendement"
                              placeholder="en %"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-4 col-sm-6 mb-3">
                          <div className="form-group">
                            <label htmlFor="surface" className='mb-2'>Surface du panneau</label>
                            <InputNumber
                              size="sm"
                              onChange={(value, event) =>
                                handleChange(index, event)
                              }
                              value={item.surface}
                              id="surface"
                              name="surface"
                              placeholder="m x m"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-4 col-sm-6 mb-3">
                          <div className="form-group">
                            <label htmlFor="courantISC" className='mb-2'>Courant ISC</label>
                            <InputNumber
                              size="sm"
                              onChange={(value, event) =>
                                handleChange(index, event)
                              }
                              value={item.courantISC}
                              id="courantISC"
                              name="courantISC"
                              placeholder="A"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-4 col-sm-6 mb-3">
                          <div className="form-group">
                            <label htmlFor="tensionVOC" className='mb-2'>Tension VOC</label>
                            <InputNumber
                              size="sm"
                              onChange={(value, event) =>
                                handleChange(index, event)
                              }
                              value={item.tensionVOC}
                              id="tensionVOC"
                              name="tensionVOC"
                              placeholder="V"
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-4 col-sm-6 mb-3">
                          <div className="form-group">
                            <label htmlFor="panelS" className='mb-2'>Panneau en série</label>
                            <InputNumber
                              size="sm"
                              onChange={(value, event) =>
                                handleChange(index, event)
                              }
                              value={item.panelS}
                              id="panelS"
                              name="panelS"
                              placeholder=""
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-4 col-sm-6 mb-3">
                          <div className="form-group">
                            <label htmlFor="panelP" className='mb-2'>Panneau en parallèle</label>
                            <InputNumber
                              size="sm"
                              onChange={(value, event) =>
                                handleChange(index, event)
                              }
                              value={item.panelP}
                              id="panelP"
                              name="panelP"
                              placeholder=""
                              disabled
                            />
                            {alertPanel && <small id="helpId" className=" text-warning">{alertPanel}</small>}
                          </div>
                        </div>
                        <div className="col-md-4 d-flex align-items-center">
                        {index > 0 && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteInstallation(index)}
                          >
                            x
                          </button>
                        )}
                        </div>
                      </div>
                    </Tabs.Tab>
                  ))}
                {checked &&
                      <Tabs.Tab
                      key='1'
                      eventKey="1"
                      title={`Onduleur`}
                    >
                      <div className="row">
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label htmlFor="onduleur" className="form-label">
                              Puissance de l'onduleur
                            </label>
                            <InputNumber
                              size="sm"
                              onChange={setOnduleur}
                              value={onduleur}
                              name="onduleur"
                              placeholder="W"
                            />
                          </div>
                        </div>
                      </div>
                      </Tabs.Tab>}
                  {!checked && <Tabs.Tab
                    eventKey="add"
                    title={
                      <span
                        onClick={addInstallation}
                        style={{ fontSize: "16px", fontWeight: "bold" }}
                      >
                        +
                      </span>
                    }
                  />}
              </Tabs>
            </div>
          </div>
          <div className='text-right'>
          {/* <!-- Button trigger modal --> */}
        {/* <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#mymodalcomponent">
          Ajouter l'irradiation
        </button> */}
          <NavButton handleclick={handleClick}/>
          </div>
        {/* <MyModal title="Ajouter l'irradiation">
          <div className='row'>
            {manualIrrad.map((item, index)=>(
            <div className='col-md-3 mt-2'>
              <label for="exampleFormControlInput1" class="form-label">{mois[index]}</label>
              <InputNumber value={item} onChange={(value)=>updateManualIrrad(index, value)}/>
              </div> 
            )) }
          </div>
        </MyModal> */}
          </div>
    </div>
  </div>
  </div>
  </>
    );
};

export default Home;