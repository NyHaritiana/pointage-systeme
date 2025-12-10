import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { FiCheck, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Absence, getAbsences, editAbsence } from "../../../api/absenceApi";

export default function DemandeTableOne() {
  const [absences, setAbsences] = useState<Absence[]>([]);

  useEffect(() => {
    const fetchAbsences = async () => {
      try {
        const data = await getAbsences();
        setAbsences(data);
      } catch (error) {
        console.error("Erreur lors du chargement des absences :", error);
      }
    };
    fetchAbsences();
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR");


  const handleStatusChange = async (absence: Absence, newStatus: Absence["statut"]) => {
    try {
      // Appel API pour mettre à jour le statut
      const updatedAbsence = await editAbsence(absence.id_absence, { statut: newStatus });
      
      // Mise à jour du state local en temps réel
      setAbsences((prev) =>
        prev.map((a) => (a.id_absence === absence.id_absence ? updatedAbsence : a))
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      alert("Impossible de mettre à jour le statut.");
    }
  };

const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;

// Calcul des éléments affichés
const lastIndex = currentPage * itemsPerPage;
const firstIndex = lastIndex - itemsPerPage;
const currentAbsences = absences.slice(firstIndex, lastIndex);

const totalPages = Math.ceil(absences.length / itemsPerPage);


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">ID</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">Employé</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">Date début</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">Date fin</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">Statut</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">Type d'absence</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {absences.length === 0 ? (
              <TableRow>
                <td colSpan={7} className="px-4 py-5 text-center text-gray-500 dark:text-gray-400">
                  Aucun historique d'absence trouvé.
                </td>
              </TableRow>
            ) : (
              currentAbsences.map((absence) => (
                <TableRow key={absence.id_absence}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{absence.id_absence}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{absence.id_employee}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{formatDate(absence.date_debut)}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{formatDate(absence.date_fin)}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        absence.statut === "Approuve"
                          ? "success"
                          : absence.statut === "En attente"
                          ? "warning"
                          : "error"
                      }
                    >
                      {absence.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{absence.type_absence}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {absence.statut === "En attente" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(absence, "Approuve")}
                          className="text-green-500 hover:text-green-700 transition"
                          title="Valider"
                        >
                          <FiCheck size={18} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(absence, "Rejete")}
                          className="text-red-500 hover:text-red-700 transition"
                          title="Refuser"
                        >
                          <FiX size={18} />
                        </button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {absences.length > 0 && (
          <div className="flex items-center justify-center gap-4 py-4 bg-white dark:bg-transparent">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Précédent
            </button>

            <span className="text-sm font-semibold">
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
