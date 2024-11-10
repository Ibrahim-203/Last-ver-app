import React, { useState } from 'react';
import SideBar from '../component/SideBar';
import Header from '../component/Header';
import { InputNumber } from 'rsuite';
import { useAppContext } from '../context/AppContext';
import { coutIstallation, coutProduction, FormCO2, FormPollution, FormSoustraitAns, retourInstissement } from '../utils/formule';
import { useNavigate } from 'react-router-dom';
import NavButton from '../component/NavButton';
const EtudeEco = () => {

  const navigate = useNavigate()
  const {infoEconomie, setInfoEconomie, courbeChargeData,puissanceTotalInstallation, setInfoEnv, ensBatt} = useAppContext()

      const validateEco = ()=>{
        let totalConsommation = 0
        courbeChargeData.year.map((item)=>{
          totalConsommation +=item
        })
        // Economique result
        const energieAutoConso = ensBatt.energieConsommee
        const energieReste = ensBatt.energieReste
        const energieSoutire = ensBatt.soutire.reduce((a,b)=>a+b,0)
        const coutInstallation = infoEconomie[0].donnees.estimation
        // On miltiplie par 365 pour avoir une valeur annuel
        const coutProd =  Math.floor(coutProduction(energieAutoConso,energieReste,energieSoutire,infoEconomie[0].donnees.tarif)*365)
        // console.log("Coût de l'installation : ",coutIstallation(100000, 200000))
        const retourInvest = retourInstissement(coutInstallation,coutProd)

        // Environnementale
        const pollution = FormPollution(puissanceTotalInstallation)
        const soustrait = FormSoustraitAns(puissanceTotalInstallation)
        const CO2Evite = FormCO2(soustrait, pollution)
        console.log('pollution',pollution)
        console.log('soustrait',soustrait)
        console.log('CO2Evite', CO2Evite)

        setInfoEnv(prevState=>{
          const newInfo = {...prevState}
          newInfo.pollution = pollution
          newInfo.soustrait = soustrait
          newInfo.CO2 = CO2Evite
          return newInfo
        })
      setInfoEconomie(prevState=>{
          const newInfo = [...prevState]
          newInfo[0].resultat.coutProd = coutProd;
          newInfo[0].resultat.retourInstissement = retourInvest;
          return newInfo
        })
      }

      const handleClick = ()=>{
        validateEco()
        navigate('/report')
      }
      // Function partie éco
      const changeInfoEco = (value, name)=>{
        const newInfo = [...infoEconomie]
        newInfo[0].donnees[name] = value
        setInfoEconomie(newInfo)
      }
      // Function partie éco
    return (
        <div className= "page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
        data-sidebar-position="fixed" data-header-position="fixed">
        {/* Sidebar Start */}
          <SideBar/>
        {/*  Sidebar End */}
        {/*  Main wrapper */}
        <div className= "body-wrapper">
          {/*  Header Start */}
          <Header step={"Etude économique"}/>
          {/*  Header End */}
          <div className= "container-fluid">
            <div className='card p-2'>
            <div className="principale d-flex">
                <div>
                  <label for="" className="form-label">
                      Prix estimatif de l'installation
                    </label>
                    <InputNumber 
                    size="sm" 
                    value={infoEconomie[0].donnees.estimation}
                    onChange={(value)=>changeInfoEco(value, "estimation")}
                    placeholder="Ar"
                    />
                </div>
              
              </div>
              </div>
              <NavButton handleclick={handleClick}/>
        </div>
      </div>
      </div>
    );
};

export default EtudeEco;