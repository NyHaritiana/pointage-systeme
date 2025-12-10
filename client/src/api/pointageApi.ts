// pointageApi.ts
import axios from "axios";

const API_URL = "http://localhost:3000/api/pointages";


export interface Pointage {
  id_pointage: number;
  id_employee: number;
  date_pointage: string;
  heure_arrivee: string;
  heure_depart: string;
  statut: "Présent" | "Absent" | "Retard" | "Permission";
}

export const enregistrerArrivee = async (id_employee: number) => {
  return axios.post(`${API_URL}/arrivee`, {
    id_employee,
  });
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