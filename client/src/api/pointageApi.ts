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
}

/**
 * Enregistrer l'arrivée d'un employé avec l'heure actuelle
 */
export const enregistrerArrivee = async (id_employee: number, date?: string): Promise<Pointage> => {
  try {
    // Générer l'heure actuelle au format HH:mm:ss
    const maintenant = new Date();
    const heures = maintenant.getHours().toString().padStart(2, '0');
    const minutes = maintenant.getMinutes().toString().padStart(2, '0');
    const secondes = maintenant.getSeconds().toString().padStart(2, '0');
    const heureActuelle = `${heures}:${minutes}:${secondes}`;
    
    // Utiliser la date fournie ou aujourd'hui
    const datePointage = date || maintenant.toISOString().split('T')[0];
    
    console.log("Envoi requête arrivée:", {
      id_employee,
      date: datePointage,
      heure_arrivee: heureActuelle
    });
    
    const response = await axios.post<ApiResponse>(
      `${API_BASE_URL}/api/pointages/arrivee`,
      { 
        id_employee,
        date: datePointage,
        heure_arrivee: heureActuelle
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
        message: error.message
      });
    }
    
    throw error;
  }
};

/**
 * CORRECTION : Enregistrer le départ avec la bonne URL /depart/:id_pointage
 */
export const enregistrerDepart = async (id_pointage: number): Promise<Pointage> => {
  try {
    // Générer l'heure actuelle pour le départ
    const maintenant = new Date();
    const heures = maintenant.getHours().toString().padStart(2, '0');
    const minutes = maintenant.getMinutes().toString().padStart(2, '0');
    const secondes = maintenant.getSeconds().toString().padStart(2, '0');
    const heureDepart = `${heures}:${minutes}:${secondes}`;
    
    console.log("Envoi requête départ:", {
      id_pointage,
      heure_depart: heureDepart
    });
    
    // CORRECTION : Utiliser la bonne URL /depart/:id_pointage
    const response = await axios.put<ApiResponse>(
      `${API_BASE_URL}/api/pointages/depart/${id_pointage}`,
      { 
        heure_depart: heureDepart,
        id_pointage: id_pointage  // Peut aussi être envoyé dans le body si nécessaire
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
      
      // Afficher plus de détails pour le débogage
      console.log("URL complète tentée:", `${API_BASE_URL}/api/pointages/depart/${id_pointage}`);
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