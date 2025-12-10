import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa";
import { useState } from "react";
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

  const departmentMap = new Map(
    departments.map((dep) => [dep.id_departement, dep.sigle])
  );

const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;

const lastIndex = currentPage * itemsPerPage;
const firstIndex = lastIndex - itemsPerPage;
const currentEmployees = employees.slice(firstIndex, lastIndex);

const totalPages = Math.ceil(employees.length / itemsPerPage);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table> 
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Nom
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Département
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-semibold text-gray-500 text-center text-theme-sm dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentEmployees.map((emp) => (
              <TableRow key={emp.id_employee}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{emp.nom} {emp.prenom}</TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{emp.email}</TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{departmentMap.get(emp.id_departement) || "-"}</TableCell>

                <TableCell className="flex justify-center gap-4 py-2">
                  {/* Modifier */}
                  <button
                    onClick={() => onEdit(emp)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FiEdit size={18} />
                  </button>

                  {/* Supprimer */}
                  <button
                    onClick={() => {
                      if (window.confirm("Voulez-vous vraiment supprimer cet employé ?")) {
                        onDelete(emp.id_employee);
                      }
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={18} />
                  </button>

                  {/* Export PDF */}
                  <button
                    onClick={() => onPdf(emp)}
                    className="text-red-600 hover:text-red-800"
                    title="Exporter PDF"
                  >
                    <FaFilePdf size={18} />
                  </button>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {employees.length > 0 && (
          <div className="flex items-center justify-center gap-4 py-4 bg-white dark:bg-transparent">
            
            {/* Bouton Précédent */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Précédent
            </button>

            {/* Numéro de page */}
            <span className="text-sm font-semibold">
              Page {currentPage} / {totalPages}
            </span>

            {/* Bouton Suivant */}
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
