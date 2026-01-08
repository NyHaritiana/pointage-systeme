import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { useEffect, useState } from "react";
import axios from "axios";

interface Absence {
  id_absence: string;
  id_employee: string;
  type_absence:
    | "Conge Paye"
    | "Arret Maladie"
    | "Permission"
    | "Conge de Maternite"
    | "Conge de Paternite"
    | "Assistance Maternelle"
    | "Conge Formation"
    | "Mission";
  date_debut: string;
  date_fin: string;
  motif: string;
  statut: "Approuve" | "En attente" | "Rejete";
}

export default function HistoriqueTableOne() {
  const [absences, setAbsences] = useState<Absence[]>([]);

  // Récupération de l'utilisateur connecté
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const idEmployee = user?.employee?.id_employee;

  useEffect(() => {
    if (!idEmployee) return;

    const fetchAbsences = async () => {
      try {
        const res = await axios.get(
          `https://pointage-systeme.onrender.com/api/absences/employee/${idEmployee}`
        );
        setAbsences(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des absences :", error);
      }
    };

    fetchAbsences();
  }, [idEmployee]);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("fr-FR");

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">Date début</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">Date fin</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">Statut</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">Type d'absence</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {absences.length === 0 ? (
              <TableRow>
                <td colSpan={4} className="px-4 py-5 text-center text-gray-500 dark:text-gray-400">
                  Aucun historique d'absence trouvé.
                </td>
              </TableRow>
            ) : (
              absences.map((absence) => (
                <TableRow key={absence.id_absence}>
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
