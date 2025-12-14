import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { FiCheck, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Absence, getAbsences, editAbsence } from "../../../api/absenceApi";
import { Employee, getEmployees } from "../../../api/employeeApi"; // Import des employés

export default function DemandeTableOne() {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee] = useState<string>("all");
  const [searchName, setSearchName] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => { 
      try {
        // Charger les absences
        const absenceData = await getAbsences();
        setAbsences(absenceData);
        
        // Charger les employés pour le filtre
        const employeeData = await getEmployees();
        setEmployees(employeeData);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR");

  const handleStatusChange = async (absence: Absence, newStatus: Absence["statut"]) => {
    try {
      const updatedAbsence = await editAbsence(absence.id_absence, { statut: newStatus });
      
      setAbsences((prev) =>
        prev.map((a) => (a.id_absence === absence.id_absence ? updatedAbsence : a))
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      alert("Impossible de mettre à jour le statut.");
    }
  };

  // Fonction pour obtenir le nom complet de l'employé
  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(emp => emp.id_employee === employeeId);
    return employee ? `${employee.prenom} ${employee.nom}` : "Employé inconnu";
  };

  // Filtrage des absences
  const filteredAbsences = absences.filter((absence) => {
    // Filtre par employé
    const matchEmployee = selectedEmployee === "all" 
      ? true 
      : absence.id_employee === Number(selectedEmployee);
    
    // Filtre par nom/prénom (si absence.Employee existe)
    let matchName = true;
    if (searchName.trim() !== "") {
      const searchLower = searchName.toLowerCase().trim();
      
      if (absence.Employee) {
        // Si les données de l'employé sont incluses dans l'absence
        matchName = 
          (absence.Employee.nom?.toLowerCase().includes(searchLower) || false) ||
          (absence.Employee.prenom?.toLowerCase().includes(searchLower) || false);
      } else {
        // Sinon, utiliser les employés chargés séparément
        const employee = employees.find(emp => emp.id_employee === absence.id_employee);
        matchName = employee
          ? (employee.nom?.toLowerCase().includes(searchLower) || false) ||
            (employee.prenom?.toLowerCase().includes(searchLower) || false)
          : false;
      }
    }
    
    return matchEmployee && matchName;
  });

  // Pagination sur les absences filtrées
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentAbsences = filteredAbsences.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredAbsences.length / itemsPerPage);

  // Reset page si filtre change

  const handleSearchChange = (value: string) => {
    setSearchName(value);
    setCurrentPage(1);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Section filtres */}
      <div className="flex flex-wrap gap-4 p-4">
        {/* Filtre par employé */}
        

        {/* Filtre par nom/prénom */}
        <input
          type="text"
          placeholder="Rechercher par nom ou prénom"
          value={searchName}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm flex-grow md:flex-grow-0"
        />

        {/* Compteur de résultats */}
        <div className="text-sm text-gray-600 self-center">
          {filteredAbsences.length} absence(s) sur {employees.length}
          {selectedEmployee !== "all" && 
            ` • Employé: ${employees.find(e => e.id_employee === Number(selectedEmployee))?.prenom || ""}`}
        </div>
      </div>

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
            {filteredAbsences.length === 0 ? (
              <TableRow>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {absences.length === 0 
                    ? "Aucun historique d'absence trouvé." 
                    : "Aucune absence ne correspond aux critères de recherche."}
                </td>
              </TableRow>
            ) : (
              currentAbsences.map((absence) => {
                const employeeName = absence.Employee
                  ? `${absence.Employee.prenom} ${absence.Employee.nom}`
                  : getEmployeeName(absence.id_employee);
                
                return (
                  <TableRow key={absence.id_absence}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {absence.id_absence}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {employeeName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {formatDate(absence.date_debut)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {formatDate(absence.date_fin)}
                    </TableCell>
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
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {absence.type_absence}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {absence.statut === "En attente" && (
                        <div className="flex gap-3">
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
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        
        {filteredAbsences.length > 0 && (
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