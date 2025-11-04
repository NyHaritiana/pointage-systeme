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
}

export default function BasicTableOne({ employees, departments }: BasicTableOneProps) {
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
