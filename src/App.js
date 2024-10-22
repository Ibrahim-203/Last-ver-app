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
function App() {
  return (
  <AppProvider>
    <BrowserRouter>
    <Routes>
      
      <Route path='/' element={<Home/>} />
      <Route path='/dim-ond' element={<DimOnd/>} />
      <Route path='/calc-conso' element={<CalculConso/>} />
      <Route path='/dim-batt' element={<DimBatt/>} />
      <Route path='/sec-mat' element={<SecuMat/>} />
      <Route path='/autocons' element={<AutoConso/>} />
      <Route path='/etude-eco' element={<EtudeEco/>} />
      <Route path='/report' element={<Report/>} />
      
    </Routes>
  </BrowserRouter>
  </AppProvider>
  );
}

export default App;
