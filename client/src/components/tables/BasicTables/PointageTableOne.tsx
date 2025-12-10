import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { Pointage, getPointages } from "../../../api/pointageApi";
import { Horaire, getHoraires } from "../../../api/horaireApi";

export default function PointageTableOne() {
  const [pointages, setPointages] = useState<Pointage[]>([]);
  const [horaires, setHoraires] = useState<Horaire[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pointagesData = await getPointages();
        const horairesData = await getHoraires();
        setPointages(pointagesData);
        setHoraires(horairesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR");

  const formatTime = (timeStr: string) =>
    timeStr ? timeStr.slice(0, 5) : "-"; // Exemple : "08:30:00" → "08:30"

  // Calcul de la semaine actuelle
  const currentWeek = (() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = ((now.getTime() - start.getTime()) / 86400000) + start.getDay();
    return Math.ceil(diff / 7);
  })();

  // Récupère l'horaire correspondant à la semaine actuelle
  const horaireSemaine = horaires.find(
    (h) => Number(h.semaine) === currentWeek
  );

  // Déterminer le statut du pointage en fonction de l'horaire
  const getStatut = (p: Pointage) => {
    if (!horaireSemaine) return "Absent";
    if (!p.heure_arrivee) return "Absent";

    const [hArrivee, mArrivee] = p.heure_arrivee.split(":").map(Number);
    const [hDebut, mDebut] = horaireSemaine.heure_entree.split(":").map(Number);

    if (hArrivee < hDebut || (hArrivee === hDebut && mArrivee <= mDebut)) {
      return "Présent";
    } else {
      return "Retard";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start">ID</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start">Employé</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start">Date</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start">Heure d'arrivée</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start">Heure de départ</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start">Statut</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {pointages.length === 0 ? (
              <TableRow>
                <td colSpan={6} className="px-4 py-5 text-center text-gray-500 dark:text-gray-400">
                  Aucun pointage trouvé.
                </td>
              </TableRow>
            ) : (
              pointages.map((p) => (
                <TableRow key={p.id_pointage}>
                  <TableCell className="px-4 py-3 text-gray-600">{p.id_pointage}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-600">{p.id_employee}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-600">{formatDate(p.date_pointage)}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-600">{formatTime(p.heure_arrivee)}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-600">{formatTime(p.heure_depart)}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      size="sm"
                      color={
                        getStatut(p) === "Présent"
                          ? "success"
                          : getStatut(p) === "Retard"
                          ? "warning"
                          : "error"
                      }
                    >
                      {getStatut(p)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
  