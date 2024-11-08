import React from 'react';
import SideBar from '../component/SideBar';
import Header from '../component/Header';
import { useAppContext } from '../context/AppContext';
import DognutChart from '../component/DognutChart';
import { useNavigate } from 'react-router-dom';
import NavButton from '../component/NavButton';
const AutoConso = () => {

  const navigate = useNavigate()
  const {dataAutoconso, 
        setDataAutoconso,
      productionUnitPanel,
    setProductionUnitPanel,
    courbeChargeData
  } = useAppContext()

  const mois = ['jan','fev','mars','avr','mai','jiun','juil','août','sept','oct','nov','dec']
  const dataDog = {
    labels: [
      'Autoconsommée',
      'Autoproduite'
    ],
    datasets: [{
      label: "Profil d'autoconsommation",
      data: dataAutoconso,
      backgroundColor: [
        'rgb(255, 3, 3)',
        'rgb(255, 165, 0)',
      ],
      hoverOffset: 4
    }]
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
          <Header step={"Autoconsommation"}/>
          {/*  Header End */}
          <div className= "container-fluid">
            <div className='card p-2'>
            <div className="bilan-autoconsommation mt-3">
          <div className="text-center">
          <p>Bilan d'autoconsommation</p>
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <div width="40%" height="300px">
              {dataAutoconso && <DognutChart data={dataDog}/>}
            </div>
          </div>
          {/* Resultat sous forme de tableau */}
          <div className="d-flex justify-content-center">
            <table
              className="table table-striped"
              width="70%"
            >
              <thead>
                <tr className="text-center">
                  <th scope="col">Mois</th>
                  <th scope="col" >Production (Kwh)</th>
                  <th scope="col">Consommation (Kwh)</th>
                </tr>
              </thead>
              <tbody>
              {productionUnitPanel.length>0 && productionUnitPanel[0].map((item,id)=>(
              <tr className="text-center">
                <td scope="row">{mois[id]}</td>
                <td>{item.toFixed(2)}</td>
                <td>{courbeChargeData.year[id]}</td>
              </tr>
              ))}
                
              </tbody>
            </table>
          </div>
          
          
          </div>
              </div>
              <NavButton handleclick={()=>navigate('/etude-eco')}/>
        </div>
      </div>
      </div>
    );
};

export default AutoConso;