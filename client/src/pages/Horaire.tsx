import { useState, useEffect } from "react";
import PageMeta from "../components/common/PageMeta";
import { addHoraire, deleteHoraire, editHoraire, getHoraires, Horaire } from "../api/horaireApi";
import HoraireTable from "../components/tables/BasicTables/HoraireTable";
import { toast } from "react-toastify";


export default function Blank() {
  const [semaine, setSemaine] = useState("");
  const [heureEntree, setHeureEntree] = useState("");
  const [heureSortie, setHeureSortie] = useState("");
  const [horaires, setHoraires] = useState<Horaire[]>([]);
  const [selectedHoraire, setSelectedHoraire] = useState<Horaire | null>(null);

    useEffect(() => {
      fetchHoraires();
    }, []);
  
    const fetchHoraires = async () => {
      const data = await getHoraires();
      setHoraires(data);
    };  

  // Fonction de conversion "2025-W45" → "2025-11-03"
  function weekToDate(weekValue: string) {
    const [year, week] = weekValue.split("-W").map(Number);
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dayOfWeek = simple.getDay();
    const ISOweekStart = simple;
    if (dayOfWeek <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart.toISOString().split("T")[0];
  }

  function dateToWeek(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();

  const firstThursday = new Date(year, 0, 4);
  const firstThursdayTime = firstThursday.getTime();

  const currentThursday = new Date(date.getTime() + (3 - ((date.getDay() + 6) % 7)) * 86400000);
  const weekNumber = Math.round((currentThursday.getTime() - firstThursdayTime) / 604800000) + 1;

  return `${year}-W${weekNumber.toString().padStart(2, "0")}`;
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const semaineConvertie = weekToDate(semaine);

      const newHoraire = {
        semaine: semaineConvertie,
        heure_entree: heureEntree,
        heure_sortie: heureSortie,
      };

      if (selectedHoraire) {
        await editHoraire(selectedHoraire.id_horaire, newHoraire);
        toast.success("Horaire mis à jour avec succès !");
      } else {
        await addHoraire(newHoraire);
        toast.success("Horaire ajouté avec succès !");
      }

      setSemaine("");
      setHeureEntree("");
      setHeureSortie("");
      setSelectedHoraire(null);
      fetchHoraires();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout de l'horaire !");
    }
  };

  const handleDelete = async (id: number) => {
      try {
        await deleteHoraire(id);
        toast.success("Horaire supprimé avec succès !");
        setHoraires((prev) => prev.filter((e) => e.id_horaire !== id));
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors de la suppression.");
      }
    };

  const handleEdit = (horaire: Horaire) => {
    setSelectedHoraire(horaire);
    const weekConvert = dateToWeek(horaire.semaine);
    setSemaine(weekConvert);
    setHeureEntree(horaire.heure_entree);
    setHeureSortie(horaire.heure_sortie);
  };

  const CancelForm = () => {
    setSemaine("");
    setHeureEntree("");
    setHeureSortie("");
    setSelectedHoraire(null);
    toast.info("Modification annulée");
  }


  return (
    <div>
      <PageMeta
        title="pointage-systeme | FMBM"
        description="This is page for hours management"
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4 mx-4">
          <h2 className="text-xl font-semibold dark:text-gray-200">
            Gestion des horaires
          </h2>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Semaine
              </label>
              <input
                type="week"
                value={semaine}
                onChange={(e) => setSemaine(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 
                focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Heure de début
              </label>
              <input
                type="time"
                value={heureEntree}
                onChange={(e) => setHeureEntree(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 
                focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-100 
                appearance-auto cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Heure de fin
              </label>
              <input
                type="time"
                value={heureSortie}
                onChange={(e) => setHeureSortie(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 
                focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-100 
                appearance-auto cursor-pointer"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end space-x-3">
              {selectedHoraire && (
                <button
                  type="button"
                  onClick={CancelForm}
                  className="px-4 py-2 border border-gray-400 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Annuler
                </button>
              )}
              <button
                type="submit"
                className={`px-4 py-2 ${
                  selectedHoraire ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700"
                } text-white font-medium rounded-lg shadow 
                focus:outline-none focus:ring-2 ${
                  selectedHoraire ? "focus:ring-yellow-400" : "focus:ring-blue-400"
                }`}
              >
                {selectedHoraire ? "Mettre à jour" : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
        <HoraireTable horaires={horaires} onDelete={handleDelete} onEdit={handleEdit} />
      </div>
    </div>
  );
}
