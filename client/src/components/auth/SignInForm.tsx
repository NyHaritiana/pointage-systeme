import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

import { loginUser } from "../../api/authApi";
import { enregistrerArrivee } from "../../api/pointageApi";
export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }

    setLoading(true);

    try {
      const res = await loginUser(formData.email, formData.password);

      console.log("Utilisateur connecté :", res.user);
      console.log("Rôle détecté :", res.user?.role);

      if (!res.user || !res.token) {
        toast.error("Données de connexion invalides !");
        return;
      }

      console.log("[LOGIN] User trouvé :", {
        id_user: res.user.id_user,
        id_employee: res.user.employee?.id_employee,
        role: res.user.role,
      });

      if (res.user.employee?.id_employee) {
        await enregistrerArrivee(
          res.user.employee.id_employee,
          new Date().toISOString(),
          "Présent"
        );

        console.log("Pointage enregistré !");
      } else {
        console.warn("Aucun employee.id_employee reçu !");
      }

      toast.success("Connexion réussie !");

      // Sauvegardes
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      const role = (res.user.role || "employe").toLowerCase();
      localStorage.setItem("role", role);

      // Redirection selon le rôle
      switch (role) {
        case "admin":
        case "rh":
          navigate("/tableau");
          break;
        case "employe":
          navigate("/calendar");
          break;
        default:
          navigate("/signin");
          break;
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data?.message || "Erreur lors de la connexion.");
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Erreur inconnue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
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
              Se connecter
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entrez votre email et votre mot de passe pour vous connecter
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemple@gmail.com"
                />
              </div>

              <div>
                <Label>
                  Mot de passe <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Entrez votre mot de passe"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Me souvenir
                  </span>
                </div>
                <Link
                  to="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <div>
                <Button className="w-full" size="sm" disabled={loading}>
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
