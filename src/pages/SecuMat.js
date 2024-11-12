import React, { useEffect } from 'react';
import SideBar from '../component/SideBar';
import Header from '../component/Header';
import { InputNumber } from 'rsuite';
import { useAppContext } from '../context/AppContext';
import Swal from 'sweetalert2'
import { formIntensite, formIntensiteAC, formSection } from '../utils/formule';
import NavButton from '../component/NavButton';
import { useNavigate } from 'react-router-dom';
import Joyride from 'react-joyride';

const SecuMat = () => {
  
      const navigate = useNavigate()
      // Variable pour sécurité
      const {infoSecu, setInfoSecu,infoBatt, infoOnduleur, installationInfo, ensBatt,helpBox} = useAppContext()
      useEffect(()=>{
        console.log(ensBatt);
        
      })
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
      // Variable pour sécurité
      const validateSecu = ()=>{
        if(infoSecu[0].donnees.chuteTension ==="" || 
          infoSecu[0].donnees.installation ==="" || 
          infoSecu[0].donnees.materiel ==="" || 
          infoSecu[0].donnees.distBattOnd ==="" || 
          infoSecu[0].donnees.distOndUse ==="" || 
          infoSecu[0].donnees.distPannOnd ===""
        ){
          customAlert("Données manquant","Tous les information sont obligatoire" )
          return false
        }else{
          const puissanceBatterie =  parseFloat(infoBatt[0].resultat.puissanceBatterie)
          const puissanceOnduleur =  parseFloat(infoOnduleur[0].resultat.puissanceOnduleur)
          console.log(puissanceOnduleur);
          const materiel = parseFloat(infoSecu[0].donnees.materiel)
          const tensionBatt =  parseFloat(infoBatt[0].resultat.tensionBatt)
          const chuteTension =  parseFloat(infoSecu[0].donnees.chuteTension)
          const distBattOnd =  parseFloat(infoSecu[0].donnees.distBattOnd)
          const distPannOnd =  parseFloat(infoSecu[0].donnees.distPannOnd)
          const distOndUse =  parseFloat(infoSecu[0].donnees.distOndUse)
          

          const tensionSortieOnd = infoSecu[0].donnees.installation ==="mono"?230:380
          const intensiteAc = formIntensiteAC(infoSecu[0].donnees.installation, puissanceOnduleur)
          const intensiteDc = formIntensite(puissanceBatterie, tensionBatt)
          console.log(materiel,puissanceBatterie,puissanceOnduleur,materiel,tensionBatt,chuteTension,distBattOnd,distPannOnd,distOndUse,intensiteAc,intensiteDc);
          //Défaut : tension de la batterie
          const cableBattOnd = formSection(materiel, distBattOnd, intensiteAc, chuteTension, tensionBatt)

          const cableOndUse = formSection(infoSecu[0].donnees.materiel, distOndUse, intensiteAc, chuteTension, tensionSortieOnd)

          const cablePannOnd = formSection(infoSecu[0].donnees.materiel, distPannOnd, installationInfo.ISC, chuteTension, installationInfo.VOC)

          const newInfo = [...infoSecu] 
          newInfo[0].resultat.cableBattOnd = cableBattOnd
          newInfo[0].resultat.cableOndUse = cableOndUse
          newInfo[0].resultat.cablePannOnd = cablePannOnd
          setInfoSecu(newInfo)
          
          return true
        }
      }
      const handleclick = ()=>{
        if (!validateSecu()) return
        navigate('/autocons')
      }
      // Function sécurité
      const changeinfoSecu = (value, name)=>{
        const newInfo = [...infoSecu]
        newInfo[0].donnees[name] = value
        setInfoSecu(newInfo)
      }

       // guide
  const steps = [
    {
      target: '.champs-eqpmt',
      content: 'Entrer ici les distances entre les equipements - NB : pour une direction seulement',
    },
  ];




  // guide


    return (
        <div className= "page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
        data-sidebar-position="fixed" data-header-position="fixed">
        {/* Sidebar Start */}
        {helpBox && <Joyride
        steps={steps}
        />}
          <SideBar/>
        {/*  Sidebar End */}
        {/*  Main wrapper */}
        <div className= "body-wrapper">
          {/*  Header Start */}
          <Header step={"Sécurité des matérieaux"} isHelp={helpBox}/>
          {/*  Header End */}
          <div className= "container-fluid">
            <div className='card p-2'>
            <div>
            <div className="row">
              <div className="col-md-2">
                <div className="mb-3">
                  <label for="" className="form-label">
                    Choix d'installation
                  </label>
                  <select
                    name="installation"
                    className="form-control form-control-sm"
                    id=""
                    onChange={(event)=>changeinfoSecu(event.target.value, "installation")}
                    value={infoSecu[0].donnees.installation}
                  >
                    <option value="mono">Monophasé</option>
                    <option value="tri">Triphasé</option>
                  </select>
                </div>
              </div>
              <div className="col-md-2">
                <div className="mb-3">
                  <label for="" className="form-label">
                    Choix du matériel
                  </label>
                  <select
                    name=""
                    className="form-control form-control-sm"
                    id=""
                    onChange={(event)=>changeinfoSecu(event.target.value, "materiel")}
                    value={infoSecu[0].donnees.materiel}
                  >
                    <option value="0.023">Cuivre</option>
                    <option value="0.028">Aluminium</option>
                  </select>
                </div>
              </div>
              <div className="col-md-2">
                <div className="mb-3">
                  <label for="" className="form-label">
                    Chute de tension
                  </label>
                  <select
                    name=""
                    className="form-control form-control-sm"
                    id=""
                    onChange={(event)=>changeinfoSecu(event.target.value, "chuteTension")}
                    value={infoSecu[0].donnees.chuteTension}
                  >
                    <option value="0.01">1 %</option>
                    <option value="0.02">2 %</option>
                    <option value="0.03">3 %</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <h5 className='card-title'>Section du fils</h5>
              <div className="d-md-flex champs-eqpmt">
                  <div className="mb-3 ms-2">
                    <label for="" className="form-label">
                      Panneau - onduleur
                    </label>
                    <InputNumber 
                    size="sm" 
                    value={infoSecu[0].donnees.distPannOnd}
                    onChange={(value)=>changeinfoSecu(value,"distPannOnd")}
                    placeholder="m"
                    />
                </div>
                  <div className="mb-3 ms-2">
                    <label for="" className="form-label">
                      Batterie - onduleur
                    </label>
                    <InputNumber 
                    size="sm" 
                    value={infoSecu[0].donnees.distBattOnd}
                    onChange={(value)=>changeinfoSecu(value,"distBattOnd")}
                    placeholder="m"
                    />
                  </div>
                  <div className="mb-3 ms-2">
                    <label for="" className="form-label ">
                      Onduleur - utilisation
                    </label>
                    <InputNumber 
                    size="sm" 
                    value={infoSecu[0].donnees.distOndUse} 
                    onChange={(value)=>changeinfoSecu(value,"distOndUse")}
                    placeholder="m"
                    />
                </div>
              </div>
            </div>
          </div>
              </div>
              <NavButton handleclick={handleclick}/>
        </div>
      </div>
      </div>
    );
};

export default SecuMat;