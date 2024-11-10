import React, { useCallback, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Table, Pagination, InputNumber, SelectPicker } from 'rsuite';
import { NavLink } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import "./style/predictStyle.css"
import axios from 'axios';
import MyModal from '../component/MyModal';
import { Icon } from '@iconify-icon/react';

const ExcelTest = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [opportunite, setOpportinute] = useState([])
  const [recommandation, setRecommandation] = useState([])

  const localisations = [{'Antananarivo':25},{'Antsiranana':26}, {'Nosy Be':27},{'Majunga':28},{'Tamatave':38},{'Tuléar':29},{'Fort Dauphin':30}].map((item, index)=>(
    {label: Object.keys(item), value: item[Object.keys(item)]}    
  ))

  const installations = [{'Résidentiel':31},{'Commercial':32}, {'Industriel':33}].map((item, index)=>(
    {label: Object.keys(item), value: item[Object.keys(item)]}    
  ))

  const [userValue, setUserValue] = useState({localisation : "", type_installation :"", capacite_batterie:"", puissance_installation:"", puissance_onduleur:""})
  const [prediction, setPrediction] = useState([]);
  const rowsPerPage = 10;

  const style = {
    backgroundColor : "#f6f8fa",
    padding : "0.2rem"
  }
  const iconStyle = {
    color : "#00D084",
    fontSize : "1.5rem"
  }

    const exportFile = (() => {
      const sizeOfArray = Array(24).fill(userValue.localisation)
      const value_centrale = Array(23).fill(0).map((_,i)=>i+1)
      const nom_de_la_centrale = value_centrale[Math.floor(Math.random()*value_centrale.length)]
      const model = sizeOfArray.map((item, index)=>({
        "Heure":index>9?index:'0'+index,
        "Nom_de_la_centrale":nom_de_la_centrale,
        "Localisation" : parseInt(item),
        "Type_d_installation" : parseInt(userValue.type_installation),
        "Capacite_batterie" : parseFloat(userValue.capacite_batterie),
        "Puissance_d_installation" : parseFloat(userValue.puissance_installation),
        "Puissance_d_onduleur" : parseFloat(userValue.puissance_onduleur),
        "Irradiation": "",
        "Reseau_batterie" : "",
        "Reseau_consommation":"",
        "Pv_Batterie" : "",
        "PV_Reseau" : "", 
        "PV_Consommateurs": "",
        "Batterie - consommateurs":"",
        "Batterie - reseau" : "", 
        "Groupe - consommation" : "",
        "Groupe - batterie" : "",
      }))
    const ws = XLSX.utils.json_to_sheet(model);
    const wb = XLSX.utils.book_new();
    var wscols = [
      {wch:5},
      {wch:17},
      {wch:12},
      {wch:19},
      {wch:15},
      {wch:24},
      {wch:20},
      {wch:12},
      {wch:15},
      {wch:20},
      {wch:15},
      {wch:20},
      {wch:15},
      {wch:20},
  ];
  
  ws['!cols'] = wscols;
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFileXLSX(wb, "modèle-data.xlsx");
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);

      setData(sheetData);
      setPage(1); // Reset to first page on new upload
    };

    reader.readAsBinaryString(file);
  };

  const objectTest = ()=>{
    console.log("Object test")
    const myArray = ["a","b","c","d","e","f","g","h","i"]
    let array2 = []

   array2 =  myArray.map((item, index)=>({id : index, alphabet : item}))

    console.log(array2);

  }

  const handlePredict = async () => {
    try {
        const response = await axios.post('http://localhost:5000/predict', {
            data :{data}
        });
        const res = response.data.prediction
        const energie_evalue = res[7]
        const opt = Array(24).fill(0)
        const recomm = Array(24).fill("")
        data.map((item, index)=>{
          opt[index] = item.Irradiation - energie_evalue[index]
          recomm[index] = item.Irradiation < energie_evalue[index] ? " Veuillez ajuster votre charge car elle dépasse la puissance disponible" : "Veuillez augmenter votre consommation pour pouvoir profiter au max de l’ensoleillement disponible "

    })

let groupedRecommendations = [];
let startHour = 0;
let currentRecommandation = recomm[0];

recomm.forEach((entry, index) => {
      if (entry !== currentRecommandation || index === recomm.length - 1) {
          const endHour = index === recomm.length - 1 ? index : index-1;
          groupedRecommendations.push({
              interval: `${startHour}h à ${endHour}h`,
              recommandation: currentRecommandation
          });
          startHour = index;
          currentRecommandation = entry;
      }
  });
  
    
        setRecommandation(groupedRecommendations)
        setOpportinute(opt);
        setPrediction(res);
    } catch (error) {
        console.error("Erreur lors de la prédiction:", error);
    }
};

const upValue = (value, name)=>{
  console.log(value);
  
  setUserValue(prevState=>{
  const newValue = {...prevState}
  newValue[name] = value
  return newValue
})
}

useEffect(()=>{
  console.log(prediction);
},[prediction])

  // Calcule les données à afficher pour la page actuelle
  const displayData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

 const Exportation =(data, libelle)=> {
    return{labels:  data.map((data, index) => index),
    datasets: [
      {
        label:libelle,
        data:  data,
        borderColor: 'rgba(75,192,192,1)',
        fill: true,
      },
    ],}

  };

  return (
    <div>
      <div className="header d-flex justify-content-end" style={style}>
         <NavLink to={"/"}> <i className="fas fa-home" style={iconStyle}></i></NavLink>
      </div>
      <div className="banner">
        <div className=" text-center">
          <div className="bg-light pt-2 pb-2 mx-auto mb-3 w-75 rounded-pill">
            <h3 className='mb-1 text-success text-bold'>Bienvenu sur la page de prédiction</h3>
          <p className='mb-3'>On vous demande d'entrer votre donnée afin de commencer la prédiction</p>
          </div>
          <input type="file"  onChange={handleFileUpload} />
          <div className="btn-action d-flex justify-content-center mt-2">
            <buton className="btn btn-primary mx-2" data-bs-toggle="modal" data-bs-target="#mymodalcomponent"><i className='fas fa-download'></i> Télecharger une modèle</buton>
            <buton className="btn btn-info" onClick={objectTest} >
              <i className="fa fa-video"></i> Voir un tuto 
              </buton>
          </div>
        </div>
        <MyModal title={"Configuration du modèle"} handleValidate={exportFile}>
              <div className="row">
                <div className="col-md-4 ">
                  <div className="mb-3">
                    <label for="" className="form-label">Localisation</label>
                    <SelectPicker style={{display:'block'}} placeholder="Choisi votre localisation" onChange={(value)=>upValue(value,"localisation")} data={localisations} value={userValue.localisation}/>
                  </div>
                </div>
                <div className="col-md-4 ">
                  <div className="mb-3">
                    <label for="" className="form-label">Type d'installation</label>
                    <SelectPicker style={{display:'block'}} placeholder="Choisi votre installation" data={installations} onChange={(value)=>upValue(value,"type_installation")} value={userValue.type_installation}/>
                  </div>
                </div>
                <div className="col-md-4 ">
                  <div className="mb-3">
                    <label for="" className="form-label">Capacité de la batterie</label>
                    <InputNumber placeholder='Ah' onChange={(value)=>upValue(value,"capacite_batterie")} value={userValue.capacite_batterie}/>
                  </div>
                </div>
                <div className="col-md-4 ">
                  <div className="mb-3">
                    <label for="" className="form-label">Puissance d'installation</label>
                    <InputNumber placeholder='kw' onChange={(value)=>upValue(value,"puissance_installation")} value={userValue.puissance_installation}/>
                  </div>
                </div>
                <div className="col-md-4 ">
                  <div className="mb-3">
                    <label for="" className="form-label">Puissance de l'onduleur </label>
                    <InputNumber placeholder='Kw' onChange={(value)=>upValue(value,"puissance_onduleur")} value={userValue.puissance_onduleur}/>
                  </div>
                </div>
              </div>
              
            </MyModal>
      </div>
      
      
      

      {data.length > 0 && (
        <>
        <div style={{width:"90%"}} className='mx-auto'>
          <div className="header d-flex mx-4 justify-content-between mt-3">
          <h4>Donner entrer</h4>
          <button className='btn btn-primary' onClick={handlePredict}>Prédire</button>
        </div>
        </div>
        
        <div className='d-flex justify-content-center'>
        <div style={{width : "90%"}} className='mt-3'>
          <Table data={displayData} autoHeight>
            {Object.keys(data[0]).map((key) => (
              <Table.Column key={key} width={150} resizable>
                <Table.HeaderCell>{key}</Table.HeaderCell>
                <Table.Cell dataKey={key} />
              </Table.Column>
            ))}
          </Table>
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size="md"
            layout={['total', '-', 'pager', 'skip']}
            total={data.length}
            limit={rowsPerPage}
            activePage={page}
            onChangePage={setPage}
          />
        </div>
        </div>
          {/* Pagination */}
          
        </>
      )}

      {prediction.length >0 && (
        <div>
          <h3 className='text-center mt-2 mb-3'>Resultat de la prédiction</h3>
          <div className="container">

          <div className='card p-2'>
        <div className='row mx-2 '>
          {/* 'Importation', 'Autoconsommation', 'Rendement_de_l_installation',  */}
          {/* 'Impact_Charbon', 'Impact_CO2', 'Cout', 'Energie_Evalue' */}
          <div className="col-md-4"><Line data={Exportation(prediction[0], "Exportation")}/></div>
          <div className="col-md-4"><Line data={Exportation(prediction[1], 'Importation')}/></div>
          <div className="col-md-4"><Line data={Exportation(prediction[2], 'Autoconsommation')}/></div>
          <div className="col-md-4"><Line data={Exportation(prediction[3], 'Rendement_de_l_installation')}/></div>
          <div className="col-md-4 "><Line data={Exportation(prediction[4], 'Impact_Charbon')}/></div>
          <div className="col-md-4 "><Line data={Exportation(prediction[5], 'Impact_CO2')}/></div>
          <div className="col-md-4 "><Line data={Exportation(prediction[6], 'Cout')}/></div>
          <div className="col-md-4 "><Line data={Exportation(prediction[7], 'Energie_Evalue')}/></div>
          </div>
          </div>
          </div>

          <h3 className='text-center mt-2 mb-3'>Optimisation</h3>
          <div className="container">
            <div className="card">
          <Line data={Exportation(opportunite, 'Opportunité')}/>
            </div>
          </div>
          <h3 className='text-center mt-2 mb-3'>Recommandation</h3>
          <div className="container">
            <div className="card p-4">
              <table className='text-black' >
                <thead>
                <tr style={{height : "40px"}}>
                  <th>Heure</th>
                  <th>recommandation</th>
                </tr>
                </thead>
                {recommandation.map((item, index)=>(
                  <tr>
                    <td>{item.interval}</td>
                    <td>{item.recommandation}</td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelTest;
