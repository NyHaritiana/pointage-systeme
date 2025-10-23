import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import HistoriqueTableOne from "../../components/tables/BasicTables/HistoriqueTableOne";

export default function HistoriqueTables() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="space-y-6">
        <ComponentCard title="Demande de congé et Historique des absences">
          <HistoriqueTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
