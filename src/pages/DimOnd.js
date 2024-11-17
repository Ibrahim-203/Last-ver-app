import React, {useEffect,useState } from 'react';
import SideBar from '../component/SideBar';
import Header from '../component/Header';
import { SelectPicker } from 'rsuite';
import { useAppContext } from '../context/AppContext';
import NavButton from '../component/NavButton';
import { useNavigate } from 'react-router-dom';
import { formConsoOnduleur, formPuissanceOnduleur } from '../utils/formule';
import Swal from 'sweetalert2';
const DimOnd = () => {

  const navigate = useNavigate()
  const dataChoixSimul = [{label:'Doméstique', value:0.7},{label:'Industrielle', value:1},{label:'Autre usages', value:0.5}]

  const {infoOnduleur, setInfoOnduleur, puissanceTotalInstallation, ensBatt , choixSimul, setChoixSimul,helpBox} = useAppContext()

  useEffect(()=>{
    console.log(ensBatt);
  }, [ensBatt])
  // Fonctions
  const changeinfoOnd = (value, name)=>{
    const newInfo = [...infoOnduleur]
    newInfo[0].donnees[name] = value
    setInfoOnduleur(newInfo)
  }
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
  const validateOnd = ()=>{
    if(!infoOnduleur[0].donnees.coeffSimul){
      customAlert("Données manquant","Veillez remplir le champ" )
      return
    }else{
      // Valeur défaut
      console.log(puissanceTotalInstallation);
      const coeffSimul =  parseFloat(infoOnduleur[0].donnees.coeffSimul)
      const coeffTemp =  parseFloat(infoOnduleur[0].donnees.coeffTemp)
      const cosPhi =  parseFloat(infoOnduleur[0].donnees.cosPhi)
      const puissance =formPuissanceOnduleur(puissanceTotalInstallation,coeffSimul,cosPhi,coeffTemp)
      const conso = formConsoOnduleur(puissance)
      const newInfo = [...infoOnduleur]
      newInfo[0].resultat.puissanceOnduleur = puissance
      newInfo[0].resultat.consoOnduleur = conso
      setInfoOnduleur(newInfo)
      navigate('/dim-batt')
    }
  }
  const handleClick = ()=>{
    validateOnd()
  }
// Fonctions
    return (
        <div className= "page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
        data-sidebar-position="fixed" data-header-position="fixed">
        {/* Sidebar Start */}
          <SideBar/>
        {/*  Sidebar End */}
        {/*  Main wrapper */}
        <div className= "body-wrapper">
          {/*  Header Start */}
          <Header step={"Dimensionnement de l'onduleur"} isHelp={helpBox}/>
          {/*  Header End */}
          <div className= "container-fluid">
            <div className='card p-2'>
            <div className="row mt-3">
            <div className=" col-md-4 mt-2">
              <p>Coefficient de simultanéité</p>
              <SelectPicker size="sm" searchable={false} className="d-block mt-2" data={dataChoixSimul} value={choixSimul} onChange={(value)=>{setChoixSimul(value);changeinfoOnd(value, "coeffSimul"); console.log(value)}} placeholder="Choisir un coefficient correspondant"/>
            </div>
          </div>
              </div>
              <NavButton handleclick={handleClick}/>
        </div>
      </div>
      </div>
    );
};

export default DimOnd;