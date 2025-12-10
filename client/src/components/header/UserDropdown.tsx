import { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link, useNavigate } from "react-router";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  // Pas de any → Record<string, unknown>
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const navigate = useNavigate();

  // Charger user depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    try {
      setUser(JSON.parse(stored) as Record<string, unknown>);
    } catch (e) {
      console.error("Erreur parsing user", e);
      setUser(null);
    }
  }, []);

  // Sécuriser l’accès aux propriétés
  const nom = typeof user?.username === "string" ? user.username : undefined;
  const email = typeof user?.email === "string" ? user.email : undefined;
  const avatar = typeof user?.avatar === "string" ? user.avatar : "/images/user/owner.png";

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/signin");
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-300"
      >
        <span className="mr-3 rounded-full overflow-hidden h-11 w-11 bg-gray-200">
          <img
            src={avatar}
            alt="User avatar"
            className="p-2"
          />
        </span>

        <span className="font-medium">
          {nom ?? "Utilisateur"}
        </span>
      </button>

      {isOpen && (
        <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-56">
          {/* User infos */}
          <DropdownItem>
            <div className="px-2 py-2 text-sm">
              <p className="font-semibold">{nom ?? "Utilisateur"}</p>
              <p className="text-gray-500 text-xs">{email ?? ""}</p>
            </div>
          </DropdownItem>

          {/* Profil */}
          <DropdownItem>
            <Link to="/profile" className="block px-2 py-2">
              Profil
            </Link>
          </DropdownItem>

          {/* Logout */}
          <DropdownItem>
            <button
              onClick={logout}
              className="w-full text-left px-2 py-2 text-red-500"
            >
              Déconnexion
            </button>
          </DropdownItem>
        </Dropdown>
      )}
    </div>
  );
}
