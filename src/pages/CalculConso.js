import React, { useCallback, useEffect, useRef, useState } from 'react';
import SideBar from '../component/SideBar';
import Header from '../component/Header';
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
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { countSpecificDayInMonth } from '../utils/function';
import NavButton from '../component/NavButton';
import Joyride from 'react-joyride';

const CalculConso = () => {

    const navigate = useNavigate()
    const year = new Date().getFullYear()
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
    const day = ['lun','mar','mer','jeu','ven','sam','dim']

    const {
      nomProjet,
      infoOnduleur,
      setInfoOnduleur,
      infoEconomie,
      setInfoEconomie,
      factureData, 
      setFactureData,
      equipementsDescription,
      setEquipementsDescription,
      equipementsUsage,
      setEquipementsUsage,
      productionInstallation,
      setProductionInstallation,
      dataAutoconso,
      setDataAutoconso,
      installationInfo,
      setCourbePuissData,
      courbeChargeData,
      setLabelCourbePuiss,
      setEnsBatt,
      setCourbeChargeData,
      checked,
      choixInstallation, 
      setChoixInstallation,
      choixTarif, 
      setChoixTarif, 
      ensBatt,
      helpBox,
      dataChoixInstallation
      // Ajoute d'autres valeurs ou fonctions ici si nécessaire
    } = useAppContext();
  
       // Variable pour la consommation: Disponible version suivante

      
      const dataChoixTarif = [{label:'Super confort', value:0.863},{label:'Confort', value:0.795},{label:'Economique - social', value:0.370}]
      // Variable pour la consommation
      const [choixEstConso, setChoixEstConso] = useState("A");
    useEffect(()=>{
      console.log(installationInfo);
      
    })
    useEffect(()=>{
      console.log(ensBatt);
      
    })

// Composant
const Facture=({libelle, value})=>{
    return <div className="col-md-2">
    <div className="form-group">
    <label className="col-form-label">{libelle}</label>
    <div className=" ml-2">
      <input
        type="text"
        className="form-control form-control-sm"
        value={value}
      />
    </div>
  </div>
  </div>
  }

  const Profil = ({label})=>(
    <div className="col-md-3">
      <div className="card" style={{ cursor: "pointer" }}>
        <div className="card-body text-center">{label}</div>
      </div>
    </div>
  );
// Composant

const validateConso = ()=>{
  let emptyfield = false
  equipementsDescription.forEach((item, index)=>{
    
    if (item.equipement==="" || item.puissance==="" || item.nombre==="" || !infoOnduleur[0].donnees.cosPhi || infoEconomie[0].resultat.tarif) {
      customAlert("Données manquant", "veillez remplir toutes les informations.")
      emptyfield = true
    }       
})
if(!emptyfield){
let totalPowerPerHour = Array(24).fill(0)
  let labelPuiss =[]
  // let labelHour
  let dataPuiss = []
  let hourConso = Array(24).fill(0)
  let totalYearData = Array(12).fill(0)
  equipementsDescription.forEach((items, index)=>{
    let dayData = 0
    let singleDays = Array(7).fill(0)
    const puissanceTotal = items.puissanceTotal
    const libelle = items.equipement

    equipementsUsage[index].hour.forEach((itemHour, id)=>{
      if(itemHour){
        // 00h - 23h
        dayData += puissanceTotal;
        hourConso[id] += puissanceTotal
      }          
    })
    console.log(libelle,' ',dayData);
    equipementsUsage[index].day.forEach((itemDay, id)=>{
      if(itemDay){
        // Lundi, Mardi, Mercredi, Jeudi, etc...
        singleDays[id] = dayData
      }          
    })

    equipementsUsage[index].month.forEach((itemMonth, id)=>{
      let singleMonth = 0
      singleDays.forEach((itemDayMonth, idDM)=>{
      if(itemMonth){
        singleMonth += itemDayMonth*countSpecificDayInMonth(year,id,day[idDM]);
      } 
      // Stopped here last time
      })  
      totalYearData[id] +=singleMonth/1000
    })
    
    // Courbe de puissance x : libelle équipement, y : puissance équipement
    labelPuiss.push(libelle)
    dataPuiss.push(puissanceTotal)
    
  })
  let prodTotal = 0
  let consoTotal = 0
  productionInstallation.forEach((item)=>{
    prodTotal += parseFloat(item)   
  })
  totalYearData.forEach((item)=>{
    consoTotal += parseFloat(item)
  })
  // conversion en poucentage
  consoTotal = (consoTotal*100)/prodTotal
  prodTotal = 100 - consoTotal
  // L'autoconsommation
  setDataAutoconso([consoTotal,prodTotal])
  // Courbe de puissance
  setLabelCourbePuiss(labelPuiss)
  setCourbePuissData(dataPuiss)
  // Courbe de charge
  setCourbeChargeData(prevState=>{
    const newInfo = {...prevState}
    newInfo.year = totalYearData
    return newInfo
  })

  // Courbe de charge et décharge de la batterie
  setEnsBatt(prevState=>{
    const newInfo = {...prevState}
    const tempData = Array(24).fill(0)
    const ensoleillement = newInfo.ens
    ensoleillement.forEach((item,id)=>{
      tempData[id] = item*installationInfo.totalPanel
    })
    newInfo.dataConso = hourConso
    newInfo.data = tempData
    return newInfo
  })
  return true
}else{
return false
}

  
}
useEffect(()=>{
  console.log(courbeChargeData);
  
},[courbeChargeData])
// Fonctions
const handleClick = ()=>{
  if(!validateConso()) return
  checked ? navigate('/dim-batt') : navigate('/dim-ond')
}
const changeinfoOnd = (value, name)=>{
    const newInfo = [...infoOnduleur]
    newInfo[0].donnees[name] = value
    setInfoOnduleur(newInfo)
  }
  const changeInfoEco = (value, name)=>{
    const newInfo = [...infoEconomie]
    newInfo[0].donnees[name] = value
    setInfoEconomie(newInfo)
  }
  const changeRadio = (value)=>{
    setEquipementsDescription([{
          equipement: "",
          puissance: "",
          nombre: "",
          puissanceTotal: "",
        },
    ])
    setEquipementsUsage([{
      month : Array(12).fill(true),
      day : Array(7).fill(true),
      hour : Array(24).fill(true),
    },
    ])
    setChoixEstConso(value)
  }
  const addEquipement = () => {
    setEquipementsDescription([
      ...equipementsDescription,{
          equipement: "",
          puissance: "",
          nombre: "",
          puissanceTotal: "",
        }
    ]);
    setEquipementsUsage([
      ...equipementsUsage,    {
        month : Array(12).fill(true),
        day : Array(7).fill(true),
        hour : Array(24).fill(true),
      },
    ]);
  };

  const deleteEquipement = (index) => {
    const newEquipementDesc = equipementsDescription.filter((_, i) => i !== index);
    const newEquipementUse = equipementsUsage.filter((_, i) => i !== index);
    setEquipementsDescription(newEquipementDesc);
    setEquipementsUsage(newEquipementUse);
  };
  const ChangeStateUse = (index, type) =>{
    const newstate = [...equipementsUsage]
    newstate[index][type] = Array(newstate[index][type].length).fill(false)
    setEquipementsUsage(newstate)
  }
  const changeEqpmntUsage = useCallback((index,type,use) =>{
    console.log("usage change : " ,index);
    const newEquipement = [...equipementsUsage];
    newEquipement[index][type][use] = !newEquipement[index][type][use]
    setEquipementsUsage(newEquipement)
  },[equipementsUsage])

  const changeEquipDesc = useCallback((index, event) => {
    console.log("usage Equipement");
    const { name, value } = event.target;
    setEquipementsDescription(prevEquipements => {
      const newEquipement = [...prevEquipements];
      const updatedEquipement = { ...newEquipement[index] };
      updatedEquipement[name] = value;
  
      const puissance = Number(updatedEquipement.puissance);
      const nombre = Number(updatedEquipement.nombre);
      
      updatedEquipement.puissanceTotal = (!isNaN(puissance) && !isNaN(nombre)) ? puissance * nombre : "";
  
      newEquipement[index] = updatedEquipement;
      return newEquipement;
    });
  },[]);

// Fonctions


  // guide
  const steps = [
    {
      target: '.eqpmt-space',
      content: 'Entrer ici les informations de votre equipements',
    },
    {
      target: '.usage',
      content: 'Ouvrez cette panel pour entrer les détails de l\'utilisation de votre équipement.',
    },
    {
      target: '.add-eqpmt',
      content: 'Cliquer ici pour ajouter plus d\'équipement.',
    },
  ];




  // guide

    return (
        <div className= "page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
        data-sidebar-position="fixed" data-header-position="fixed">
        {/* Sidebar Start */}
        {helpBox && <Joyride
        steps={steps}
        continuous
        showSkipButton
        showProgress
        />}
          <SideBar/>
        {/*  Sidebar End */}
        {/*  Main wrapper */}
        <div className= "body-wrapper">
          {/*  Header Start */}
          <Header step={"Calcule de consommation"} isHelp={helpBox}/>
          {/*  Header End */}
          <div className= "container-fluid">
            <div className='card p-2 mb-3' style={{marginBottom:"5px !important"}}>
            <div className="row">
            <div className=" col-md-4 mt-2">
              <div className="form-group">
                <label htmlFor="orientation">Choix de l'installation</label>
                <SelectPicker size="sm" searchable={false} className="d-block" data={dataChoixInstallation} value={choixInstallation} onChange={(value)=>{setChoixInstallation(value); changeinfoOnd(value,"cosPhi")}} placeholder="Choisir une installation"/>
              </div>
            </div>
            <div className=" col-md-4 mt-2">
              <div className="form-group">
                <label htmlFor="orientation">Choix du tarif</label>
                <SelectPicker size="sm" searchable={false} className="d-block" data={dataChoixTarif} value={choixTarif} onChange={(value)=>{setChoixTarif(value); changeInfoEco(value,"tarif")}} placeholder="Choisir une Tarif"/>
              </div>
            </div>
          </div>
          <div className="estimation-conso mt-2">
            <h5 className="mb-2 card-title">Estimation de consommation</h5>
            <div className="text-center mb-2">
              <RadioGroup
                name="radio-group-inline-picker"
                inline
                appearance="picker"
                value={choixEstConso}
                onChange={(value)=>changeRadio(value)}
              >
                <Radio value="A">Bilan de puissance</Radio>
                <Radio value="B" disabled>Consommation</Radio>
              </RadioGroup>
            </div>
          </div>

          {choixEstConso === "A" && (
            <>
              <div className="eqpmt-space" style={{ maxHeight: "250px" }}>
                {equipementsDescription.map((item, index) => (
                      <Panel header={`Equipement ${index +1}`} key={index} borderded>
                      <div className="row mt-1">
                        <div className="col-md-3">
                          <div>
                            <Input
                              size="sm"
                              placeholder="equipement"
                              value={item.equipement}
                              onChange={(value, event) => changeEquipDesc(index, event)}
                              name="equipement"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <InputNumber
                            size="sm"
                            placeholder="en W"
                            value={item.puissance}
                            onChange={(value, event) => changeEquipDesc(index, event)}
                            name="puissance"
                          />
                        </div>
                        <div className="col-md-2">
                          <InputNumber
                            size="sm"
                            placeholder="Nombres"
                            value={item.nombre}
                            onChange={(value, event) => changeEquipDesc(index, event)}
                            name="nombre"
                          />
                        </div>
                        
                        {index > 0 && (
                          <div className="col-md-2">
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteEquipement(index)}
                            >
                              X
                            </button>
                          </div>
                        )}
                      </div>
                      <div className=" p-2">
                        <Panel header="Usage" className='usage' collapsible bordered>
                          <div className="row ">
                            <div className="col-md-6 pl-0">
                          <div className="month">
                            <div className="title d-flex align-items-end mb-1">
                              <p>Mois</p> <p className="ms-3 mt-0 border  bg-light px-1" onClick={()=>ChangeStateUse(index,'month')} style={{fontSize:"12px", cursor:"pointer"}}>Désactiver tout</p>
                            </div>
                        <HStack>
                          {equipementsUsage[index].month.map((use,i)=>(<Button key={i} color={use?"green":""} onClick={()=>changeEqpmntUsage(index,"month",i)} appearance={use?"primary":"default"} size="xs">{mois[i]}</Button>))}
                        </HStack>
                          </div>
                          </div>
                          <div className="col-md-6">
                          <div className="jour">
                            <div className="title d-flex align-items-end mb-1">
                              <p>Jours</p> <p className="ms-3 mt-0 border change-state bg-light px-1" onClick={()=>ChangeStateUse(index,'day')} style={{fontSize:"12px", cursor:"pointer"}}>Désactiver tout</p>
                            </div>
                        <HStack>
                          {equipementsUsage[index].day.map((use,i)=>(<Button key={i} color={use?"green":""} onClick={()=>changeEqpmntUsage(index,"day",i)} appearance={use?"primary":"default"} size="xs">{day[i]}</Button>))}
                        </HStack>
                          </div>
                          </div>
                          </div>
    
                          <div className="Hour mt-1">
                            <div className="title d-flex align-items-end mb-1">
                              <p>Heures</p> <p className="ms-3 mt-0 border change-state  bg-light px-1" onClick={()=>ChangeStateUse(index,'hour')} style={{fontSize:"12px", cursor:"pointer"}}>Désactiver tout</p>
                            </div>    
                        <HStack>
                          {equipementsUsage[index].hour.map((use,i)=>(<Button key={i} color={use?"green":""} onClick={()=>changeEqpmntUsage(index,"hour",i)} appearance={use?"primary":"default"} size="xs">{i<10?"0":""}{i}h</Button>))}
                        </HStack>
                        </div>
                      </Panel>
                      </div>
                  </Panel>
                ))}
                {/* <div className={`calculate text-center `}>
                <button  className="btn btn-success" onClick={validateConso}>Calculer</button>
              </div> */}
              </div>
              <div className="bouton-ajout mb-3">
                  <button className="w-100 btn btn-light add-eqpmt" onClick={addEquipement}>+ Ajouter un équipement</button>
                </div>
            </>
          )}
          {choixEstConso === "B" && (
            <div className="facture">
            <div className="row">
              {factureData.map((item,index)=>(
                <Facture key={index} libelle={item.label} value={item.value}/>
              ))}
            </div>
            <div className="row">
            {['Positive','Negative','Constante','Aléatoire'].map((label,index)=>(
              <Profil key={index} label={label}/>
            ))}
          </div>
          </div>
          )}
              </div>
              <NavButton handleclick={handleClick}/>
        </div>
      </div>
      </div>
    );
};

export default CalculConso;