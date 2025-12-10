import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import PointageTableOne from "../../components/tables/BasicTables/PointageTableOne";

export default function DemandeTable() {
  return (
    <>
      <PageMeta
        title="systeme-pointage | FMBM"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="space-y-6">
        <ComponentCard title="Pointage">
          <PointageTableOne />
        </ComponentCard>
      </div>
    </>
  );
} 