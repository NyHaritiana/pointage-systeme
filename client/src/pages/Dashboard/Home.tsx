import { useEffect, useState } from "react";
import { Employee, getEmployees } from "../../api/employeeApi";
import { Department, getDepartments } from "../../api/departmentApi";

import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
const [employees, setEmployees] = useState<Employee[]>([]);
const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const emp = await getEmployees();
        const dep = await getDepartments();

        setEmployees(emp);
        setDepartments(dep);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <PageMeta
        title="pointage-systeme | FMBM"
        description="This pointage systeme manage a personal presence"
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">

          <EcommerceMetrics
            totalEmployees={employees.length}
            totalDepartments={departments.length}
          />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>
      </div>
    </>
  );
}
