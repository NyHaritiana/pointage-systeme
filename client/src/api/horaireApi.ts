import axios from "axios";

const API_URL = "http://localhost:3000/api/horaires";

export interface Horaire {
  id_horaire: number;
  semaine: string;
  heure_entree: string;
  heure_sortie: string;
}

export const getHoraires = async (): Promise<Horaire[]> => {
  try {
    const res = await axios.get<Horaire[]>(API_URL);
    return res.data;
  } catch (error) {
    console.error("Erreur lors du chargement des Horaires :", error);
    throw error;
  }
};

export const addHoraire = async (data: Omit<Horaire, "id_horaire">): Promise<Horaire> => {
  try {
    const res = await axios.post<Horaire>(API_URL, data);
    return res.data;
  } catch (error) {
    console.error("Erreur lors de l’ajout du Horaires :", error);
    throw error;
  }
};

export const deleteHoraire = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l' Horaire :", error);
    throw error;
  }
};

export const editHoraire = async (
  id: number,
  horaireData: Partial<Omit<Horaire, "id_horaire">>
): Promise<Horaire> => {
  try {
    const res = await axios.put<Horaire>(`${API_URL}/${id}`, horaireData);
    return res.data;
  } catch (error) {
    console.error("Erreur lors de la modification de l' Horaire :", error);
    throw error;
  }
};
