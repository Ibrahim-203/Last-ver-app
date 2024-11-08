import React, { createContext, useContext, useState } from 'react';

// Créer le contexte
const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Variable de l'installation

    const [offline, setOffline] = useState(!navigator.onLine);
    const [dataEns, setDataEns] = useState([]);
    const [dataAutoconso,setDataAutoconso] = useState([75,25])
    const [installation, setInstallation] = useState([
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
            // Variable batterie
            const [infoBatt, setInfoBatt] = useState([
                {
                  donnees : {
                    capaciteBatt : "",
                    rendementBatt : "",
                    puissCharge:"",
                    puissDecharge:""
                },
              resultat : {
                puissanceBatterie : 0,
                // Défaut
                tensionBatt : 12
              }
              }
            ])
      const [position, setPosition] = useState(null);
      const [productionUnitPanel, setProductionUnitPanel] = useState([])
      const [isDataGet, setIsDataGet] = useState(false)
      const [productionInstallation, setProductionInstallation] = useState([])
      const [installationInfo, setInstallationInfo] = useState({
        VOC:0,
        ISC:0,
        totalPanel:0
      })
      const [activeKey, setActiveKey] = useState(1);
      const [onduleur, setOnduleur] = useState(0);
      const [checked, setChecked] = useState(false);
      const [localisation, setLocalisation] = useState({
        latitude: 0,
        longitude: 0,
      });
      let [puissanceTotalInstallation, setPuissanceTotalInstallation] = useState(0)
      const [nomProjet, setNomProjet] = useState('Mon projet')
    // Variable de la consommation
    const [equipementsDescription, setEquipementsDescription] = useState([
        {equipement: "",
        puissance: "",
        nombre: "",
        puissanceTotal: "",
      },
  ]);
  const [choixInstallation, setChoixInstallation] = useState(null)
  const [choixTarif, setChoixTarif] = useState(null)


  const [equipementsUsage, setEquipementsUsage] = useState([
    {
      month : Array(12).fill(true),
      day : Array(7).fill(true),
      hour : Array(24).fill(true),
    },
]);
const [factureData, setFactureData] = useState([
    {
      label: "Janvier",
      data : ""
    },
    {
      label: "Fevrier",
      data : ""
    },
    {
      label: "Mars",
      data : ""
    },
    {
      label: "Avril",
      data : ""
    },
    {
      label: "Mai",
      data : ""
    },
    {
      label: "Juin",
      data : ""
    },
    {
      label: "Juillet",
      data : ""
    },
    {
      label: "Août",
      data : ""
    },
    {
      label: "Septembre",
      data : ""
    },
    {
      label: "Octobre",
      data : ""
    },
    {
      label: "Novembre",
      data : ""
    },
    {
      label: "Décembre",
      data : ""
    },
])
    // Variable de la partie autoconsommation
    // Variable de la partie batterie
    const [ensBatt, setEnsBatt] = useState({
      label:[],
      data:[],
      ens : [],
      dataConso:[],
      dataBattery:Array(24).fill(0),
      soutire:0
    });
    // Variable de la partie onduleur
    const [infoOnduleur, setInfoOnduleur] = useState([
        {donnees : {
          coeffSimul : "",
          cosPhi : "",
          coeffTemp : 0.8
        },
      resultat : {
        puissanceOnduleur :"",
        consoOnduleur : ""
      }
      }
      ])
    const [choixSimul, setChoixSimul] = useState(null)

    // Variable de la partie etude économique
    const [infoEconomie, setInfoEconomie] = useState([
        {donnees : {
          estimation : 0,
          tarif:0,
        },
      resultat : {
        coutProd : 0,
        coutInstallation : 0,
        retourInvest : 0,
      }
      }
      ])
    // Variable de la partie sécurité

    const [infoSecu, setInfoSecu] = useState([
        {donnees : {
          installation : "mono",
          materiel : "0.023",
          chuteTension : "0.01",
          distPannOnd:'',
          distBattOnd:'',
          distOndUse:'',
        },
      resultat : {
        cableBattOnd:"",
        cablePannOnd:"",
        cableOndUse:""
      }
      }
      ])

      // Variable environnemental
      const [infoEnv, setInfoEnv] = useState({
        pollution:0,
        soustrait : 0,
        CO2 : 0
      })

      // Variable Rapport

      const [courbePuissData, setCourbePuissData] = useState([])
      const [labelCourbePuiss, setLabelCourbePuiss] = useState([])
      const [monthConso, setMonthConso] = useState(false);
      const [courbeChargeData, setCourbeChargeData] = useState({
        hourLabel : [],
        year : [],
        month : []
      })


    return (
        <AppContext.Provider value={{
            installation,
            setInstallation,
            position,
            setPosition,
            productionUnitPanel,
            setProductionUnitPanel,
            productionInstallation,
            setProductionInstallation,
            installationInfo,
            setInstallationInfo,
            activeKey,
            setActiveKey,
            onduleur, 
            setOnduleur,
            checked, 
            setChecked,
            localisation, 
            setLocalisation,
            puissanceTotalInstallation, 
            setPuissanceTotalInstallation,
            nomProjet, 
            setNomProjet,
            equipementsDescription, 
            setEquipementsDescription,
            equipementsUsage, 
            setEquipementsUsage,
            factureData,
            setFactureData,
            infoOnduleur, 
            setInfoOnduleur,
            infoEconomie, 
            setInfoEconomie,
            infoBatt, 
            setInfoBatt,
            infoSecu, 
            setInfoSecu,
            dataEns, 
            setDataEns,
            dataAutoconso,
            setDataAutoconso,
            ensBatt, 
            setEnsBatt,
            courbePuissData, 
            setCourbePuissData,
            labelCourbePuiss, 
            setLabelCourbePuiss,
            courbeChargeData, 
            setCourbeChargeData,
            monthConso,
            setMonthConso,
            infoEnv, 
            setInfoEnv,
            choixSimul, 
            setChoixSimul,
            choixInstallation, 
            setChoixInstallation,
            choixTarif, 
            setChoixTarif,
            offline,
            setOffline
        }}>
          {children}
        </AppContext.Provider>
      );
}

// Hook personnalisé pour utiliser le contexte
export const useAppContext = () => {
    return useContext(AppContext);
  };