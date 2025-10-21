import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";


export default function BasicTables() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <PageMeta
        title="pointage-systeme | FMBM"
        description="liste des employés et l'ajout"
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4 mx-4">
          <h2 className="text-xl font-semibold">Liste des employés</h2>
          <button
            onClick={openModal}
            className="bg-blue-500 text-white px-2 rounded"
          >
            Nouveau
          </button>
        </div>

        <BasicTableOne />
      </div>

      {/* --- Modal d'ajout d'employé --- */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] p-6 lg:p-10"
      >
        <div>
          <h3 className="text-lg font-semibold mb-4">Ajouter un employé</h3>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <input
                type="text"
                placeholder="Entrer le nom"
                className="h-10 w-full border rounded px-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Poste
              </label>
              <input
                type="text"
                placeholder="Entrer le poste"
                className="h-10 w-full border rounded px-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date d’embauche
              </label>
              <input
                type="date"
                className="h-10 w-full border rounded px-3"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border rounded text-gray-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
