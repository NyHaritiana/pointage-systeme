import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Department } from "../../../api/departmentApi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useState, useEffect } from "react";

interface DepartmentTableOneProps {
  departments: Department[];
  onDelete: (id: number) => void;
  onEdit: (department: Department) => void;
}

export default function DepartmentTableOne({
  departments,
  onDelete,
  onEdit,
}: DepartmentTableOneProps) {

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [departments]);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentDepartments = departments.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(departments.length / itemsPerPage);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">

        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                ID
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Département
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Sigle
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 font-semibold text-gray-500 text-center text-theme-sm dark:text-gray-400"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentDepartments.map((dep) => (
              <TableRow key={dep.id_departement}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {dep.id_departement}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {dep.nom}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {dep.sigle}
                </TableCell>

                <TableCell className="px-4 py-3 flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(dep)}
                    className="text-blue-500 hover:text-blue-700 transition"
                    title="Modifier"
                  >
                    <FiEdit size={18} />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm("Voulez-vous vraiment supprimer cet département ?")) {
                        onDelete(dep.id_departement);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Supprimer"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {departments.length > itemsPerPage && (
          <div className="flex items-center justify-center gap-4 py-4 bg-white dark:bg-transparent">
            
            {/* Précédent */}
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

            {/* Suivant */}
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
