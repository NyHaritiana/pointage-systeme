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
    timeStr ? timeStr.slice(0, 5) : "-";

  /**
   * 🔥 Fonction statut CORRIGÉE (vraie logique)
   * - Trouve l'horaire dont la "semaine" (date) est la plus proche
   *   mais inférieure ou égale à la date du pointage.
   */
  const getStatut = (p: Pointage) => {
    if (!p.heure_arrivee) return "Absent";

    const datePointage = new Date(p.date_pointage);

    // 1️⃣ Filtrer les horaires dont la semaine <= date du pointage
    const horairesEligibles = horaires.filter((h) => {
      const dateSemaine = new Date(h.semaine);
      return dateSemaine <= datePointage;
    });

    if (horairesEligibles.length === 0) {
      return "Absent";
    }

    // 2️⃣ Prendre l'horaire le plus récent
    const horaire = horairesEligibles.sort(
      (a, b) => new Date(b.semaine).getTime() - new Date(a.semaine).getTime()
    )[0];

    // 3️⃣ Comparer l'heure d'arrivée
    const [hArr, mArr] = p.heure_arrivee.split(":").map(Number);
    const [hDeb, mDeb] = horaire.heure_entree.split(":").map(Number);

    const arrivee = hArr * 60 + mArr;
    const debut = hDeb * 60 + mDeb;

    if (arrivee <= debut) return "Présent";
    return "Retard";
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = pointages.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(pointages.length / itemsPerPage);

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
              currentItems.map((p) => (
                <TableRow key={p.id_pointage}>
                  <TableCell className="px-4 py-3 text-gray-600">{p.id_pointage}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-600">
                    {p.Employee
                      ? `${p.Employee.prenom}`
                      : "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600">{formatDate(p.date_pointage)}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-600">{formatTime(p.heure_arrivee)}</TableCell>
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

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 py-4">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            Précédent
          </button>

          <span className="text-gray-700">
            Page {currentPage} / {totalPages}
          </span>

          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
