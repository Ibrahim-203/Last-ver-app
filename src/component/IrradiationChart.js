// src/components/IrradiationChart.js
import React, { useEffect, useState } from 'react';
import { fetchHourlyIrradiation } from '../api/pvgis';
import { aggregateToDailyAverage } from '../utils/aggregateData';
import { Line } from 'react-chartjs-2';
import { plugins } from 'chart.js';

const IrradiationChart = ({ latitude, longitude }) => {
  const [dailyData, setDailyData] = useState([]);
  console.log(latitude);
  

  useEffect(() => {
    const fetchData = async () => {
      const hourlyData = await fetchHourlyIrradiation(latitude, longitude, 2023, 2023);
      const aggregatedData = aggregateToDailyAverage(hourlyData);
      setDailyData(aggregatedData);
    };
    fetchData();
  }, [latitude, longitude]);

  const options = {
    tension : 0.4,
    plugins : {
      zoom: {
        pan: {
            enabled: true,  // Activation du pan
            mode: 'x',      // Permet de déplacer uniquement sur l'axe X
        },
        zoom: {
            wheel: {
                enabled: true,  // Activation du zoom à la molette
            },
            pinch: {
                enabled: true,  // Activation du zoom par pincement sur appareils tactiles
            },
            mode: 'x',         // Zoom uniquement sur l'axe X
        },
    },
    }
  }

  // Préparer les données pour le graphique
  const chartData = {
    labels: dailyData.map((data) => data.date),
    datasets: [
      {
        label: 'Irradiation quotidienne moyenne (Wh/m²)',
        data: dailyData.map((data) => data.average),
        borderColor: 'rgba(75,192,192,1)',
        fill: true,
      },
    ],

  };

  return (
    <div>
      <h2>Irradiation Solaire Moyenne Quotidienne</h2>
      <Line data={chartData} options={options}/>
    </div>
  );
};

export default IrradiationChart;
