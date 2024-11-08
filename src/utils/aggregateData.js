// src/utils/aggregateData.js
export const aggregateToDailyAverage = (hourlyData) => {
    const dailyData = {};
  
    hourlyData.forEach((entry) => {
      const date = entry.time.slice(0, 10); // Extraire la date (YYYY-MM-DD)
      if (!dailyData[date]) {
        dailyData[date] = { sum: 0, count: 0 };
      }
      dailyData[date].sum += entry['G(i)'] // G(h) est l'irradiation
      dailyData[date].count += 1;
    });
  
    // Calculer les moyennes
    return Object.entries(dailyData).map(([date, { sum, count }]) => ({
      date,
      average: sum / count,
    }));
  };
  