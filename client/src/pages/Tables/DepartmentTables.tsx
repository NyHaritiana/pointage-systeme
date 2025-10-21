import PageMeta from "../../components/common/PageMeta";
import DepartmentTableOne from "../../components/tables/BasicTables/DepartmentTableOne";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="pointage-systeme | FMBM"
        description="liste des employés et l'ajout"
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4 mx-4">
          <h2 className="text-xl font-semibold">Liste des départements</h2>
          <button className="bg-blue-500 text-white px-2 rounded">nouveau</button>
        </div>
          <DepartmentTableOne />
      </div>
    </>
  );
}
