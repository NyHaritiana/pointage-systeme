import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";

export default function BasicTables() {
  const { isOpen, openModal, closeModal } = useModal();
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <PageMeta
        title="pointage-systeme | FMBM"
        description="liste des employés et l'ajout"
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4 mx-4">
          <h2 className="text-xl font-semibold dark:text-gray-200">Liste des employés</h2>
          <button
            onClick={openModal}
            className="bg-blue-500 text-white px-2 rounded"
          >
            Nouveau
          </button>
        </div>

        <BasicTableOne />
      </div>

      {/* --- Modal d'ajout d'employé à étapes --- */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] p-6 lg:p-10"
      >
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center">
            Ajouter un employé
          </h3>

          {/* Barre d’étapes */}
          <div className="flex justify-between mb-6">
            {["Infos", "Contrat", "Confirmation"].map((label, index) => (
              <div key={index} className="flex flex-col items-center w-1/3">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all ${
                    step === index + 1
                      ? "bg-blue-500 text-white border-blue-500"
                      : step > index + 1
                      ? "bg-green-500 text-white border-green-500"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`mt-2 text-xs ${
                    step === index + 1
                      ? "text-blue-600 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Contenu selon l'étape */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {step === 1 && (
              <>
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
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    placeholder="Entrer le nom"
                    className="h-10 w-full border rounded px-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="exemple@gmail.com"
                    className="h-10 w-full border rounded px-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  <input
                    type="number"
                    className="h-10 w-full border rounded px-3"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Département
                  </label>
                  <select className="h-10 w-full border rounded px-3">
                    <option value="">Administration et Finance - AF</option>
                    <option value="">Ressource Humaine - RH</option>
                    <option value="">Communication - COMM</option>
                    <option value="">Traduction - TRAD</option>
                    <option value="">Marketing et Commerce - MC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type de contrat
                  </label>
                  <select className="h-10 w-full border rounded px-3">
                    <option value="">CDI</option>
                    <option value="">CDD</option>
                  </select>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date de fin du contrat
                  </label>
                  <input
                    type="date"
                    className="h-10 w-full border rounded px-3"
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <div className="text-center">
                <h4 className="text-md font-semibold mb-2">
                  Confirmation finale
                </h4>
                <p className="text-gray-600">
                  Vérifiez bien les informations avant d’enregistrer.
                </p>
              </div>
            )}

            {/* Boutons de navigation */}
            <div className="flex justify-between mt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 border rounded text-gray-700"
                >
                  Précédent
                </button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={closeModal}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Enregistrer
                </button>
              )}
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

