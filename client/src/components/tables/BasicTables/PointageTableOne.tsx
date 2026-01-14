import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { Pointage, getPointages, enregistrerArrivee, enregistrerDepart } from "../../../api/pointageApi";
import { Horaire, getHoraires } from "../../../api/horaireApi";
import { Employee, getEmployees } from "../../../api/employeeApi";
import { FiLogIn, FiLogOut, FiClock } from "react-icons/fi";

// Type étendu qui inclut le flag isVirtual et l'heure théorique
type ExtendedPointage = Pointage & {
  isVirtual?: boolean;
  heureEntreeTheorique?: string;
};

export default function PointageTableOne() {
  const [pointages, setPointages] = useState<Pointage[]>([]);
  const [horaires, setHoraires] = useState<Horaire[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [today] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // États pour les filtres
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>(today);
  const [searchName, setSearchName] = useState<string>("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pointagesData, horairesData, employeesData] = await Promise.all([
          getPointages(),
          getHoraires(),
          getEmployees()
        ]);
        setPointages(pointagesData);
        setHoraires(horairesData);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR");

  const formatTime = (timeStr: string) =>
    timeStr ? timeStr.slice(0, 5) : "-";

  /**
   * Trouve l'horaire applicable pour une date donnée
   */
  const getHoraireForDate = (datePointage: Date): Horaire | null => {
    if (horaires.length === 0) return null;
    
    const pointageDate = new Date(datePointage);
    pointageDate.setHours(0, 0, 0, 0);
    
    // Filtrer les horaires dont la semaine est <= à la date du pointage
    const horairesApplicables = horaires.filter(h => {
      const semaineDate = new Date(h.semaine);
      semaineDate.setHours(0, 0, 0, 0);
      return semaineDate <= pointageDate;
    });

    if (horairesApplicables.length === 0) {
      return null;
    }

    // Prendre l'horaire le plus récent (dernière semaine configurée avant la date)
    const horaire = horairesApplicables.sort(
      (a, b) => new Date(b.semaine).getTime() - new Date(a.semaine).getTime()
    )[0];

    return horaire;
  };

  /**
 * Calcule le statut et le retard en minutes pour un pointage
 */
const getStatutAndRetard = (item: ExtendedPointage): { statut: string, retardMinutes: number } => {
  // Cas 1: Absence virtuelle
  if (item.isVirtual) {
    return { statut: "Absent", retardMinutes: 0 };
  }

  // Cas 2: Pas d'heure d'arrivée = Absent
  if (!item.heure_arrivee || item.heure_arrivee.trim() === "") {
    return { statut: "Absent", retardMinutes: 0 };
  }

  // Cas 3: Si le statut est déjà "Permission", on ne recalcule pas
  if (item.statut === "Permission") {
    return { statut: "Permission", retardMinutes: 0 };
  }

  // Calcul du retard
  let retardMinutes = 0;
  try {
    const datePointage = new Date(item.date_pointage);
    const horaire = getHoraireForDate(datePointage);
    
    if (horaire) {
      const [hArr, mArr] = item.heure_arrivee.split(":").map(Number);
      const [hDeb, mDeb] = horaire.heure_entree.split(":").map(Number);
      
      if (!isNaN(hArr) && !isNaN(mArr) && !isNaN(hDeb) && !isNaN(mDeb)) {
        const arriveeMinutes = hArr * 60 + mArr;
        const debutMinutes = hDeb * 60 + mDeb;
        const margeTolerance = 5; // 5 minutes de tolérance
        retardMinutes = Math.max(0, arriveeMinutes - debutMinutes - margeTolerance);
      }
    }
  } catch (error) {
    console.error("Erreur calcul retard:", error);
  }

  // Détermination du statut
  let statut = "Présent";
  
  if (retardMinutes > 0) {
    statut = `Retard (${retardMinutes}min)`;
  } else if (item.statut === "Absent") {
    statut = "Absent";
  }

  return { statut, retardMinutes };
};

  /**
   * Obtient l'heure théorique d'entrée pour un pointage
   */
  const getHeureTheorique = (item: ExtendedPointage): string => {
    if (item.heureEntreeTheorique) {
      return item.heureEntreeTheorique;
    }
    
    try {
      const datePointage = new Date(item.date_pointage);
      const horaire = getHoraireForDate(datePointage);
      return horaire ? horaire.heure_entree : "09:00";
    } catch {
      return "09:00";
    }
  };

  /**
   * Crée un tableau combiné avec pointages réels et absences virtuelles
   */
  const getCombinedData = (): ExtendedPointage[] => {
    // Formater la date pour la comparaison
    const dateFormatted = dateFilter;
    const datePointage = new Date(dateFormatted);

    // Pointages existants pour la date sélectionnée
    const pointagesDuJour = pointages.filter(p => {
      try {
        const pointageDate = new Date(p.date_pointage);
        const pointageDateStr = pointageDate.toISOString().split('T')[0];
        return pointageDateStr === dateFormatted;
      } catch {
        return false;
      }
    });

    // Employés qui ont déjà pointé aujourd'hui
    const employeesAyantPointe = new Set(
      pointagesDuJour.map(p => p.id_employee)
    );

    // Employés qui n'ont pas encore pointé
    const employeesNonPointe = employees.filter(emp => 
      !employeesAyantPointe.has(emp.id_employee)
    );

    // Convertir les employés non pointés en objets pointage "virtuels"
    const absencesVirtuelles: ExtendedPointage[] = employeesNonPointe.map(emp => {
      const horaire = getHoraireForDate(datePointage);
      
      return {
        id_pointage: -emp.id_employee,
        id_employee: emp.id_employee,
        date_pointage: dateFormatted,
        heure_arrivee: "",
        heure_depart: "",
        statut: "Absent",
        Employee: {
          prenom: emp.prenom || "",
          nom: emp.nom || ""
        },
        heureEntreeTheorique: horaire ? horaire.heure_entree : "09:00",
        isVirtual: true
      };
    });

    // Ajouter le flag isVirtual et heure théorique aux pointages existants
    const pointagesAvecFlag = pointagesDuJour.map(p => {
      const horaire = getHoraireForDate(new Date(p.date_pointage));
      
      return {
        ...p,
        isVirtual: false,
        heureEntreeTheorique: horaire ? horaire.heure_entree : "09:00"
      };
    });

    // Combiner pointages réels et absences virtuelles
    return [...pointagesAvecFlag, ...absencesVirtuelles];
  };

  /**
   * Fonction pour pointer l'arrivée d'un employé
   */
  const handlePointerArrivee = async (employeeId: number) => {
    try {
      const maintenant = new Date();
      const aujourdHui = new Date(maintenant);
      aujourdHui.setHours(0, 0, 0, 0);
      
      // Trouver l'horaire théorique
      const horaire = getHoraireForDate(aujourdHui);
      const heureTheorique = horaire ? horaire.heure_entree : "09:00";
      
      // Formatage de l'heure actuelle
      const heures = maintenant.getHours().toString().padStart(2, '0');
      const minutes = maintenant.getMinutes().toString().padStart(2, '0');
      const heureActuelle = `${heures}:${minutes}`;
      
      // Calcul du statut basé sur la comparaison
      let retardMinutes = 0;
      
      if (horaire) {
        const [hAct, mAct] = heureActuelle.split(":").map(Number);
        const [hTheo, mTheo] = heureTheorique.split(":").map(Number);
        
        if (!isNaN(hAct) && !isNaN(mAct) && !isNaN(hTheo) && !isNaN(mTheo)) {
          const actuelMinutes = hAct * 60 + mAct;
          const theoMinutes = hTheo * 60 + mTheo;
          const margeTolerance = 5;
          retardMinutes = Math.max(0, actuelMinutes - theoMinutes - margeTolerance);
        }
      }
      
      // Enregistrer l'arrivée avec le statut calculé
      await enregistrerArrivee(employeeId);

      
      // Rafraîchir les pointages
      const updatedPointages = await getPointages();
      setPointages(updatedPointages);
      
      // Message d'alerte approprié
      if (retardMinutes > 0) {
        alert(`Arrivée enregistrée à ${heureActuelle} - Retard de ${retardMinutes} minutes`);
      } else {
        alert(`Arrivée enregistrée à ${heureActuelle} - À l'heure`);
      }
    } catch (error) {
      console.error("Erreur lors du pointage d'arrivée :", error);
      alert("Erreur lors de l'enregistrement de l'arrivée");
    }
  };

  /**
   * Fonction pour pointer le départ d'un employé
   */
  const handlePointerDepart = async (pointageId: number) => {
    try {
      // Utiliser la fonction API pour enregistrer le départ
      await enregistrerDepart(pointageId);
      
      // Rafraîchir les pointages après enregistrement
      const updatedPointages = await getPointages();
      setPointages(updatedPointages);
      
      alert("Départ enregistré avec succès !");
    } catch (error) {
      console.error("Erreur lors du pointage de départ :", error);
      alert("Erreur lors de l'enregistrement du départ");
    }
  };

  // Obtenir les données combinées
  const combinedData = getCombinedData();

  // Appliquer les filtres supplémentaires
  const filteredData = combinedData.filter((item) => {
    // Filtre par employé sélectionné
    let matchEmployee = true;
    if (selectedEmployee !== "all") {
      matchEmployee = item.id_employee === Number(selectedEmployee);
    }
    
    // Filtre par nom/prénom
    let matchName = true;
    if (searchName.trim() !== "") {
      const searchLower = searchName.toLowerCase().trim();
      
      if (item.Employee) {
        const nom = item.Employee.nom || "";
        const prenom = item.Employee.prenom || "";
        matchName = 
          nom.toLowerCase().includes(searchLower) ||
          prenom.toLowerCase().includes(searchLower);
      }
    }
    
    return matchEmployee && matchName;
  });

  // Pagination sur les données filtrées
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  // Gestion des changements de filtre
  const handleEmployeeChange = (value: string) => {
    setSelectedEmployee(value);
    setCurrentPage(1);
  };

  const handleDateChange = (value: string) => {
    setDateFilter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchName(value);
    setCurrentPage(1);
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSelectedEmployee("all");
    setDateFilter(today);
    setSearchName("");
    setCurrentPage(1);
  };

  // Calcul des statistiques
  const stats = {
    total: combinedData.length,
    present: combinedData.filter(item => {
      const { statut } = getStatutAndRetard(item);
      return statut === "Présent";
    }).length,
    retard: combinedData.filter(item => {
      const { statut } = getStatutAndRetard(item);
      return statut.includes("Retard");
    }).length,
    absent: combinedData.filter(item => {
      const { statut } = getStatutAndRetard(item);
      return statut === "Absent";
    }).length,
    permission: combinedData.filter(item => {
      const { statut } = getStatutAndRetard(item);
      return statut === "Permission";
    }).length,
    avecDepart: combinedData.filter(item => item.heure_depart && !item.isVirtual).length,
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Section filtres */}
      <div className="p-4 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Filtre par employé */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Employé
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => handleEmployeeChange(e.target.value)}
              className="w-full border px-3 py-2 rounded-md text-sm"
            >
              <option value="all">Tous les employés</option>
              {employees.map(emp => (
                <option key={emp.id_employee} value={emp.id_employee}>
                  {emp.prenom} {emp.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Date du pointage */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date du pointage
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>

          {/* Recherche par nom */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recherche
            </label>
            <input
              type="text"
              placeholder="Nom ou prénom..."
              value={searchName}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2 self-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Statistiques et compteur */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{filteredData.length}</span> élément(s) • 
            <span className="ml-2">Date: {formatDate(dateFilter)}</span>
            {selectedEmployee !== "all" && (
              <span className="ml-2">
                • Employé: {employees.find(e => e.id_employee === Number(selectedEmployee))?.prenom || ""}
              </span>
            )}
          </div>
          
          {/* Stats rapides */}
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Présent: {stats.present}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span>Retard: {stats.retard}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span>Absent: {stats.absent}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span>Déjà parti: {stats.avecDepart}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start">ID</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start">Employé</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start">Date</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start">Heure théorique</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start">Heure d'arrivée</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start">Heure départ</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start">Statut</TableCell>
              <TableCell isHeader className="px-5 py-3 font-semibold text-gray-500 text-start">Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredData.length === 0 ? (
              <TableRow>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  Aucun pointage trouvé pour cette date.
                </td>
              </TableRow>
            ) : (
              currentItems.map((item) => {
                const employeeName = item.Employee
                  ? `${item.Employee.prenom} ${item.Employee.nom}`
                  : "Employé inconnu";
                
                const { statut, retardMinutes } = getStatutAndRetard(item);
                const estVirtual = item.isVirtual;
                const aDejaArrive = item.heure_arrivee && !estVirtual;
                const aDejaParti = item.heure_depart && !estVirtual;
                const heureTheorique = getHeureTheorique(item);
                
                return (
                  <TableRow 
                    key={item.id_pointage} 
                    className={estVirtual ? "bg-red-50 dark:bg-red-900/20" : ""}
                  >
                    <TableCell className="px-4 py-3 text-gray-600">
                      {estVirtual ? "ABS" : item.id_pointage}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-600">
                      {employeeName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-600">
                      {formatDate(item.date_pointage)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-1">
                        <FiClock className="text-purple-500" size={14} />
                        <span>{heureTheorique}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-600">
                      {estVirtual ? (
                        <span className="text-red-500 italic">Non pointé</span>
                      ) : item.heure_arrivee ? (
                        <div className="flex items-center gap-1">
                          <FiLogIn className="text-green-500" size={14} />
                          <span>{formatTime(item.heure_arrivee)}</span>
                          {retardMinutes > 0 && (
                            <span className="text-xs text-yellow-600 bg-yellow-100 px-1 py-0.5 rounded ml-1">
                              +{retardMinutes}min
                            </span>
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-600">
                      {aDejaParti ? (
                        <div className="flex items-center gap-1">
                          <FiLogOut className="text-blue-500" size={14} />
                          <span>{formatTime(item.heure_depart || "")}</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        size="sm"
                        color={
                          statut === "Présent"
                            ? "success"
                            : statut.includes("Retard")
                            ? "warning"
                            : statut === "Permission"
                            ? "info"
                            : "error"
                        }
                      >
                        {statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex gap-2">
                        {estVirtual ? (
                          <button
                            onClick={() => handlePointerArrivee(item.id_employee)}
                            className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex items-center gap-1"
                            title="Pointer l'arrivée"
                          >
                            <FiLogIn size={14} />
                            <span>Arrivée</span>
                          </button>
                        ) : !aDejaArrive ? (
                          <button
                            onClick={() => handlePointerArrivee(item.id_employee)}
                            className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex items-center gap-1"
                            title="Pointer l'arrivée"
                          >
                            <FiLogIn size={14} />
                            <span>Arrivée</span>
                          </button>
                        ) : !aDejaParti ? (
                          <button
                            onClick={() => handlePointerDepart(item.id_pointage)}
                            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-1"
                            title="Pointer le départ"
                          >
                            <FiLogOut size={14} />
                            <span>Départ</span>
                          </button>
                        ) : (
                          <span className="text-gray-500 text-sm flex items-center gap-1">
                            <FiLogOut size={14} />
                            Terminé
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="flex justify-center items-center gap-3 py-4">
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>

            <span className="text-gray-700">
              Page {currentPage} / {totalPages}
            </span>

            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}