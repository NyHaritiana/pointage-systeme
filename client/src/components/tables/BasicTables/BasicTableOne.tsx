import { FiEdit, FiTrash2 } from "react-icons/fi";

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
  onEdit: (employee: Employee) => void;
}

export default function BasicTableOne({ employees, departments, onDelete, onEdit }: BasicTableOneProps) {
  const deptList = departments || [];

  const deptMap = new Map<number, string>();
  deptList.forEach(d => deptMap.set(d.id_departement, d.sigle));

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">
                Nom et prénom
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">
                Département
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">
                Email
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400">
                Téléphone
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-center text-theme-sm dark:text-gray-400">
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {employees.map((emp) => (
              <TableRow key={emp.id_employee}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {emp.nom} {emp.prenom || ""}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {deptMap.get(emp.id_departement) ?? "-"}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {emp.email || "-"}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {emp.telephone}
                </TableCell>
                <TableCell className="px-4 py-3 flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(emp)}
                    className="text-blue-500 hover:text-blue-700 transition"
                    title="Modifier"
                  >
                    <FiEdit size={18} />
                  </button>

                  <button
                      onClick={() => {
                        if (window.confirm("Voulez-vous vraiment supprimer cet employé ?")) {
                          onDelete(emp.id_employee);
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
      </div>
    </div>
  );
}
