import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { 
  Pointage, 
  getPointages, 
  enregistrerArrivee, 
  enregistrerDepart,
  convertToLocalTime 
} from "../../../api/pointageApi";
import { Horaire, getHoraires } from "../../../api/horaireApi";
import { Employee, getEmployees } from "../../../api/employeeApi";
import { FiLogIn, FiLogOut, FiClock, FiRefreshCw, FiGlobe } from "react-icons/fi";

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

  // État de chargement
  const [loading, setLoading] = useState(false);
  const [timezone, setTimezone] = useState<string>("");

  useEffect(() => {
    // Déterminer le fuseau horaire local
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  // Charger les données
  const fetchData = async () => {
    try {
      setLoading(true);
      const [pointagesData, horairesData, employeesData] = await Promise.all([
        getPointages(),
        getHoraires(),
        getEmployees()
      ]);
      setPointages(pointagesData);
      setHoraires(horairesData);
      setEmployees(employeesData);
      console.log("Données chargées:", {
        pointages: pointagesData.length,
        horaires: horairesData.length,
        employees: employeesData.length
      });
    } catch (error: unknown) {
      console.error("Erreur lors du chargement des données :", error);
      
      let errorMessage = "Erreur de connexion au serveur. Vérifiez votre connexion internet.";
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          errorMessage = "Service non trouvé. Vérifiez l'URL de l'API.";
        } else if (error.response?.status === 500) {
          errorMessage = "Erreur interne du serveur.";
        } else if (error.code === 'NETWORK_ERROR') {
          errorMessage = "Impossible de se connecter au serveur. Vérifiez votre connexion internet.";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR");

  /**
   * CORRECTION : Formater l'heure avec conversion de fuseau horaire
   */
  const formatTime = (timeStr: string): string => {
    if (!timeStr || timeStr.trim() === "" || timeStr === "null") return "-";
    
    try {
      // Essayer de convertir si c'est en UTC
      const convertedTime = convertToLocalTime(timeStr);
      
      // Si la conversion a fonctionné, formatter HH:mm
      if (convertedTime && convertedTime !== timeStr) {
        const parts = convertedTime.split(':');
        if (parts.length >= 2) {
          return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
        }
      }
      
      // Sinon, utiliser le formatage normal
      if (timeStr.includes(':')) {
        const parts = timeStr.split(':');
        if (parts.length >= 2) {
          return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
        }
      }
      
      return timeStr;
    } catch (error) {
      console.error("Erreur formatTime:", error);
      return timeStr;
    }
  };

  /**
   * Fonction pour obtenir l'heure actuelle locale pour l'affichage
   */
  const getCurrentLocalTime = (): string => {
    const maintenant = new Date();
    const heures = maintenant.getHours().toString().padStart(2, '0');
    const minutes = maintenant.getMinutes().toString().padStart(2, '0');
    return `${heures}:${minutes}`;
  };

  /**
   * Trouve l'horaire applicable pour une date donnée
   */
  const getHoraireForDate = (datePointage: Date): Horaire | null => {
    if (horaires.length === 0) return null;
    
    const pointageDate = new Date(datePointage);
    pointageDate.setHours(0, 0, 0, 0);
    
    const horairesApplicables = horaires.filter(h => {
      const semaineDate = new Date(h.semaine);
      semaineDate.setHours(0, 0, 0, 0);
      return semaineDate <= pointageDate;
    });

    if (horairesApplicables.length === 0) return null;

    const horaire = horairesApplicables.sort(
      (a, b) => new Date(b.semaine).getTime() - new Date(a.semaine).getTime()
    )[0];

    return horaire;
  };

  /**
   * Calcule le statut et le retard en minutes pour un pointage
   */
  const getStatutAndRetard = (item: ExtendedPointage): { statut: string, retardMinutes: number } => {
    if (item.isVirtual) {
      return { statut: "Absent", retardMinutes: 0 };
    }

    if (!item.heure_arrivee || item.heure_arrivee.trim() === "" || item.heure_arrivee === "null") {
      return { statut: "Absent", retardMinutes: 0 };
    }

    if (item.statut === "Permission") {
      return { statut: "Permission", retardMinutes: 0 };
    }

    let retardMinutes = 0;
    try {
      const datePointage = new Date(item.date_pointage);
      const horaire = getHoraireForDate(datePointage);
      
      if (horaire) {
        // Utiliser l'heure formatée (déjà convertie si nécessaire)
        const heureArriveeFormatted = formatTime(item.heure_arrivee);
        const arriveeParts = heureArriveeFormatted.split(':');
        const heureArrivee = parseInt(arriveeParts[0], 10) || 0;
        const minuteArrivee = parseInt(arriveeParts[1], 10) || 0;
        
        const theoriqueParts = horaire.heure_entree.split(':');
        const heureTheorique = parseInt(theoriqueParts[0], 10) || 9;
        const minuteTheorique = parseInt(theoriqueParts[1], 10) || 0;
        
        const arriveeMinutes = heureArrivee * 60 + minuteArrivee;
        const debutMinutes = heureTheorique * 60 + minuteTheorique;
        const margeTolerance = 5;
        
        retardMinutes = Math.max(0, arriveeMinutes - debutMinutes - margeTolerance);
      }
    } catch (error: unknown) {
      console.error("Erreur calcul retard:", error, item);
    }

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
      return horaire ? formatTime(horaire.heure_entree) : "09:00";
    } catch {
      return "09:00";
    }
  };

  /**
   * Crée un tableau combiné avec pointages réels et absences virtuelles
   */
  const getCombinedData = (): ExtendedPointage[] => {
    const dateFormatted = dateFilter;

    const pointagesDuJour = pointages.filter(p => {
      try {
        const pointageDate = new Date(p.date_pointage);
        const pointageDateStr = pointageDate.toISOString().split('T')[0];
        return pointageDateStr === dateFormatted;
      } catch {
        return false;
      }
    });

    const employeesAyantPointe = new Set(
      pointagesDuJour.map(p => p.id_employee)
    );

    const employeesNonPointe = employees.filter(emp => 
      !employeesAyantPointe.has(emp.id_employee)
    );

    const absencesVirtuelles: ExtendedPointage[] = employeesNonPointe.map(emp => {
      const datePointage = new Date(dateFormatted);
      const horaire = getHoraireForDate(datePointage);
      
      return {
        id_pointage: -emp.id_employee,
        id_employee: emp.id_employee,
        date_pointage: dateFormatted,
        heure_arrivee: "",
        heure_depart: null,
        statut: "Absent",
        Employee: {
          prenom: emp.prenom || "",
          nom: emp.nom || ""
        },
        heureEntreeTheorique: horaire ? formatTime(horaire.heure_entree) : "09:00",
        isVirtual: true
      };
    });

    const pointagesAvecFlag = pointagesDuJour.map(p => {
      const horaire = getHoraireForDate(new Date(p.date_pointage));
      
      return {
        ...p,
        isVirtual: false,
        heureEntreeTheorique: horaire ? formatTime(horaire.heure_entree) : "09:00"
      };
    });

    return [...pointagesAvecFlag, ...absencesVirtuelles];
  };

  /**
   * Fonction pour pointer l'arrivée d'un employé
   */
  const handlePointerArrivee = async (employeeId: number) => {
    try {
      const heureActuelle = getCurrentLocalTime();
      
      if (!confirm(`Pointer l'arrivée pour l'employé ${employeeId} à ${heureActuelle} ?`)) {
        return;
      }

      await enregistrerArrivee(employeeId, dateFilter);
      await fetchData();
      alert(`Arrivée enregistrée à ${heureActuelle} !`);
    } catch (error: unknown) {
      console.error("Erreur lors du pointage d'arrivée :", error);
      
      let errorMessage = "Échec de l'enregistrement";
      
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as { message?: string };
        errorMessage = errorData?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(`Erreur: ${errorMessage}`);
    }
  };

  /**
   * Fonction pour pointer le départ d'un employé
   */
  const handlePointerDepart = async (pointageId: number) => {
    try {
      const heureActuelle = getCurrentLocalTime();
      
      if (!confirm(`Pointer le départ à ${heureActuelle} ?`)) {
        return;
      }

      await enregistrerDepart(pointageId);
      await fetchData();
      alert(`Départ enregistré à ${heureActuelle} !`);
    } catch (error: unknown) {
      console.error("Erreur lors du pointage de départ :", error);
      
      let errorMessage = "Échec de l'enregistrement du départ";
      
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as { message?: string };
        errorMessage = errorData?.message || error.message || errorMessage;
        
        if (error.response?.status === 404) {
          errorMessage = `Route non trouvée. L'API attend /api/pointages/depart/${pointageId}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(`Erreur: ${errorMessage}`);
    }
  };

  /**
   * Rafraîchir manuellement les données
   */
  const handleRefresh = async () => {
    await fetchData();
  };

  // Obtenir les données combinées
  const combinedData = getCombinedData();

  // Appliquer les filtres supplémentaires
  const filteredData = combinedData.filter((item) => {
    let matchEmployee = true;
    if (selectedEmployee !== "all") {
      matchEmployee = item.id_employee === Number(selectedEmployee);
    }
    
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
    avecDepart: combinedData.filter(item => 
      item.heure_depart && 
      item.heure_depart !== "null" && 
      item.heure_depart.trim() !== "" && 
      !item.isVirtual
    ).length,
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Section filtres */}
      <div className="p-4 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="flex flex-wrap gap-4 mb-4 items-end">
          {/* Bouton rafraîchir */}
          <div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center gap-2 disabled:opacity-50"
              title="Rafraîchir les données"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Rafraîchir
            </button>
          </div>

          {/* Info fuseau horaire */}
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
            <FiGlobe className="text-blue-500" />
            <span>Fuseau: {timezone}</span>
            <span className="text-xs">(Heure locale)</span>
          </div>

          {/* Filtre par employé */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Employé
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => handleEmployeeChange(e.target.value)}
              className="w-full border px-3 py-2 rounded-md text-sm bg-white"
              disabled={loading}
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
              className="w-full border px-3 py-2 rounded-md text-sm bg-white"
              disabled={loading}
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
              className="w-full border px-3 py-2 rounded-md text-sm bg-white"
              disabled={loading}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
              disabled={loading}
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
            {loading && <span className="ml-2 text-blue-500">Chargement...</span>}
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
              <span>Départ: {stats.avecDepart}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Chargement des données...</span>
          </div>
        ) : (
          <>
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
                      {employees.length === 0 
                        ? "Aucun employé trouvé. Veuillez d'abord créer des employés."
                        : "Aucun pointage trouvé pour cette date."}
                    </td>
                  </TableRow>
                ) : (
                  currentItems.map((item) => {
                    const employeeName = item.Employee
                      ? `${item.Employee.prenom} ${item.Employee.nom}`
                      : `Employé #${item.id_employee}`;
                    
                    const { statut, retardMinutes } = getStatutAndRetard(item);
                    const estVirtual = item.isVirtual;
                    const aDejaArrive = item.heure_arrivee && item.heure_arrivee !== "null" && !estVirtual;
                    const aDejaParti = item.heure_depart && item.heure_depart !== "null" && !estVirtual;
                    const heureTheorique = getHeureTheorique(item);
                    
                    return (
                      <TableRow 
                        key={item.id_pointage} 
                        className={estVirtual ? "bg-red-50/50 dark:bg-red-900/10" : ""}
                      >
                        <TableCell className="px-4 py-3 text-gray-600">
                          {estVirtual ? "ABS" : item.id_pointage}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-600">
                          {employeeName}
                          {estVirtual && <span className="ml-2 text-xs text-red-500">(Absent)</span>}
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
                          ) : aDejaArrive ? (
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
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-600">
                          {aDejaParti ? (
                            <div className="flex items-center gap-1">
                              <FiLogOut className="text-blue-500" size={14} />
                              <span>{formatTime(item.heure_depart || "")}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
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
                                disabled={loading}
                              >
                                <FiLogIn size={14} />
                                <span>Arrivée</span>
                              </button>
                            ) : !aDejaArrive ? (
                              <button
                                onClick={() => handlePointerArrivee(item.id_employee)}
                                className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex items-center gap-1"
                                title="Pointer l'arrivée"
                                disabled={loading}
                              >
                                <FiLogIn size={14} />
                                <span>Arrivée</span>
                              </button>
                            ) : !aDejaParti ? (
                              <button
                                onClick={() => handlePointerDepart(item.id_pointage)}
                                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-1"
                                title="Pointer le départ"
                                disabled={loading}
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
            {filteredData.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 py-4 border-t border-gray-100">
                <button
                  className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  Précédent
                </button>

                <span className="text-gray-700 px-4">
                  Page {currentPage} / {totalPages}
                </span>

                <button
                  className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || loading}
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}