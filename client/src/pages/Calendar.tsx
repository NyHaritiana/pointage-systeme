import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventClickArg, DateSelectArg } from "@fullcalendar/core";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";
import PageMeta from "../components/common/PageMeta";

import {
  getAbsences,
  addAbsence,
  editAbsence,
  deleteAbsence,
} from "../api/absenceApi";
import type { Absence } from "../api/absenceApi";

interface CalendarEvent extends EventInput {
  id: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps: {
    motif?: string;
    id_employee?: number;
    statut?: Absence["statut"];
  };
}

const typeImpacteSolde = (type: Absence["type_absence"]) =>
  type === "Conge Paye" || type === "Permission";

const getStatusColor = (statut?: Absence["statut"]) => {
  switch (statut) {
    case "Approuve":
      return "#16a34a";
    case "Rejete":
      return "#dc2626";
    default:
      return "#2563eb"; // En attente
  }
};

const calculerJoursOuvres = (debut: string, fin: string): number => {
  const start = new Date(debut);
  const end = new Date(fin);
  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }

  return count;
};

const Calendar: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const id_employee: number = user?.employee?.id_employee || 0;

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const [eventType, setEventType] = useState<Absence["type_absence"]>("Conge Paye");
  const [eventMotif, setEventMotif] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");

  const [soldeAvant, setSoldeAvant] = useState(0);
  const [joursDemandes, setJoursDemandes] = useState(0);
  const [soldeApres, setSoldeApres] = useState(0);

  const loadSolde = async (type: Absence["type_absence"]) => {
    if (!typeImpacteSolde(type)) {
      setSoldeAvant(0);
      return;
    }

    try {
      const encodedType = encodeURIComponent(type);
      const res = await fetch(
        `https://server-pointage-systeme.onrender.com/api/solde-conge/${id_employee}/${encodedType}`
      );
      if (!res.ok) throw new Error("Solde introuvable");

      const data = await res.json();
      setSoldeAvant(data.solde_restant);
    } catch (err) {
      console.error("Erreur chargement solde", err);
      setSoldeAvant(0);
    }
  };

  useEffect(() => {
    if (!id_employee) return;

    const loadAbsences = async () => {
      const data = await getAbsences();
      const mapped: CalendarEvent[] = data
        .filter((a) => a.id_employee === id_employee)
        .map((a) => ({
          id: a.id_absence.toString(),
          title: a.type_absence,
          start: a.date_debut,
          end: a.date_fin,
          backgroundColor: getStatusColor(a.statut),
          borderColor: getStatusColor(a.statut),
          extendedProps: {
            motif: a.motif,
            id_employee: a.id_employee,
            statut: a.statut,
          },
        }));

      setEvents(mapped);
    };

    loadAbsences();
  }, [id_employee]);

  useEffect(() => {
    if (!eventStartDate || !eventEndDate) {
      setJoursDemandes(0);
      setSoldeApres(soldeAvant);
      return;
    }

    const jours = calculerJoursOuvres(eventStartDate, eventEndDate);
    setJoursDemandes(jours);

    setSoldeApres(typeImpacteSolde(eventType) ? soldeAvant - jours : soldeAvant);
  }, [eventStartDate, eventEndDate, eventType, soldeAvant]);

  // ===== HANDLERS =====

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModal();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const ev = clickInfo.event as unknown as CalendarEvent;
    setSelectedEvent(ev);
    setEventType(ev.title as Absence["type_absence"]);
    setEventMotif(ev.extendedProps.motif || "");
    setEventStartDate(ev.startStr);
    setEventEndDate(ev.endStr || ev.startStr);
    openModal();
  };

  const handleAddOrUpdateEvent = async () => {
    if (typeImpacteSolde(eventType) && soldeApres < 0) {
      alert("Solde insuffisant");
      return;
    }

    if (selectedEvent) {
      await editAbsence(Number(selectedEvent.id), {
        type_absence: eventType,
        date_debut: eventStartDate,
        date_fin: eventEndDate,
        motif: eventMotif,
        id_employee,
      });
    } else {
      const newAbsence = await addAbsence({
        id_employee,
        type_absence: eventType,
        date_debut: eventStartDate,
        date_fin: eventEndDate,
        motif: eventMotif,
        statut: "En attente",
      });

      setEvents((prev) => [
        ...prev,
        {
          id: newAbsence.id_absence.toString(),
          title: newAbsence.type_absence,
          start: newAbsence.date_debut,
          end: newAbsence.date_fin,
          backgroundColor: "#2563eb",
          borderColor: "#2563eb",
          extendedProps: {
            motif: newAbsence.motif,
            id_employee: newAbsence.id_employee,
            statut: newAbsence.statut,
          },
        },
      ]);
    }

    closeModal();
    resetModal();
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    await deleteAbsence(Number(selectedEvent.id));
    setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
    closeModal();
    resetModal();
  };

  const resetModal = () => {
    setSelectedEvent(null);
    setEventType("Conge Paye");
    setEventMotif("");
    setEventStartDate("");
    setEventEndDate("");
    setSoldeAvant(0);
    setJoursDemandes(0);
    setSoldeApres(0);
  };

  return (
    <>
      <PageMeta title="Calendrier des absences" description="Gestion RH" />

      <div className="bg-white dark:bg-dark-900 rounded-xl p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
        />
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6">
        <h3 className="text-xl font-semibold mb-4">
          {selectedEvent ? "Modifier une absence" : "Nouvelle demande d'absence"}
        </h3>

        {typeImpacteSolde(eventType) && (
          <div className="mb-4 p-4 rounded border bg-gray-50">
            <p>Solde avant : <strong>{soldeAvant}</strong> jours</p>
            <p>Jours demandés : <strong>{joursDemandes}</strong></p>
            <p className={soldeApres < 0 ? "text-red-600" : "text-green-600"}>
              Solde estimé après : <strong>{soldeApres}</strong>
            </p>
          </div>
        )}

        <select
          value={eventType}
          onChange={(e) => {
            const type = e.target.value as Absence["type_absence"];
            setEventType(type);
            loadSolde(type); // ⚡ charge le solde uniquement pour ce type
          }}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="Conge Paye">Congé Payé</option>
          <option value="Permission">Permission</option>
          <option value="Arret Maladie">Arrêt Maladie</option>
          <option value="Conge de Maternite">Congé Maternité</option>
          <option value="Conge de Paternite">Congé Paternité</option>
          <option value="Assistance Maternelle">Assistance Maternelle</option>
          <option value="Conge Formation">Congé Formation</option>
          <option value="Mission">Mission</option>
        </select>

        <input
          type="text"
          placeholder="Motif"
          value={eventMotif}
          onChange={(e) => setEventMotif(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="date"
          value={eventStartDate}
          onChange={(e) => setEventStartDate(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="date"
          value={eventEndDate}
          onChange={(e) => setEventEndDate(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <div className="flex justify-end gap-3">
          {selectedEvent && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Supprimer
            </button>
          )}

          <button onClick={closeModal} className="px-4 py-2 border rounded">
            Fermer
          </button>

          <button
            onClick={handleAddOrUpdateEvent}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {selectedEvent ? "Mettre à jour" : "Envoyer la demande"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Calendar;
