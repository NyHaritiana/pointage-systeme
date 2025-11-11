import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { registerUser, User } from "../../api/authApi";
import axios from "axios";
import { toast } from "react-toastify";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    num_matricule: "",
    role: "employe",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.get<{ employeeId: number }>(
        `http://localhost:3000/api/employees/by-matricule/${formData.num_matricule}`
      );
      const id_employee = res.data.employeeId;

      if (!id_employee) {
        toast.error("Numéro matricule invalide.");
        return;
      }

      const newUser: User = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        id_employee,
      };

      await registerUser(newUser, formData.password);

      toast.success("Compte créé avec succès !");
      setFormData({ username: "", email: "", password: "", num_matricule: "",role: "employe" });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data?.message || "Erreur lors de l'inscription.");
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Erreur inconnue");
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          retour
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              S'inscrire
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entrez vos informations pour s'inscrire
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <Label>
                  Numéro matricule<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="num_matricule"
                  placeholder="Entrez votre numéro matricule"
                  value={formData.num_matricule}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>
                  Nom d'utilisateur<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="username"
                  placeholder="Entrez votre nom"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Entrez votre email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>
                  Mot de passe<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Entrez votre mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="role" className="text-gray-800 dark:text-gray-300">Etat civil :</label>
                <select name="role" value={formData.role} className="h-10 w-full border rounded px-3 dark:text-gray-200 dark:bg-black">
                  <option value="admin">Admin</option>
                  <option value="employe">Employe</option>
                  <option value="rh">RH</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                >
                  S'inscrire
                </button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              J'ai déjà un compte?{" "}
              <Link
                to="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
