// src/api/pointageApi.ts
import axios from "axios";

// URL de base de l'API backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://pointage-systeme.onrender.com";

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

/**
 * Enregistrer l'arrivée d'un employé
 */
export const enregistrerArrivee = async (id_employee: number): Promise<Pointage> => {
  try {
    console.log("Envoi requête arrivée pour employé:", id_employee);
    console.log("URL:", `${API_BASE_URL}/api/pointages/arrivee`);
    
    const response = await axios.post(
      `${API_BASE_URL}/api/pointages/arrivee`,
      { id_employee },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log("Réponse arrivée:", response.data);
    return response.data.pointage;
  } catch (error) {
    console.error("Erreur enregistrerArrivee:", error);
    if (axios.isAxiosError(error)) {
      console.error("Détails erreur:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }
    throw error;
  }
};

/**
 * Enregistrer le départ d'un employé
 */
export const enregistrerDepart = async (id_pointage: number): Promise<Pointage> => {
  try {
    console.log("Envoi requête départ pour pointage:", id_pointage);
    
    const response = await axios.put<{ message: string; pointage: Pointage }>(
      `${API_BASE_URL}/api/pointages/${id_pointage}/depart`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log("Réponse départ:", response.data);
    return response.data.pointage;
  } catch (error) {
    console.error("Erreur enregistrerDepart:", error);
    throw error;
  }
};

/**
 * Récupérer tous les pointages
 */
export const getPointages = async (): Promise<Pointage[]> => {
  try {
    console.log("Récupération des pointages...");
    
    const response = await axios.get<Pointage[]>(
      `${API_BASE_URL}/api/pointages`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Erreur getPointages:", error);
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
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
};