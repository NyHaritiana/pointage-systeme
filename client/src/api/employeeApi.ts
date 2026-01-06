import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/employees`;

export interface Employee {
  id_employee: number;
  num_matricule: number;
  num_cnaps: number;
  CIN: string;
  nom: string;
  prenom?: string;
  telephone: string;
  sexe: "Male" | "Femelle";
  etat_civil: "Celibataire" | "Marie";
  date_naissance: string;
  date_embauche: string;
  contrat: "CDI" | "CDD" | "Stage";
  statut: "Employee" | "Cadre" | "Cadre supérieur";
  categorie:
    | "1A"
    | "2A"
    | "3A"
    | "4A"
    | "5A"
    | "1B"
    | "2B"
    | "3B"
    | "4B"
    | "5B"
    | "HC";
  groupe: "I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | "VIII";
  localite: string;
  adresse: string;
  fonction: string;
  projet?: string;
  nb_enfant?: number;
  email?: string;
  salaire: number;
  id_departement: number;
}

export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const res = await axios.get<Employee[]>(API_URL);
    return res.data;
  } catch (error) {
    console.error("Erreur lors du chargement des employés :", error);
    throw error;
  }
};

export const addEmployee = async (
  data: Omit<Employee, "id_employee">
): Promise<Employee> => {
  try {
    const res = await axios.post<Employee>(API_URL, data);
    return res.data;
  } catch (error) {
    console.error("Erreur lors de l’ajout de l’employé :", error);
    throw error;
  }
};

export const deleteEmployee = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l’employé :", error);
    throw error;
  }
};

export const editEmployee = async (
  id: number,
  employeeData: Partial<Omit<Employee, "id_employee">>
): Promise<Employee> => {
  try {
    const res = await axios.put<Employee>(`${API_URL}/${id}`, employeeData);
    return res.data;
  } catch (error) {
    console.error("Erreur lors de la modification de l'employé :", error);
    throw error;
  }
};

