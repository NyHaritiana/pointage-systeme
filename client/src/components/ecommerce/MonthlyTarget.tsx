import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { Pointage, getPointages } from "../../api/pointageApi";
import { Horaire, getHoraires } from "../../api/horaireApi";
import { Employee, getEmployees } from "../../api/employeeApi";

export default function MonthlyTarget() {
  const [isOpen, setIsOpen] = useState(false);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [retardCount, setRetardCount] = useState(0);

  const [pointages, setPointages] = useState<Pointage[]>([]);
  const [horaires, setHoraires] = useState<Horaire[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Récupérer les données au chargement
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pointagesData, horairesData, employeesData] = await Promise.all([
          getPointages(),
          getHoraires(),
          getEmployees(),
        ]);

        setPointages(pointagesData);
        setHoraires(horairesData);
        setEmployees(employeesData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Calculer les statistiques
  useEffect(() => {
    if (pointages.length === 0 || horaires.length === 0 || employees.length === 0) return;

    // 🔥 Définition de getStatut à l'intérieur du useEffect pour éviter le warning ESLint
    const getStatut = (p: Pointage) => {
      if (!p.heure_arrivee) return "Absent";

      const datePointage = new Date(p.date_pointage);
      const horairesEligibles = horaires.filter((h) => new Date(h.semaine) <= datePointage);

      if (horairesEligibles.length === 0) return "Absent";

      const horaire = horairesEligibles.sort(
        (a, b) => new Date(b.semaine).getTime() - new Date(a.semaine).getTime()
      )[0];

      const [hArr, mArr] = p.heure_arrivee.split(":").map(Number);
      const [hDeb, mDeb] = horaire.heure_entree.split(":").map(Number);

      const arrivee = hArr * 60 + mArr;
      const debut = hDeb * 60 + mDeb;

      return arrivee <= debut ? "Présent" : "Retard";
    };

    let present = 0;
    let retard = 0;

    pointages.forEach((p) => {
      const statut = getStatut(p);
      if (statut === "Présent") present++;
      else if (statut === "Retard") retard++;
    });

    const absent = employees.length - present - retard;

    setPresentCount(present);
    setRetardCount(retard);
    setAbsentCount(absent >= 0 ? absent : 0);
  }, [pointages, horaires, employees]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Aujourd'hui</h3>
        <div className="relative inline-block">
          <button onClick={() => setIsOpen(!isOpen)}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-40 p-2">
            <DropdownItem>Voir plus</DropdownItem>
            <DropdownItem>Supprimer</DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Présents</p>
          <p className="text-2xl font-bold text-green-600">{presentCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Absents</p>
          <p className="text-2xl font-bold text-red-600">{absentCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">En retard</p>
          <p className="text-2xl font-bold text-yellow-500">{retardCount}</p>
        </div>
      </div>
    </div>
  );
}
