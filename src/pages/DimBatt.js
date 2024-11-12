import React, { useEffect, useState } from 'react';
import SideBar from '../component/SideBar';
import Header from '../component/Header';
import { InputNumber } from 'rsuite';
import { useAppContext } from '../context/AppContext';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import NavButton from '../component/NavButton';

const DimBatt = () => {

      const navigate = useNavigate()
      // Variable batterie
      const {infoBatt, 
            setInfoBatt,
            setEnsBatt,
            infoEconomie,
            helpBox
            } = useAppContext()
    // Variable 
    useEffect(()=>console.log(infoEconomie[0].donnees.tarif))

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
      // Function partie batterie
  const changeInfoBatt = (value, name)=>{
    const newInfo = [...infoBatt]
    newInfo[0].donnees[name] = value
    setInfoBatt(newInfo)
  }

  const handleclick = ()=>{
    if(!validateBattStep()) return
    navigate('/sec-mat')
  }
  const validateBattStep = ()=>{
    if(infoBatt[0].donnees.capaciteBatt==="" ||
      infoBatt[0].donnees.rendementBatt==="" ||
      infoBatt[0].donnees.puissCharge ==="" ||
      infoBatt[0].donnees.puissDecharge ==="" 
    ){
      
      customAlert("Données manquant","Veillez remplir tous les champs" )
      console.log(infoBatt);
      return false
    }else{
      const capacite = parseFloat(infoBatt[0].donnees.capaciteBatt)
      const rendement = parseFloat(infoBatt[0].donnees.rendementBatt)
      const puissanceCharge = parseFloat(infoBatt[0].donnees.puissCharge)
      const puissanceDecharge = parseFloat(infoBatt[0].donnees.puissDecharge)
      const charge = 60
      let soutire = Array(24).fill(0)

      
      setEnsBatt(prevState=>{
        // Soutiré tavela
        const newInfo = {...prevState}
        let updateCapacity = capacite
        let energieConso = 0
        let resteEnergie = 0
        newInfo.dataConso.forEach((conso,id)=>{
          energieConso += 1
          resteEnergie += 1
          // Verifier si il y a une consommation
          if (conso>0) {
            // consommation inférieur à la production
            console.log("Consommation : ",id," : ", conso);
            console.log("Production : ",id," : ", newInfo.data[id]);
            console.log("capacité : ",id," : ", updateCapacity);
            
            if (conso < newInfo.data[id]) {
              // tester si la capacité de la batterie à déjà été consommé ou pas
              if (capacite>updateCapacity) {
                updateCapacity = updateCapacity+charge <= capacite ? updateCapacity+charge : capacite
              }
              // Si 
              resteEnergie+= newInfo.data[id] - conso
              energieConso +=conso
          // consommation supérieur à la production
        }else {
          console.log("consommation > production", conso, ' : ', newInfo.data[id]);
          if(updateCapacity - (newInfo.dataConso[id] - newInfo.data[id])<puissanceDecharge){
            soutire[id] = newInfo.dataConso[id] - (updateCapacity - puissanceDecharge)
            updateCapacity = puissanceDecharge
            energieConso += conso
          }else{
            updateCapacity = updateCapacity - (newInfo.dataConso[id] - newInfo.data[id])
            resteEnergie+= updateCapacity
            energieConso +=conso
          }
        }
        }else{
           // si il n'y a pas de consommation
           console.log("donnée : ", id);
           console.log("capacité : ",id," : ", updateCapacity);
           if( newInfo.data[id]>0){
            if (capacite>updateCapacity) {
            updateCapacity = updateCapacity+charge <= capacite ? updateCapacity+charge : capacite
          }
           }
           resteEnergie += newInfo.data[id]
           
          }
        newInfo.dataBattery[id] = updateCapacity
      })
      newInfo.energieReste = resteEnergie
      newInfo.energieConsommee = energieConso
      newInfo.soutire = soutire
      return newInfo
      })
      
      setInfoBatt(prevState=>{
        const newInfo = [...prevState]
        const capaciteBatt = newInfo[0].donnees.capaciteBatt
        const newStateResult = newInfo[0].resultat
        const tensionBatt = newStateResult.tensionBatt
        newStateResult.puissanceBatterie = capaciteBatt*tensionBatt
        newInfo[0]= {...newInfo[0],resultat:newStateResult}

        return newInfo
      })
      return true
    }
  }
  // Function partie batterie
    return (
        <div className= "page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
        data-sidebar-position="fixed" data-header-position="fixed">
        {/* Sidebar Start */}
          <SideBar/>
        {/*  Sidebar End */}
        {/*  Main wrapper */}
        <div className= "body-wrapper">
          {/*  Header Start */}
          <Header step={"Dimensionnement de la batterie"} isHelp={helpBox}/>
          {/*  Header End */}
          <div className= "container-fluid">
            <div className='card p-2'>
            <div className="row m-3">
            <div className=" col-md-4 mt-2">
              <p>Capacité utile de la batterie</p>
              <InputNumber placeholder="en Wh" size="sm" value={infoBatt[0].donnees.capaciteBatt} onChange={(value)=>changeInfoBatt(value,"capaciteBatt")} className="mt-2" />
            </div>
            <div className=" col-md-4 mt-2">
              <p>Rendement de la batterie</p>
              <InputNumber placeholder="%" size="sm" value={infoBatt[0].donnees.rendementBatt} onChange={(value)=>changeInfoBatt(value,"rendementBatt")} className="mt-2" />
            </div>
            <div className=" col-md-4 mt-2">
              <p>Puissance maximale en charge</p>
              <InputNumber placeholder="en W" size="sm" value={infoBatt[0].donnees.puissCharge} onChange={(value)=>changeInfoBatt(value,"puissCharge")} className="mt-2" />
            </div>
            <div className=" col-md-4 mt-2">
              <p>Puissance maximale en décharge</p>
              <InputNumber placeholder="en W" size="sm" value={infoBatt[0].donnees.puissDecharge} onChange={(value)=>changeInfoBatt(value,"puissDecharge")} className="mt-2" />
            </div>

          </div>
              </div>
              <NavButton handleclick={handleclick}/>
        </div>
      </div>
      </div>
    );
};

export default DimBatt;