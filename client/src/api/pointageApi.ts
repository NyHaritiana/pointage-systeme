// src/api/pointageApi.ts
import axios from "axios";

// URL de base de l'API backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://server-pointage-systeme.onrender.com";

export interface Pointage {
  id_pointage: number;
  id_employee: number;
  date_pointage: string;
  heure_arrivee: string;
  heure_depart: string | null;
  statut: "Présent" | "Absent" | "Retard" | "Permission";
  Employee?: {
    prenom: string;
    nom: string;
  };
}

interface ApiResponse {
  pointage: Pointage;
  message: string;
  timestamp?: string;
}

/**
 * Obtenir l'heure locale formatée (correction fuseau horaire)
 */
const getLocalTime = (): { heure: string; date: string } => {
  const maintenant = new Date();
  
  // Utiliser l'heure locale directement
  const heures = maintenant.getHours().toString().padStart(2, '0');
  const minutes = maintenant.getMinutes().toString().padStart(2, '0');
  const secondes = maintenant.getSeconds().toString().padStart(2, '0');
  
  const annee = maintenant.getFullYear();
  const mois = (maintenant.getMonth() + 1).toString().padStart(2, '0');
  const jour = maintenant.getDate().toString().padStart(2, '0');
  
  return {
    heure: `${heures}:${minutes}:${secondes}`,
    date: `${annee}-${mois}-${jour}`
  };
};

/**
 * Fonction pour convertir une heure UTC en heure locale pour l'affichage
 * Exportée pour être utilisée dans le composant
 */
export const convertToLocalTime = (timeStr: string): string => {
  if (!timeStr || timeStr.trim() === "" || timeStr === "null") return "";
  
  try {
    // Si l'heure est déjà au format HH:mm:ss
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    
    // Vérifier si c'est une heure valide
    if (isNaN(hours) || isNaN(minutes)) return timeStr;
    
    // Créer une date avec l'heure
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    // Vérifier si l'heure semble être en UTC (heures > 23 après conversion locale)
    const localHours = date.getHours();
    const localMinutes = date.getMinutes();
    
    // Formater l'heure locale
    const formattedHours = localHours.toString().padStart(2, '0');
    const formattedMinutes = localMinutes.toString().padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}`;
  } catch (error) {
    console.error("Erreur conversion heure:", error, timeStr);
    return timeStr;
  }
};

/**
 * Version alternative qui tente de détecter si l'heure est en UTC
 */
export const convertToLocalTimeWithDetection = (timeStr: string): string => {
  if (!timeStr || timeStr.trim() === "" || timeStr === "null") return "";
  
  try {
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    
    if (isNaN(hours) || isNaN(minutes)) return timeStr;
    
    // Si l'heure est > 23, c'est probablement en UTC mal formaté
    if (hours >= 24) {
      // Convertir les heures UTC
      const utcHours = hours % 24;
      const date = new Date();
      date.setUTCHours(utcHours, minutes, 0, 0);
      
      const localHours = date.getHours().toString().padStart(2, '0');
      const localMinutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${localHours}:${localMinutes}`;
    }
    
    // Sinon, utiliser l'heure telle quelle
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error("Erreur conversion avec détection:", error);
    return timeStr;
  }
};

/**
 * Enregistrer l'arrivée d'un employé avec l'heure locale
 */
export const enregistrerArrivee = async (id_employee: number, date?: string): Promise<Pointage> => {
  try {
    // Obtenir l'heure locale
    const localTime = getLocalTime();
    const heureActuelle = localTime.heure;
    
    // Utiliser la date fournie ou aujourd'hui
    const datePointage = date || localTime.date;
    
    console.log("Envoi requête arrivée:", {
      id_employee,
      date: datePointage,
      heure_arrivee: heureActuelle,
      fuseau_horaire: Intl.DateTimeFormat().resolvedOptions().timeZone,
      offset: new Date().getTimezoneOffset()
    });
    
    const response = await axios.post<ApiResponse>(
      `${API_BASE_URL}/api/pointages/arrivee`,
      { 
        id_employee,
        date: datePointage,
        heure_arrivee: heureActuelle,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezone_offset: new Date().getTimezoneOffset()
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log("Réponse arrivée:", response.data);
    return response.data.pointage;
  } catch (error: unknown) {
    console.error("Erreur enregistrerArrivee:", error);
    
    if (axios.isAxiosError(error)) {
      console.error("Détails erreur:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: `${API_BASE_URL}/api/pointages/arrivee`
      });
    }
    
    throw error;
  }
};

/**
 * Enregistrer le départ d'un employé avec l'heure locale
 */
export const enregistrerDepart = async (id_pointage: number): Promise<Pointage> => {
  try {
    // Obtenir l'heure locale
    const localTime = getLocalTime();
    const heureDepart = localTime.heure;
    
    console.log("Envoi requête départ:", {
      id_pointage,
      heure_depart: heureDepart,
      fuseau_horaire: Intl.DateTimeFormat().resolvedOptions().timeZone,
      offset: new Date().getTimezoneOffset()
    });
    
    const response = await axios.put<ApiResponse>(
      `${API_BASE_URL}/api/pointages/depart/${id_pointage}`,
      { 
        heure_depart: heureDepart,
        id_pointage: id_pointage,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezone_offset: new Date().getTimezoneOffset()
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log("Réponse départ:", response.data);
    return response.data.pointage;
  } catch (error: unknown) {
    console.error("Erreur enregistrerDepart:", error);
    
    if (axios.isAxiosError(error)) {
      console.error("Détails erreur départ:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        method: error.config?.method
      });
    }
    
    throw error;
  }
};

/**
 * Récupérer tous les pointages
 */
export const getPointages = async (): Promise<Pointage[]> => {
  try {
    const response = await axios.get<Pointage[]>(
      `${API_BASE_URL}/api/pointages`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    console.log("Pointages récupérés:", response.data.length);
    return response.data;
  } catch (error: unknown) {
    console.error("Erreur getPointages:", error);
    throw error;
  }
};

/**
 * Récupérer les pointages par date
 */
export const getPointagesByDate = async (date: string): Promise<Pointage[]> => {
  try {
    const response = await axios.get<Pointage[]>(
      `${API_BASE_URL}/api/pointages/date/${date}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error: unknown) {
    console.error("Erreur getPointagesByDate:", error);
    throw error;
  }
};

/**
 * Vérifier si l'API est accessible
 */
export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health`, {
      timeout: 5000
    });
    return response.status === 200;
  } catch (error: unknown) {
    console.error("API health check failed:", error);
    return false;
  }
};