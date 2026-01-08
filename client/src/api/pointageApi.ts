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

export const enregistrerArrivee = async (
  id_employee: number
): Promise<Pointage> => {
  const response = await axios.post<{ message: string; pointage: Pointage }>(
    `${API_URL}/arrivee`,
    { id_employee }
  );

  return response.data.pointage;
};

export const enregistrerDepart = async (
  id_pointage: number
): Promise<Pointage> => {
  const response = await axios.put<{ message: string; pointage: Pointage }>(
    `${API_URL}/depart/${id_pointage}`
  );

  return response.data.pointage;
};


export const getPointages = async (): Promise<Pointage[]> => {
  const res = await axios.get<Pointage[]>(API_URL);
  return res.data;
};
