import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
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

      if (!res.user || !res.token) {
        toast.error("Données de connexion invalides !");
        return;
      }

      console.log("[LOGIN] User :", res.user);


      if (res.user.employee?.id_employee) {
        await enregistrerArrivee(res.user.employee.id_employee);
        console.log("✅ Arrivée enregistrée");
      } else {
        console.warn("⚠️ Aucun id_employee trouvé");
      }

      toast.success("Connexion réussie !");


      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      const role = (res.user.role || "employe").toLowerCase();
      localStorage.setItem("role", role);


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
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.message || "Erreur lors de la connexion"
        );
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Erreur inconnue");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeftIcon className="size-5" />
          retour
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Se connecter</h1>
          <p className="text-sm text-gray-500">
            Entrez votre email et votre mot de passe
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="exemple@gmail.com"
            />
          </div>

          <div>
            <Label>Mot de passe *</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Checkbox checked={isChecked} onChange={setIsChecked} />
            <span className="text-sm">Me souvenir</span>
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
