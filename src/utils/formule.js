// formule onduleur
export function formPuissanceOnduleur(puissTotInstallation,coeffSimul,cosPhi, coeffTemp){
    return (puissTotInstallation*coeffSimul)/(cosPhi*coeffTemp)
}
export function formConsoOnduleur(puissOnduleur){
    return (puissOnduleur/100)*24
}

// formule onduleur

// formule batterie

// formule batterie


// formule sécurité

export function formIntensiteAC (installation,puissanceOnduleur){
    if(installation==="mono"){
        return puissanceOnduleur / 230
    }else{
        return puissanceOnduleur / 380 * Math.sqrt(3)
    }
    
}
// Pour la partie DC la puissance et la tension est celle du batterie
export function formIntensite (puissance,tension){
    return puissance / tension
}

export function formSection(resistivite, L, courantconcerne, chuteTension, tensionConcerner){
    return ((resistivite*2*L*courantconcerne)/(chuteTension*tensionConcerner)).toFixed(2)
}
// formule sécurité

//formule partie économique: 

export function coutProduction (energieAutoConso,energiReste,energieSoutire,prixTarif){
    return (energieAutoConso + energiReste) - energieSoutire * prixTarif
}

export function coutIstallation(coutMainOeuvre,coutEstimatif){
    return coutMainOeuvre + coutEstimatif
}

export function retourInstissement(coutInstallation, coutProductionAnnuel){
    return coutInstallation/coutProductionAnnuel
}

//formule partie économique: 

//formule partie environnementale:
export function FormPollution (pussanceInstallation){
    return 36 * pussanceInstallation
}
export function FormSoustraitAns (pussanceInstallation){
    return 600 * pussanceInstallation
}
export function FormCO2 (soustrait, pollut){
    return soustrait - pollut
}
//formule partie environnementale: 