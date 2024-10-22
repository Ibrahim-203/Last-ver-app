// Importations nécessaires
import React from 'react';
import { Bar } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Enregistrer les composants de chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin // Plugin de zoom ajouté ici
);

const BarChart = ({ data, title }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
            },
            zoom: {
                pan: {
                    enabled: true,  // Activation du pan
                    mode: 'x',      // Permet de déplacer uniquement sur l'axe Y
                },
                zoom: {
                    wheel: {
                        enabled: true,  // Activation du zoom à la molette
                    },
                    pinch: {
                        enabled: true,  // Activation du zoom par pincement sur appareils tactiles
                    },
                    mode: 'x',         // Zoom uniquement sur l'axe Y
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true, // Assurez-vous que l'échelle commence à 0
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export default BarChart;
