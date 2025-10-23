import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";

interface Order {
  id: number;
  user: string;
  Department: string;
  status: string;
  budget: string;
}

// Define the table data using the interface
const tableData: Order[] = [
  {
    id: 1,
    user: "Rakotobe Lita",
    Department: "RH",
    budget: "2j",
    status: "Actif",
  },
  {
    id: 2,
    user: "Rabe Doda",
    Department: "AF",
    budget: "2.5j",
    status: "En attente",
  },
  {
    id: 3,
    user: "Rasoa Voahangy",
    Department: "COMM",
    budget: "1j",
    status: "Actif",
  },
  {
    id: 4,
    user: "Ranginta Soa",
    Department: "TRAD",
    budget: "1.5j",
    status: "Passé",
  },
  {
    id: 5,
    user: "Ravao Bema",
    Department: "MC",
    budget: "1j",
    status: "Actif",
  },
];

export default function HistoriqueTableOne() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Nom et prénom
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Département
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Types
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Durée
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.user}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.Department}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      order.status === "Actif"
                        ? "success"
                        : order.status === "En attente"
                        ? "warning"
                        : "error"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {order.budget}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
