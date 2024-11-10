import React, { createRef, useEffect, useRef, useState } from 'react';
import SideBar from '../component/SideBar';
import Header from '../component/Header';
import { Icon } from '@iconify-icon/react';
import './style/impression.css'
import html2pdf  from 'html2pdf.js';
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { layerGroup } from "leaflet";
import { useAppContext } from '../context/AppContext';
import BarChart from '../component/BarChart';
import { Line } from "react-chartjs-2";
import {
  Input,
  InputNumber,
  Message,
  SelectPicker,
  Toggle,
  useToaster
} from "rsuite";
import { getDaysInMonth, getFirstDayOfMonth } from '../utils/function';
import MyModal from '../component/MyModal';
import axios from 'axios';


// Fix pour le chemin des icônes par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
const lineOption = {
  tension: 0.4,
  scales: {
    y: {
      beginAtZero: true, // Assurez-vous que l'échelle commence à 0
    },
  },
  plugins: {
    zoom: {
      pan: {
        enabled: true,  // Activation du pan
        mode: 'x',      // Permet de déplacer uniquement sur l'axe X
      },
      zoom: {
        wheel: {
          enabled: true,  // Activation du zoom à la molette
        },
        pinch: {
          enabled: true,  // Activation du zoom par pincement sur appareils tactiles
        },
        mode: 'x',         // Zoom uniquement sur l'axe X
      },
    },
  }
}

const Report = () => {

  const year = new Date().getFullYear()
  const mois = ['jan', 'fev', 'mars', 'avr', 'mai', 'jiun', 'juil', 'août', 'sept', 'oct', 'nov', 'dec']
  const day = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim']
  // <Icon icon="healthicons:happy"  style={{color: #10a836}} />
  const [type, setType] = useState('success');
  const [placement, setPlacement] = useState('topEnd');
  const toaster = useToaster();

  const message = (
    <Message showIcon type={type} closable>
      <strong>{type}!</strong> On vous remerci de votre passage.
    </Message>
  );
  // Impression
  const refToPrint = React.createRef()
  const printDoc = ()=>{
    const element = refToPrint.current;

    // Configuration de html2pdf
    const options = {
      filename:     'mon-document.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Appel de html2pdf pour générer et télécharger le PDF
    setTimeout(()=>{
      html2pdf().set(options).from(element).save();
    },5000)
  }
// impressionss

const upValue=(value, name)=>{
  setInfoClient(prevState=>{
    const newInfo = [...prevState]
    newInfo[0][name] = value
    return newInfo
  })
}

  const satisArray = [
    {icon:"ph:smiley-x-eyes-duotone", color:"red"},
    {icon:"ph:smiley-sad-duotone", color:"#FFCA28"},
    {icon:"ph:smiley-meh-duotone", color:"#FFCA28"},
    {icon:"ph:smiley-duotone", color:"green"},
    {icon:"healthicons:happy", color:"#10a836"},
  ]

  const recommandation = Array(10).fill(0)

  const validate = ()=>{
    console.log(infoClient);
    
  }

  const [infoClient, setInfoClient] = useState([
    {
      nom:"",
      prenom:"",
      mail:"",
      ville:"",
      interet :"",
      satisfaction:"",
      commentaire:"",
      recommandation : ""
    }
  ])

  const handleClick=(value, name)=>{
    setInfoClient(prevState=>{
      const newInfo = [...prevState]
      newInfo[0][name] = value
      return newInfo
    })
    
  }

  useEffect(()=>{
    console.log(infoClient);
    
  }, [infoClient])
  const starNumber = Array(5).fill(0)


  const { position,
    checked,
    installation,
    dataEns,
    productionUnitPanel,
    monthConso,
    setMonthConso,
    equipementsDescription,
    equipementsUsage,
    courbeChargeData,
    setCourbeChargeData,
    infoSecu,
    ensBatt,
    setEnsBatt,
    nomProjet,
    infoEnv,
    infoEconomie,
  } = useAppContext()


  useEffect(() => {
    console.log(infoEconomie);

  })
  const updateChartConso = (month) => {
    if (month === null) return;
    let startDay = getFirstDayOfMonth(year, month) === 0 ? 6 : getFirstDayOfMonth(year, month) - 1
    const totalDay = getDaysInMonth(year, month + 1)
    let totalValueOfSelectedMonth = Array(totalDay * 24).fill(0)


    let label = []
    // Find if month is active
    equipementsDescription.forEach((eqpItem, eqpIndex) => {
      let selectedMonth = []
      const puissanceEqp = eqpItem.puissanceTotal
      let weekData = []
      // Boucler les jours
      // let hourData = []
      day.forEach((dayData, DaysIndex) => {
        // Verifier si le jours est activer pour le présent équipement
        let hourData = Array(24).fill(0)

        if (equipementsUsage[eqpIndex].day[DaysIndex]) {
          // boucle l'heure
          equipementsUsage[eqpIndex].hour.forEach((hourItem, hourIndex) => {
            if (hourItem) {
              hourData[hourIndex] = puissanceEqp
              // hourData.push(puissanceEqp)
            }
          })
          weekData.push(hourData)
        } else {
          weekData.push(Array(24).fill(0))
        }
      })
      console.log(weekData);

      for (let index = 0; index < totalDay; index++) {
        // créer un label 
        if (eqpIndex === 0) {
          const date = index + 1
          const dayName = day[startDay]
          for (let hour = 0; hour < 24; hour++) {
            label.push(`${dayName}, le ${date} - ${hour} h`); // Ajoute le label pour chaque heure
          }
          if (startDay === 6) {
            startDay = 0
          } else {
            startDay++
          }
        }
        selectedMonth.push(weekData[startDay])
      }
      selectedMonth = selectedMonth.flat();
      selectedMonth.map((item, index) => {
        totalValueOfSelectedMonth[index] += item
      })
      console.log(label);
    })
    setCourbeChargeData(prevState => {
      const newInfo = { ...prevState }
      newInfo.month = totalValueOfSelectedMonth
      newInfo.hourLabel = label

      return newInfo
    })

  }

  const handleSave = (data)=>{
    const modal = document.getElementById('mymodalcomponent')
    const modal_backdrop = document.querySelector('.modal-backdrop')
    if (infoClient[0].nom && infoClient[0].prenom && infoClient[0].ville && infoClient[0].mail && infoClient[0].interet && infoClient[0].commentaire && infoClient[0].satisfaction && infoClient[0].recommandation) {
      postInfoClient(data)
      alert("hello")
    }else{
      alert("Toutes les informations sont obligatoires")
    }
  }

  const postInfoClient = async (data)=>{
    
          try {
      const response = await axios.post(`http://localhost:3001/insert`, data);
      toaster.push(message, { placement, duration: 5000 });
      console.log(response);
      
      // getClients(); // Recharger les données après l'insertion
  } catch (error) {
      console.error('Erreur lors de l\'envoi des données:', error);
  }
  }
  const dataMonthConso = mois.map((item, index) => {
    return { label: item, value: index }
  })

  const dataconso = (label, data) => {
    return {
      labels: label,
      datasets: [
        {
          label: "Consommation énergétique  (kWh)",
          data: data, // Données de production solaire mensuelles
          backgroundColor: "rgb(255, 0, 0)",
          borderColor: "rgb(255, 0, 0)",
          borderWidth: 1,
        },
      ],
    }
  };
  const dataEnsoleillementBatt = {
    labels: ensBatt.label,
    datasets: [
      {
        label: "Production ",
        data: ensBatt.data, // Données de production solaire mensuelles
        fill: false,
        backgroundColor: "rgba(255, 165, 0, 0.6)",
        borderColor: "rgba(255, 165, 0, 1)",
        borderWidth: 1,
        tension: 0.2,
      },
      {
        label: "Consommation",
        data: ensBatt.dataConso, // Données de production solaire mensuelles
        backgroundColor: "rgba(192, 70, 192, 0.6)",
        borderColor: "rgba(192, 70, 192, 1)",
        borderWidth: 1,
        tension: 0.4,
      },
      {
        label: "Capacité",
        data: ensBatt.dataBattery, // Données de production solaire mensuelles
        backgroundColor: "rgba(40, 190, 0, 0.6)",
        borderColor: "rgba(40, 190, 0, 1)",
        borderWidth: 1,
        tension: 0.2,
      },
      {
        label: "Soutiré",
        data: ensBatt.soutire, // Données de production solaire mensuelles
        backgroundColor: "rgba(200, 50, 0, 0.6)",
        borderColor: "rgba(200, 50, 0, 1)",
        borderWidth: 1,
        tension: 0.4,
      },
    ],
  };

  const dataEnsoleillement = {
    labels: mois,
    datasets: [
      {
        label: "Irradiation Solaire 2024 (kWh)",
        data: dataEns, // Données de production solaire mensuelles
        backgroundColor: "rgb(255, 165, 0)",
        borderColor: "rgb(255, 165, 0)",
        borderWidth: 1,
      },
    ],
  };

  const dataTest = (data) => {
    return {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Production Solaire 2024 (kWh)",
          data: data, // Données de production solaire mensuelles
          backgroundColor: "rgba(0, 0, 255, 0.6)",
          borderColor: "rgba(0, 0, 255, 1)",
          borderWidth: 1,
        },
      ],
    }
  };
  return (
    <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
      data-sidebar-position="fixed" data-header-position="fixed">
      {/* Sidebar Start */}
      <SideBar />
      {/*  Sidebar End */}
      {/*  Main wrapper */}
      <div className="body-wrapper">
        {/*  Header Start */}
        <Header step={"Rapport"} />
        {/*  Header End */}
        <div className="container-fluid" ref={refToPrint}>
          <div className='card p-2'>
            {/* Affiche l'information sur l'emplacement */}
            <div className="row">
              <div className="col-md-4 col-sm-12">
                <MapContainer
                  center={[-18.968, 47.546]} // Position initiale (Londres)
                  zoom={5}
                  style={{ height: "400px" }}
                  dragging={false}         // Désactiver le déplacement de la carte
                  scrollWheelZoom={false}
                  zoomControl={false}      // Désactiver les boutons de zoom
                  doubleClickZoom={false}  // Désactiver le zoom avec double clic
                  touchZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {position && (
                    <Marker position={[position.lat, position.lng]}>
                      <Popup>
                        Latitude: {position.lat}, Longitude: {position.lng}
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
              <div className="col-md-6">
                <h4 className='text-center'>Projet : {nomProjet}</h4>
                {!checked && <table
                  className="table table-striped"
                >
                  <thead>
                    <tr className="text-center">
                      <th scope="col">Installations</th>
                      <th scope="col" >Orientation</th>
                      <th scope="col">Puissance souhaitée</th>
                    </tr>
                  </thead>
                  <tbody>

                    {installation.map((item, index) => (
                      <tr className="text-center">
                        <td scope="row">Installation {index + 1}</td>
                        <td>{item.orientation} °</td>
                        <td>{item.puissInstallation} W</td>
                      </tr>
                    ))}
                  </tbody>
                </table>}
              </div>
            </div>
            {/* Affiche l'information sur l'installation */}
            <p style={{ fontSize: "22px", fontWeight: "bold", color: "orange", marginTop: "4px" }}>Partie panneau solaire</p>
            {!checked && dataEns && <div className="row mt-2">
              <div className="col-md-6">
                <div className="card">
                  <h5 className="text-center">Ensoleillement</h5>
                  <Line data={dataEnsoleillement} options={lineOption} />
                  {/* <BarChart data={dataEnsoleillement} title="" /> */}
                </div>
              </div>
              {productionUnitPanel.map((item, index) => (<div className="col-md-6">
                <div className="card">
                  <Line data={dataTest(item)} options={lineOption} />
                  {/* <BarChart data={dataTest(item)} title={`installation ${index + 1}`} /> */}
                </div>
              </div>))}

            </div>}
            {/* Information consommation */}
            <div className="row mt-3">
              <div className="col-md-8">
                <div className="d-flex justify-content-between">
                  <div className="mr-4">
                    <Toggle size="sm" checked={monthConso} onChange={setMonthConso}>
                      Mensuel
                    </Toggle>
                  </div>
                  {monthConso && <div>
                    <SelectPicker data={dataMonthConso} placeholder="Choisi le mois" onChange={(value) => updateChartConso(value)} />
                  </div>}
                </div>
                <Line data={monthConso ? dataconso(courbeChargeData.hourLabel, courbeChargeData.month) : dataconso(mois, courbeChargeData.year)} options={lineOption} />
                {/* <BarChart data={ monthConso ? dataconso(courbeChargeData.hourLabel,courbeChargeData.month) :dataconso(mois,courbeChargeData.year)} title="Courbe de charge" /> */}
              </div>
              <div className="col-md-6">

              </div>
            </div>
            <p style={{ fontSize: "22px", fontWeight: "bold", color: "orange", marginTop: "4px" }}>Partie Batterie</p>
            <div className="row ">
              <div className="col-md-6">
                <Line data={dataEnsoleillementBatt} options={lineOption} />
              </div>

            </div>
            <p style={{ fontSize: "22px", fontWeight: "bold", color: "orange", marginTop: "4px" }}>Partie Sécurité du matériel</p>
            <div className="row ">
              <table class="table">
                <thead>
                  <tr>
                    <th>Panneau - Onduleur</th>
                    <th>Batterie - Onduleur</th>
                    <th>Onduleur - Utilisation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td scope="row">{infoSecu[0].resultat.cablePannOnd} mm2</td>
                    <td>{infoSecu[0].resultat.cableBattOnd} mm2</td>
                    <td>{infoSecu[0].resultat.cableOndUse} mm2</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: "22px", fontWeight: "bold", color: "orange", marginTop: "4px" }}>Partie étude environnementale</p>
            <div className="row ">
              <table class="table">
                <thead>
                  <tr>
                    <th>Pollution</th>
                    <th>Soustrait / ans</th>
                    <th>CO2 évité</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td scope="row">{infoEnv.pollution}</td>
                    <td>{infoEnv.soustrait}</td>
                    <td>{infoEnv.CO2}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="row ">
              <table class="table" >
                <thead>
                  <tr>
                    <th>Coût de production</th>
                    <th>Retour sur investissement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td scope="row">{infoEconomie[0].resultat.coutProd} Ar</td>
                    <td>{infoEconomie[0].resultat.retourInstissement}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="btn-print d-flex justify-content-end">
              <button className="btn btn-primary d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#mymodalcomponent"><Icon icon="fluent:print-16-regular" style={{fontSize: "1.2rem", marginRight:"3px"}}/> Imprimer</button>
              <MyModal title="Formulaire de retour" handleValidate={()=>handleSave(infoClient[0])}>
                
                <div className="row">
                  <div className="col-md-4 " >
                    <div className="mb-3">
                      <label for="" className="form-label required">Nom</label>
                      <Input onChange={(value) => upValue(value, "nom")} value={infoClient[0].nom} />
                    </div>
                  </div>
                  <div className="col-md-4 " >
                    <div className="mb-3">
                      <label for="" className="form-label required">Prénom</label>
                      <Input onChange={(value) => upValue(value,"prenom")} value={infoClient[0].prenom} />
                    </div>
                  </div>
                  <div className="col-md-4 " >
                    <div className="mb-3">
                      <label for="" className="form-label required">Email</label>
                      <Input onChange={(value) => upValue(value,"mail")} value={infoClient[0].mail} />
                    </div>
                  </div>
                  <div className="col-md-4 " >
                    <div className="mb-3">
                      <label for="" className="form-label required">Ville</label>
                      <Input onChange={(value) => upValue(value, "ville")} value={infoClient[0].ville} />
                    </div>
                  </div>
                  <div className="col-md-12 " >
                    <div className="mb-3">
                      <label for="" className="form-label required">Interêt</label>
                      <Input as="textarea" onChange={(value) => upValue(value,'interet')} value={infoClient[0].interet} />
                    </div>
                  </div>
                  <div className="col-md-12 " >
                    <div className="mb-3">
                      <label for="" className="form-label required">Commentaire</label>
                      <Input as="textarea" onChange={(value) => upValue(value, "commentaire")} value={infoClient[0].commentaire} />
                    </div>
                  </div>
                  <div className="col-md-12 " >
                    <p className='mb-2 text-black mt-2'>A quel point êtes-vous satisfait de nos services ?</p>
                    <div className='row'>
                        {satisArray.map((item, index) => (
                          <div className="col-md-2">
                        <div className="statis-card d-flex cursor-pointer flex-column align-items-center p-1 rounded" onClick={()=>handleClick(index+1,"satisfaction")} style={{backgroundColor:`${index===infoClient[0].satisfaction?"rgba(255,255,0,0.3)":""}`}}>
                        <Icon icon={item.icon} style={{fontSize:"3.5rem", color:item.color}}/>
                        <div className='score bg-black rounded-pill px-1'>
                          {starNumber.map((_,i)=>(
                            <Icon icon="mingcute:star-fill" style={{color:`${index>=i?"yellow":""}`}}/>
                          ))}
                          </div>
                        </div>
                        </div>
                        ))}
                    </div>
                  </div>
                  <div className="col-md-12 " >
                    <p className='mb-2 text-black mt-2'>Sur une échelle de 1 à 10, quelle est la probabilité que vous nous-recommandiez à un ami ou collègue ?</p>
                    {recommandation.map((_,i)=>{
                      let color = ""
                      if (infoClient[0].recommandation>i) {
                        if(i<6){
                          color = "btn-danger"
                        }else if (i>5 && i<8) {
                          color = "btn-warning"
                        }else {
                          color = "btn-success"
                        }
                      }
                      return <button className={`btn p-2 px-3 m-2 ${color}`}  onClick={()=>upValue(i+1,"recommandation")}>{i+1}</button>
                    })}
                    </div>
                </div>
                    
              </MyModal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;