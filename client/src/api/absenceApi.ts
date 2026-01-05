import axios from "axios";

const API_URL = "http://localhost:3000/api/absences";

export interface Absence {
  
  id_absence: number;
  id_employee: number;
  date_debut: string;
  date_fin: string;
  type_absence: "Conge Paye" | "Arret Maladie" | "Permission" | "Conge de Maternite" | "Conge de Paternite" | "Assistance Maternelle" | "Conge Formation" | "Mission";
  motif: string;
  statut: "En attente" | "Approuve" | "Rejete";
  Employee?: {
    prenom: string;
    nom: string;
  };
}

export const getAbsences = async (): Promise<Absence[]> => {
  try {
    const res = await axios.get<Absence[]>(API_URL);
    return res.data;
  } catch (error) {
    console.error("Erreur lors du chargement des absences :", error);
    throw error;
  }
};

export const addAbsence = async (data: Omit<Absence, "id_absence">): Promise<Absence> => {
  try {
    const res = await axios.post<Absence>(API_URL, data);
    return res.data;
  } catch (error) {
    console.error("Erreur lors de l’ajout de l' Absence :", error);
    throw error;
  }
};

export const deleteAbsence = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l' Absence :", error);
    throw error;
  }
};

export const editAbsence = async (
  id: number,
  absenceData: Partial<Omit<Absence, "id_absence">>
): Promise<Absence> => {
  try {
    const res = await axios.put<Absence>(`${API_URL}/${id}`, absenceData);
    return res.data;
  } catch (error) {
    console.error("Erreur lors de la modification de l'absence :", error);
    throw error;
  }
};
