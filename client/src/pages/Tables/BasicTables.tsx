import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import { toast } from "react-toastify";
import { getEmployees, addEmployee, Employee } from "../../api/employeeApi";

export default function BasicTables() {
  const { isOpen, openModal, closeModal } = useModal();
  const [step, setStep] = useState(1);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [formData, setFormData] = useState<Omit<Employee, "id_employee">>({
    num_matricule: 0,
    num_cnaps: 0,
    CIN: "",
    nom: "",
    prenom: "",
    telephone: "",
    sexe: "Male",
    etat_civil: "Celibataire",
    date_naissance: "",
    date_embauche: "",
    contrat: "CDI",
    statut: "Employee",
    categorie: "1A",
    groupe: "I",
    localite: "",
    adresse: "",
    fonction: "",
    projet: "",
    nb_enfant: 0,
    email: "",
    salaire: 0,
    id_departement: 0,
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Charger les employés
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Erreur lors du chargement des employés");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addEmployee(formData);
      toast.success("Employé ajouté avec succès !");
      closeModal();
      setStep(1);
      setFormData({
        num_matricule: 0,
        num_cnaps: 0,
        CIN: "",
        nom: "",
        prenom: "",
        telephone: "",
        sexe: "Male",
        etat_civil: "Celibataire",
        date_naissance: "",
        date_embauche: "",
        contrat: "CDI",
        statut: "Employee",
        categorie: "1A",
        groupe: "I",
        localite: "",
        adresse: "",
        fonction: "",
        projet: "",
        nb_enfant: 0,
        email: "",
        salaire: 0,
        id_departement: 0,
      });
      fetchEmployees();
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Erreur lors de l'ajout de l'employé");
    }
  };

  return (
    <>
      <PageMeta title="pointage-systeme | FMBM" description="liste des employés et ajout" />
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4 mx-4">
          <h2 className="text-xl font-semibold dark:text-gray-200">Liste des employés</h2>
          <button onClick={openModal} className="bg-blue-500 text-white px-2 rounded">Nouveau</button>
        </div>

        <BasicTableOne employees={employees} />
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] p-6 lg:p-10">
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (step < 5) nextStep();
            }
          }}
        >
          <h3 className="text-lg font-semibold mb-4 text-center dark:text-gray-100">Ajouter un employé</h3>

          {/* Barre d’étapes */}
          <div className="flex justify-between mb-6">
            {["Infos de base", "Infos sup.", "Infos pro", "Contrat avancé", "Autres"].map((label, index) => (
              <div key={index} className="flex flex-col items-center w-1/5">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all ${
                  step === index + 1
                    ? "bg-blue-500 text-white border-blue-500"
                    : step > index + 1
                    ? "bg-green-500 text-white border-green-500"
                    : "border-gray-300 text-gray-500"
                }`}>
                  {index + 1}
                </div>
                <span className={`mt-2 text-xs ${step === index + 1 ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Étapes */}
          {step === 1 && (
            <div className="space-y-2">
              <label htmlFor="nom" className="text-gray-800 dark:text-gray-300">Nom :</label>
              <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" className="h-10 w-full border rounded px-3 dark:text-gray-200" required />
              <label htmlFor="prenom" className="text-gray-800 dark:text-gray-300">Prenom :</label>
              <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" className="h-10 w-full border rounded px-3 dark:text-gray-200" />
              <label htmlFor="CIN" className="text-gray-800 dark:text-gray-300">N° CIN :</label>
              <input name="CIN" value={formData.CIN} onChange={handleChange} placeholder="CIN" className="h-10 w-full border rounded px-3 dark:text-gray-200" required />
              <label htmlFor="date_naissance" className="text-gray-800 dark:text-gray-300">Date de naissance :</label>
              <input name="date_naissance" type="date" value={formData.date_naissance} onChange={handleChange} className="h-10 w-full border rounded px-3 dark:text-gray-200" required />
              <label htmlFor="telephone" className="text-gray-800 dark:text-gray-300">Telephone :</label>
              <input name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Téléphone" className="h-10 w-full border rounded px-3 dark:text-gray-200" required />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <label htmlFor="email" className="text-gray-800 dark:text-gray-300">Email :</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="h-10 w-full border rounded px-3 dark:text-gray-200" />
              <label htmlFor="sexe" className="text-gray-800 dark:text-gray-300">Sexe :</label>
              <select name="sexe" value={formData.sexe} onChange={handleChange} className="h-10 w-full border rounded px-3 dark:text-gray-200 dark:bg-black">
                <option value="Male">Male</option>
                <option value="Femelle">Femelle</option>
              </select>
              <label htmlFor="etat_civil" className="text-gray-800 dark:text-gray-300">Etat civil :</label>
              <select name="etat_civil" value={formData.etat_civil} onChange={handleChange} className="h-10 w-full border rounded px-3 dark:text-gray-200 dark:bg-black">
                <option value="Celibataire">Celibataire</option>
                <option value="Marie">Marie</option>
              </select>
              <label htmlFor="nb_enfant" className="text-gray-800 dark:text-gray-300">Nombre d'enfant :</label>
              <input name="nb_enfant" type="number" value={formData.nb_enfant} onChange={handleChange} placeholder="Nombre d'enfants" className="h-10 w-full border rounded px-3 dark:text-gray-200" />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <label htmlFor="num_matricule" className="text-gray-800 dark:text-gray-300">N° Matricule :</label>
              <input name="num_matricule" type="number" value={formData.num_matricule} onChange={handleChange} placeholder="Numéro matricule" className="h-10 w-full border rounded px-3 dark:text-gray-200" required />
              <label htmlFor="num_cnaps" className="text-gray-800 dark:text-gray-300">N° Cnaps :</label>
              <input name="num_cnaps" type="number" value={formData.num_cnaps} onChange={handleChange} placeholder="Numéro CNAPS" className="h-10 w-full border rounded px-3 dark:text-gray-200" required />
              <label htmlFor="localite" className="text-gray-800 dark:text-gray-300">Localite :</label>
              <input name="localite" value={formData.localite} onChange={handleChange} placeholder="Localité" className="h-10 w-full border rounded px-3 dark:text-gray-200" required />
              <label htmlFor="adresse" className="text-gray-800 dark:text-gray-300">Adresse :</label>
              <input name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Adresse" className="h-10 w-full border rounded px-3 dark:text-gray-200" required />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <label htmlFor="contrat" className="text-gray-800 dark:text-gray-300">Contrat :</label>
              <select name="contrat" value={formData.contrat} onChange={handleChange} className="h-10 w-full border rounded px-3 dark:text-gray-200 dark:bg-black">
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
              </select>
              <label htmlFor="statut" className="text-gray-800 dark:text-gray-300">Statut :</label>
              <select name="statut" value={formData.statut} onChange={handleChange} className="h-10 w-full border rounded px-3 dark:text-gray-200 dark:bg-black">
                <option value="Employee">Employee</option>
                <option value="Cadre">Cadre</option>
                <option value="Cadre supérieur">Cadre supérieur</option>
              </select>
              <label htmlFor="salaire" className="text-gray-800 dark:text-gray-300">Salaire :</label>
              <input name="salaire" type="number" value={formData.salaire} onChange={handleChange} placeholder="Salaire" className="h-10 w-full border rounded px-3 dark:text-gray-200" required />
              <label htmlFor="id_departement" className="text-gray-800 dark:text-gray-300">Departement :</label>
              <select name="id_departement" value={formData.id_departement} onChange={handleChange} className="h-10 w-full border rounded px-3 dark:text-gray-200 dark:bg-black">
                <option value={0}>-- Choisir un département --</option>
                <option value={1}>Administration et Finance - AF</option>
                <option value={2}>Ressource Humaine - RH</option>
              </select>
              <label htmlFor="fonction" className="text-gray-800 dark:text-gray-300">Fonction :</label>
              <input name="fonction" value={formData.fonction} onChange={handleChange} placeholder="Fonction" className="h-10 w-full border rounded px-3 dark:text-gray-200" required />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-2">
              <label htmlFor="categorie" className="text-gray-800 dark:text-gray-300">Categorie :</label>
              <select name="categorie" value={formData.categorie} onChange={handleChange} className="h-10 w-full border rounded px-3 dark:text-gray-200 dark:bg-black">
                {["1A","2A","3A","4A","5A","1B","2B","3B","4B","5B","HC"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <label htmlFor="groupe" className="text-gray-800 dark:text-gray-300">Groupe :</label>
              <select name="groupe" value={formData.groupe} onChange={handleChange} className="h-10 w-full border rounded px-3 dark:text-gray-200 dark:bg-black">
                {["I","II","III","IV","V","VI","VII","VIII"].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <label htmlFor="date_embauche" className="text-gray-800 dark:text-gray-300">Date d'embauche :</label>
              <input name="date_embauche" type="date" value={formData.date_embauche} onChange={handleChange} className="h-10 w-full border rounded px-3 dark:text-gray-200" required />
              <label htmlFor="projet" className="text-gray-800 dark:text-gray-300">Projet :</label>
              <input name="projet" value={formData.projet} onChange={handleChange} placeholder="Projet" className="h-10 w-full border rounded px-3 dark:text-gray-200" />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="px-4 py-2 border rounded text-gray-700 dark:text-gray-300">Précédent</button>
            ) : <div></div>}
            {step < 5 ? (
              <button type="button" onClick={nextStep} className="px-4 py-2 bg-blue-600 text-white rounded">Suivant</button>
            ) : (
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Enregistrer</button>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
}
