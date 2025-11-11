import axios from "axios";

const API_URL = "http://localhost:3000/api/users";

export interface User {
  id_user?: number;
  username: string;
  email: string;
  role?: "admin" | "employe" | "rh";
  id_employee: number;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const registerUser = async (
  user: User,
  password: string
): Promise<User> => {
  try {
    const res = await axios.post<{ user: User }>(`${API_URL}/register`, {
      ...user,
      password,
    });
    return res.data.user;
  } catch (error: unknown) {
    console.error("Erreur lors du chargement de l'inscription :", error);
    throw error;
  }
};


export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const res = await axios.post<LoginResponse>(`${API_URL}/login`, {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);

    if (res.data.user.role) {
      localStorage.setItem("role", res.data.user.role);
    }

    return res.data;
  } catch (error: unknown) {
    console.error("Erreur lors du chargement de la connexion :", error);
    throw error;
  }
};



export const logoutUser = () => {
  localStorage.removeItem("token");
};
