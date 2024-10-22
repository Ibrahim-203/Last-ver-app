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
  const {infoEconomie, setInfoEconomie, courbeChargeData,puissanceTotalInstallation, setInfoEnv} = useAppContext()

      const validateEco = ()=>{
        let totalConsommation = 0
        courbeChargeData.year.map((item)=>{
          totalConsommation +=item
        })
        // Economique result
        const energieAutoConso = 0
        const energieReste = 0
        const energieSoutire = 0

        console.log("Coût de production : ",coutProduction(energieAutoConso,energieReste,energieSoutire,infoEconomie[0].donnees.tarif))
        console.log("Coût de l'installation : ",coutIstallation(100000, 200000))
        console.log("Retour sur investissement: ",retourInstissement(coutIstallation(100000, 200000),coutProduction(20,200,0,0.875)))

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