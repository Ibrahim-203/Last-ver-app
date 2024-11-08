// src/api/pvgis.js
import axios from 'axios';

export const fetchHourlyIrradiation = async (latitude, longitude, startYear, endYear) => {
  const url = `http://localhost:3001/proxy/hourTest`;
  const response = await axios.get(url,{
  params : {latitude, longitude}
  });
  return response.data.outputs.hourly;
};
