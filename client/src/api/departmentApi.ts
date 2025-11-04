import axios from "axios";

const API_URL = "http://localhost:3000/api/departments";

export interface Department {
  id_departement: number;
  nom: string;
  sigle: string;
}

export const getDepartments = async (): Promise<Department[]> => {
  try {
    const res = await axios.get<Department[]>(API_URL);
    return res.data;
  } catch (error) {
    console.error("Erreur lors du chargement des départements :", error);
    throw error;
  }
};

export const addDepartment = async (data: Omit<Department, "id_departement">): Promise<Department> => {
  try {
    const res = await axios.post<Department>(API_URL, data);
    return res.data;
  } catch (error) {
    console.error("Erreur lors de l’ajout du département :", error);
    throw error;
  }
};

export const deleteDepartment = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Erreur lors de la suppression du département :", error);
    throw error;
  }
};
