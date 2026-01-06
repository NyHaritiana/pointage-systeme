import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/pointages`;

export interface Pointage {
  id_pointage: number;
  id_employee: number;
  date_pointage: string;
  heure_arrivee: string;
  heure_depart: string;
  statut: "Présent" | "Absent" | "Retard" | "Permission";
  Employee?: {
    prenom: string;
    nom: string;
  };
}

export const enregistrerArrivee = async (
  id_employee: number,
  heureActuelle: string,
  statut: string
): Promise<Pointage> => {
  const response = await axios.post(`${API_URL}/arrivee`, {
    id_employee,
    heureActuelle,
    statut,
  });

  return response.data;
};


export const enregistrerDepart = async (id_pointage: number): Promise<Pointage> => {
  try {
    // IMPORTANT: On n'envoie PAS l'heure dans le body
    // Le backend génère l'heure automatiquement
    const res = await axios.put<{ message: string; pointage: Pointage }>(
      `${API_URL}/${id_pointage}/depart`
    );
    return res.data.pointage;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du départ :", error);
    throw error;
  }
};

export const getPointages = async (): Promise<Pointage[]> => {
  try {
    const res = await axios.get<Pointage[]>(API_URL);
    return res.data;
  } catch (error) {
    console.error("Erreur lors du chargement des pointages :", error);
    throw error;
  }
};