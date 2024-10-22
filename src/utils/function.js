export function countSpecificDayInMonth(year, month, dayName) {
    // Le jour doit être en minuscule pour correspondre aux noms des jours
    const daysOfWeek = ['dim', 'lun', 'mar','mer','jeu','ven','sam'];
    const dayIndex = daysOfWeek.indexOf(dayName.toLowerCase());
  
    // Si le jour n'est pas valide, retourner 0
    if (dayIndex === -1) {
        console.error("Jour non valide.");
        return 0;
    }
  
    // Compter le nombre de jours dans le mois spécifié
    const date = new Date(year, month + 1, 0); // 0 correspond au dernier jour du mois
    const totalDays = date.getDate();
  
    let count = 0;
  
    // Parcourir chaque jour du mois
    for (let day = 1; day <= totalDays; day++) {
        const currentDate = new Date(year, month, day);
        // Vérifier si le jour correspond à celui spécifié
        if (currentDate.getDay() === dayIndex) {
            count++;
        }
    }
  
    return count;
  }

  export function getFirstDayOfMonth(year, month) {
    // Crée une date pour le premier jour du mois
    const firstDay = new Date(year, month , 1); // Mois commence à 0 en JS
  
    // Récupère le jour de la semaine (0 = dimanche, 1 = lundi, etc.)
    const dayOfWeek = firstDay.getDay();
  
    // Retourne le nom du jour de la semaine
    return dayOfWeek
  }

  export function getDaysInMonth(year, month) {
    // Crée une date pour le premier jour du mois suivant, puis soustrait un jour
    month = month===12? 0 : month
    return new Date(year, month, 0).getDate();
  }