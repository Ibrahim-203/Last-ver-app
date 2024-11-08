// src/App.js
import React from 'react';
import IrradiationChart from '../component/IrradiationChart';

function AggregateData() {
  return (
    <div className="App">
      <h1>Analyse de l'Irradiation Solaire</h1>
      <IrradiationChart latitude={48.8566} longitude={2.3522} /> {/* Ex: Paris */}
    </div>
  );
}

export default AggregateData;
