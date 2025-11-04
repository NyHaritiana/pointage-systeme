import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import DepartmentTableOne from "../../components/tables/BasicTables/DepartmentTableOne";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import { getDepartments, addDepartment, Department } from "../../api/departmentApi";
import { toast } from "react-toastify";


export default function DepartmentTables() {
  const { isOpen, openModal, closeModal } = useModal();
const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({ nom: "", sigle: "" });

  // Charger les départements au montage
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  await addDepartment(formData);
  toast.success("Département ajouté avec succès");
  setFormData({ nom: "", sigle: "" });
  closeModal();
  fetchDepartments();
};
  return (
    <>
      <PageMeta title="pointage-systeme | FMBM" description="Liste des départements" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4 mx-4">
          <h2 className="text-xl font-semibold dark:text-gray-200">Liste des départements</h2>
          <button onClick={openModal} className="bg-blue-500 text-white px-2 rounded">
            Nouveau
          </button>
        </div>

        {/* Table d'affichage */}
        <DepartmentTableOne departments={departments} />
      </div>

      {/* Modal d'ajout */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] p-6 lg:p-10">
        <div>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-300">
            Ajouter un nouveau département
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nom
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Entrer le nom du département"
                className="h-10 w-full border rounded px-3 dark:text-gray-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sigle
              </label>
              <input
                type="text"
                name="sigle"
                value={formData.sigle}
                onChange={handleChange}
                placeholder="Entrer le sigle"
                className="h-10 w-full border rounded px-3 dark:text-gray-200"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border rounded text-gray-700 dark:text-gray-300"
              >
                Annuler
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
