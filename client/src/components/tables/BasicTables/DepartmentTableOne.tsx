import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";


interface Order {
  id: number;
  department: string;
  sigle: string;
}

// Define the table data using the interface
const tableData: Order[] = [
  {
    id: 1,
    department: "Ressource Humaine",
    sigle: "RH",
  },
  {
    id: 2,
    department: "Adminitration et Finance",
    sigle: "AF",
  },
  {
    id: 3,
    department: "Communication",
    sigle: "COMM",
  },
  {
    id: 4,
    department: "Traduction",
    sigle: "TRAD",
  },
  {
    id: 5,
    department: "Marketing et Commerce",
    sigle: "MC",
  },
];

export default function BasicTableOne() {
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
                Departement
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Sigle
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.department}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.sigle}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
