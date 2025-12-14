import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa";
import { useState, useEffect } from "react"; // Ajout de useEffect pour debug
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Employee } from "../../../api/employeeApi";
import { Department } from "../../../api/departmentApi";

interface BasicTableOneProps {
  employees: Employee[];
  departments: Department[];
  onDelete: (id: number) => void;
  onEdit: (emp: Employee) => void;
  onPdf: (emp: Employee) => void;
}

export default function BasicTableOne({
  employees,
  departments,
  onDelete,
  onEdit,
  onPdf,
}: BasicTableOneProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const departmentMap = new Map(
    departments.map((dep) => [dep.id_departement, dep.sigle])
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // États pour filtres
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchName, setSearchName] = useState<string>("");

  // DEBUG: Afficher les données pour comprendre le problème
  useEffect(() => {
    console.log("=== DEBUG FILTRE DÉPARTEMENT ===");
    console.log("Valeur sélectionnée dans le select:", selectedDepartment);
    console.log("Type de selectedDepartment:", typeof selectedDepartment);
    
    // Afficher les départements disponibles
    console.log("Départements disponibles:", departments.map(d => ({
      id: d.id_departement,
      sigle: d.sigle,
      type_id: typeof d.id_departement
    })));
    
    // Afficher quelques employés avec leurs départements
    if (employees.length > 0) {
      console.log("Exemples d'employés:", employees.slice(0, 3).map(emp => ({
        id: emp.id_employee,
        nom: emp.nom,
        id_departement: emp.id_departement,
        type_departement: typeof emp.id_departement,
        sigle: departmentMap.get(emp.id_departement)
      })));
    }
    
    // Vérifier si "RH" existe dans les départements
    const rhDept = departments.find(d => d.sigle === "RH");
    if (rhDept) {
      console.log("Département RH trouvé:", rhDept);
      console.log("ID du département RH:", rhDept.id_departement);
      console.log("Type de l'ID:", typeof rhDept.id_departement);
      
      // Vérifier si des employés ont ce département
      const employeesRH = employees.filter(emp => emp.id_departement === rhDept.id_departement);
      console.log(`Employés avec département RH (${rhDept.id_departement}):`, employeesRH.length);
    }
  }, [selectedDepartment, departments, employees, departmentMap]);

  // Filtrage corrigé avec comparaison lâche
  const filteredEmployees = employees.filter((emp) => {
    // Filtre par département
    let matchDept = true;
    if (selectedDepartment !== "all") {
      // Utiliser == au lieu de === pour comparer nombre/string
      matchDept = emp.id_departement == Number(selectedDepartment);
      
      // Alternative: convertir les deux en string pour comparaison
      // matchDept = String(emp.id_departement) === selectedDepartment;
      
      // Alternative: convertir les deux en nombre
      // matchDept = Number(emp.id_departement) === Number(selectedDepartment);
    }

    // Filtre par nom/prénom
    let matchName = true;
    if (searchName.trim() !== "") {
      const searchLower = searchName.toLowerCase().trim();
      matchName = 
        (emp.nom?.toLowerCase().includes(searchLower) || false) ||
        (emp.prenom?.toLowerCase().includes(searchLower) || false);
    }

    return matchDept && matchName;
  });

  // Pagination
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;

  // Reset page si filtre change
  const handleDepartmentChange = (value: string) => {
    console.log("Changement de département:", value);
    setSelectedDepartment(value);
    setCurrentPage(1);
  };

  const handleSearchNameChange = (value: string) => {
    setSearchName(value);
    setCurrentPage(1);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Section filtres */}
      <div className="flex flex-wrap gap-4 p-4">
        {/* Filtre département */}
        <select
          value={selectedDepartment}
          onChange={(e) => handleDepartmentChange(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="all">Tous les départements</option>
          {departments.map((dep) => (
            <option key={dep.id_departement} value={dep.id_departement}>
              {dep.sigle} (ID: {dep.id_departement})
            </option>
          ))}
        </select>

        {/* Filtre nom/prénom */}
        <input
          type="text"
          placeholder="Filtrer par nom ou prénom"
          value={searchName}
          onChange={(e) => handleSearchNameChange(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        
        {/* Indicateur de filtrage */}
        <div className="text-sm text-gray-600 ml-auto self-center">
          {filteredEmployees.length} employé(s) sur {employees.length}
          {selectedDepartment !== "all" && ` • Filtre: ${departments.find(d => String(d.id_departement) === selectedDepartment)?.sigle || selectedDepartment}`}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">
                Nom
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">
                Email
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">
                Département (ID)
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-center text-theme-sm dark:text-gray-400">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentEmployees.length > 0 ? (
              currentEmployees.map((emp) => (
                <TableRow key={emp.id_employee}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {emp.nom} {emp.prenom ?? ""}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {emp.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {emp.id_departement ? `${departmentMap.get(emp.id_departement)} (${emp.id_departement})` : "-"}
                  </TableCell>

                  <TableCell className="flex justify-center gap-4 py-2">
                    <button
                      onClick={() => onEdit(emp)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FiEdit size={18} />
                    </button>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Voulez-vous vraiment supprimer cet employé ?"
                          )
                        ) {
                          onDelete(emp.id_employee);
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>

                    <button
                      onClick={() => onPdf(emp)}
                      className="text-red-600 hover:text-red-800"
                      title="Exporter PDF"
                    >
                      <FaFilePdf size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="px-4 py-8 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                  {employees.length === 0 
                    ? "Aucun employé disponible" 
                    : `Aucun employé ne correspond aux critères. 
                       ${selectedDepartment !== "all" ? `Département sélectionné: ${selectedDepartment}` : ""}`}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {filteredEmployees.length > 0 && (
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