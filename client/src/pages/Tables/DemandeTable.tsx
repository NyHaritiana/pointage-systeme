import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import DemandeTableOne from "../../components/tables/BasicTables/DemandeTableOne";

export default function DemandeTable() {
  return (
    <>
      <PageMeta
        title="systeme-pointage | FMBM"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="space-y-6">
        <ComponentCard title="Demande de congé">
          <DemandeTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
