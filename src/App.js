import logo from './logo.svg';
import './App.css';
import 'rsuite/dist/rsuite.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import DimOnd from './pages/DimOnd';
import CalculConso from './pages/CalculConso';
import DimBatt from './pages/DimBatt';
import SecuMat from './pages/SecuMat';
import AutoConso from './pages/AutoConso'
import EtudeEco from './pages/EtudeEco';
import Report from './pages/Report';
import { AppProvider } from './context/AppContext';
import StartPage from './pages/StartPage';
import ExcelTest from './pages/ExcelTest';
import AggregateData from './pages/AggregateData';
import Print from './pages/Print';
import Exemple from './pages/Exemple';
 

function App() {
  return (
  <AppProvider>
    <BrowserRouter>
    <Routes>
      
      <Route path='/installation' element={<Home/>} />
      <Route path='/dim-ond' element={<DimOnd/>} />
      <Route path='/calc-conso' element={<CalculConso/>} />
      <Route path='/dim-batt' element={<DimBatt/>} />
      <Route path='/sec-mat' element={<SecuMat/>} />
      <Route path='/autocons' element={<AutoConso/>} />
      <Route path='/etude-eco' element={<EtudeEco/>} />
      <Route path='/report' element={<Report/>} />
      <Route path='/' element={<StartPage/>} />
      <Route path='/excel' element={<ExcelTest/>} />
      <Route path='/aggr' element={<AggregateData/>}/>
      <Route path='/print' element={<Print/>}/>
      <Route path='/exemple' element={<Exemple/>}/>
      
    </Routes>
  </BrowserRouter>
  </AppProvider>
  );
}

export default App;
