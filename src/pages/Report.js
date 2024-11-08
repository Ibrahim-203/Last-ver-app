import React from 'react';
import SideBar from '../component/SideBar';
import Header from '../component/Header';
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
import { getDaysInMonth, getFirstDayOfMonth } from '../utils/function';

// Fix pour le chemin des icônes par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
const lineOption = {
  tension : 0.4,
  scales: {
    y: {
        beginAtZero: true, // Assurez-vous que l'échelle commence à 0
    },
},
plugins : {
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
  const mois = ['jan','fev','mars','avr','mai','jiun','juil','août','sept','oct','nov','dec']
  const day = ['lun','mar','mer','jeu','ven','sam','dim']


  const {position,
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
    infoEnv
  } = useAppContext()
  const updateChartConso = (month)=>{
    if(month===null) return;
    let startDay = getFirstDayOfMonth(year, month)==0?6:getFirstDayOfMonth(year, month)-1
    const totalDay = getDaysInMonth(year,month+1)
    let totalValueOfSelectedMonth = Array(totalDay*24).fill(0)


    let label = []
    // Find if month is active
    equipementsDescription.forEach((eqpItem, eqpIndex)=>{
      let selectedMonth = []
      const puissanceEqp = eqpItem.puissanceTotal
      let weekData= []
      // Boucler les jours
      // let hourData = []
      day.forEach((dayData,DaysIndex)=>{
        // Verifier si le jours est activer pour le présent équipement
        let hourData = Array(24).fill(0)

        if(equipementsUsage[eqpIndex].day[DaysIndex]){
          // boucle l'heure
          equipementsUsage[eqpIndex].hour.forEach((hourItem, hourIndex)=>{
            if (hourItem) {
              hourData[hourIndex] = puissanceEqp
              // hourData.push(puissanceEqp)
            }
          })
          weekData.push(hourData)
        }else{
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
          }else{
            startDay ++
          }
        }
        selectedMonth.push(weekData[startDay])            
      }
      selectedMonth = selectedMonth.flat();
      selectedMonth.map((item,index)=>{
        totalValueOfSelectedMonth[index] += item
      })
      console.log(label);
    })
    setCourbeChargeData(prevState=>{
      const newInfo = {...prevState}
      newInfo.month = totalValueOfSelectedMonth
      newInfo.hourLabel = label

    return newInfo
    })
    
  }
  const dataMonthConso = mois.map((item,index)=>{
    return {label : item, value: index}
  })

  const dataconso = (label,data)=> {
    return {labels:label,
    datasets: [
      {
        label: "Consommation énergétique  (kWh)",
        data: data, // Données de production solaire mensuelles
        backgroundColor: "rgb(255, 0, 0)",
        borderColor: "rgb(255, 0, 0)",
        borderWidth: 1,
      },
    ],}
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
        tension : 0.2,
      },
      {
        label: "Consommation",
        data: ensBatt.dataConso, // Données de production solaire mensuelles
        backgroundColor: "rgba(192, 70, 192, 0.6)",
        borderColor: "rgba(192, 70, 192, 1)",
        borderWidth: 1,
        tension : 0.4,
      },
      {
        label: "Capacité",
        data: ensBatt.dataBattery, // Données de production solaire mensuelles
        backgroundColor: "rgba(40, 190, 0, 0.6)",
        borderColor: "rgba(40, 190, 0, 1)",
        borderWidth: 1,
        tension : 0.2,
      },
      {
        label: "Soutiré",
        data: ensBatt.soutire, // Données de production solaire mensuelles
        backgroundColor: "rgba(200, 50, 0, 0.6)",
        borderColor: "rgba(200, 50, 0, 1)",
        borderWidth: 1,
        tension : 0.4,
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

  const dataTest = (data)=> {
    return {labels: [
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
    ],}
  };

    return (
        <div className= "page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
        data-sidebar-position="fixed" data-header-position="fixed">
        {/* Sidebar Start */}
          <SideBar/>
        {/*  Sidebar End */}
        {/*  Main wrapper */}
        <div className= "body-wrapper">
          {/*  Header Start */}
          <Header step={"Rapport"}/>
          {/*  Header End */}
          <div className= "container-fluid">
            <div className='card p-2'>
              {/* Affiche l'information sur l'emplacement */}
              <div className="row">
              <div className="col-md-4 col-sm-12">
              <MapContainer
                center={[-18.968, 47.546]} // Position initiale (Londres)
                zoom={5}
                style={{ height: "400px" }}
                dragging={false}         // Désactiver le déplacement de la carte
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
                
              {installation.map((item, index)=>(
                <tr className="text-center">
                <td scope="row">Installation {index+1}</td>
                <td>{item.orientation} °</td>
                <td>{item.puissInstallation} W</td>
              </tr>
              ))}
              </tbody>
            </table>}
            </div>
              </div>
          {/* Affiche l'information sur l'installation */}
          <p style={{fontSize:"22px", fontWeight:"bold", color:"orange", marginTop:"4px"}}>Partie panneau solaire</p>
              {!checked && dataEns && <div className="row mt-2">
                <div className="col-md-6">
                <div className="card">
                  <h5 className="text-center">Ensoleillement</h5>
              <Line data={dataEnsoleillement} options={lineOption}/>
                  {/* <BarChart data={dataEnsoleillement} title="" /> */}
                </div>
                </div>
                {productionUnitPanel.map((item, index)=>(<div className="col-md-6">
                <div className="card">
              <Line data={dataTest(item)} options={lineOption}/>
                  {/* <BarChart data={dataTest(item)} title={`installation ${index + 1}`} /> */}
                </div>
                </div>)) }
                
              </div>}
          {/* Information consommation */}
          <div className="row mt-3">
            <div className="col-md-8">
              <div className="d-flex">
              <div className="mr-4">
              <Toggle size="sm" checked={monthConso} onChange={setMonthConso}>
                Mensuel
              </Toggle>
              </div>
              {monthConso && <div>
              <SelectPicker data={dataMonthConso} onChange={(value)=>updateChartConso(value)}/>
              </div>}
              </div>
              <Line data={ monthConso ? dataconso(courbeChargeData.hourLabel,courbeChargeData.month) :dataconso(mois,courbeChargeData.year)} options={lineOption}/>
              {/* <BarChart data={ monthConso ? dataconso(courbeChargeData.hourLabel,courbeChargeData.month) :dataconso(mois,courbeChargeData.year)} title="Courbe de charge" /> */}
            </div>
            <div className="col-md-6">

            </div>
          </div>
          <p style={{fontSize:"22px", fontWeight:"bold", color:"orange", marginTop:"4px"}}>Partie Batterie</p>
          <div className="row ">
            <div className="col-md-6">
              <Line data={dataEnsoleillementBatt} options={lineOption}/>
            </div>
          
          </div>
          <p style={{fontSize:"22px", fontWeight:"bold", color:"orange", marginTop:"4px"}}>Partie Sécurité du matériel</p>
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
          <p style={{fontSize:"22px", fontWeight:"bold", color:"orange", marginTop:"4px"}}>Partie étude environnementale</p>
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
              </div>
        </div>
      </div>
      </div>
    );
};

export default Report;