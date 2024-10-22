import SideBar from '../component/SideBar';
import Header from '../component/Header';
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { layerGroup } from "leaflet";
import {
  Tabs,
  Placeholder,
  Input,
  InputNumber,
  SelectPicker,
  Loader,
  Radio,
  RadioGroup,
  Toggle,
  Panel, 
  HStack,
  Button,
} from "rsuite";
import { useAppContext } from '../context/AppContext';
import { formConsoOnduleur } from '../utils/formule'
import Swal from 'sweetalert2'
import NavButton from '../component/NavButton';
import axios from 'axios';

// Fix pour le chemin des icônes par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Home = () => {
  const navigate = useNavigate();

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
    setEnsBatt
    // Ajoute d'autres valeurs ou fonctions ici si nécessaire
  } = useAppContext();

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
            newInfo.data = hourIrradValue;
            return newInfo
            })
            
            
          } catch (error) {
            console.error("Erreur lors de l'appel API", error);
          }
        }
      };

      useEffect(() => {
        getInfoIrrad(localisation);
        console.log("here");
        getInfohourIrrad(localisation)
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
      <div className= "container-fluid">
        <div className='card p-2' >
      <div className="row mt-3">
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group d-md-flex align-items-center">
                    <label className="col-form-label">Nom du projet</label>
                    <div className="ms-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={nomProjet}
                        onChange={(event)=>setNomProjet(event.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 p-0">
                  <div className="mt-1">
                    <div className="row">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="latitude"
                          value={localisation.latitude}
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="longitude"
                          value={localisation.longitude}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col mt-2">
              <Toggle checked={checked} onChange={(value) => onChecked(value)}>
                Utiliser la puissance de l'onduleur
              </Toggle>
            </div>
          </div>
          <div className="row mb-1">
            <div className="col-md-4 col-sm-12">
              <MapContainer
                center={[-18.968, 47.546]} // Position initiale (Londres)
                zoom={5}
                style={{ height: "400px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapEvents />
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
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label htmlFor="orientation">Orientation</label>
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
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label htmlFor="puissInstallation">Puissance souhaité</label>
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
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label htmlFor="puissanceUnit">
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
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label htmlFor="rendement">Rendement du panneau</label>
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
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label htmlFor="surface">Surface du panneau</label>
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
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label htmlFor="courantISC">Courant ISC</label>
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
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label htmlFor="tensionVOC">Tension VOC</label>
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
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label htmlFor="panelS">Panneau en série</label>
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
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label htmlFor="panelP">Panneau en parralèlle</label>
                            <InputNumber
                              size="sm"
                              onChange={(value, event) =>
                                handleChange(index, event)
                              }
                              value={item.panelP}
                              id="panelP"
                              name="panelP"
                              placeholder=""
                            />
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
          <NavButton handleclick={handleClick}/>
          
          </div>
    </div>
  </div>
  </div>
    );
};

export default Home;