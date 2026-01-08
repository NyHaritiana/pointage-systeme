import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/pointages`;

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
  const response = await axios.post(`${API_URL}/arrivee`, { id_employee });
  return response.data.pointage; // Retourne uniquement le pointage
};

/**
 * Enregistrer le départ d'un employé
 */
export const enregistrerDepart = async (id_pointage: number): Promise<Pointage> => {
  const response = await axios.put<{ message: string; pointage: Pointage }>(
    `${API_URL}/${id_pointage}/depart`
  );
  return response.data.pointage;
};

/**
 * Récupérer tous les pointages
 */
export const getPointages = async (): Promise<Pointage[]> => {
  const response = await axios.get<Pointage[]>(API_URL);
  return response.data;
};
