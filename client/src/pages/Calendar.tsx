import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
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
  extendedProps: {
    calendar: string;
    motif?: string;
    id_employee?: number;
    statut?: Absence["statut"];
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventType, setEventType] = useState<Absence["type_absence"]>("Conge Paye");
  const [eventMotif, setEventMotif] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);

  const { isOpen, openModal, closeModal } = useModal();

  // Récupération de l'utilisateur connecté
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const id_employee: number = user?.employee?.id_employee || 0;

  useEffect(() => {
    if (!id_employee) return;

    const loadAbsences = async () => {
      try {
        const data = await getAbsences();

        const convertedEvents: CalendarEvent[] = data
          .filter((a) => a.id_employee === id_employee) // Seulement ses absences
          .map((a) => ({
            id: a.id_absence.toString(),
            title: a.type_absence,
            start: a.date_debut,
            end: a.date_fin,
            extendedProps: {
              calendar: getColor(a.type_absence),
              motif: a.motif || "",
              id_employee: a.id_employee,
              statut: a.statut,
            },
          }));

        setEvents(convertedEvents);
      } catch (err) {
        console.error("Erreur chargement absences :", err);
      }
    };

    loadAbsences();
  }, [id_employee]);

  const getColor = (type: Absence["type_absence"]) => {
    switch (type) {
      case "Conge Paye":
        return "rouge";
      case "Arret Maladie":
        return "vert";
      case "Permission":
        return "bleu";
      case "Conge de Maternite":
        return "violet";
      case "Conge de Paternite":
        return "cyan";
      case "Assistance Maternelle":
        return "orange";
      case "Conge Formation":
        return "indigo";
      case "Mission":
        return "gris";
      default:
        return "gris";
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;

    setSelectedEvent(event as unknown as CalendarEvent);
    setEventType(event.title as Absence["type_absence"]);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventMotif((event.extendedProps && event.extendedProps.motif) || "");

    openModal();
  };

  const handleAddOrUpdateEvent = async () => {
    try {
      if (!eventType || !eventStartDate || !eventEndDate) {
        alert("Remplissez le type et les dates.");
        return;
      }

      if (selectedEvent) {
        const updatedData: Partial<Omit<Absence, "id_absence">> = {
          id_employee,
          type_absence: eventType,
          date_debut: eventStartDate,
          date_fin: eventEndDate,
          motif: eventMotif,
        };

        const updatedAbsence = await editAbsence(Number(selectedEvent.id), updatedData);

        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === selectedEvent.id
              ? {
                  ...ev,
                  title: updatedAbsence.type_absence,
                  start: updatedAbsence.date_debut,
                  end: updatedAbsence.date_fin,
                  extendedProps: {
                    calendar: getColor(updatedAbsence.type_absence),
                    motif: updatedAbsence.motif,
                    id_employee: updatedAbsence.id_employee,
                    statut: updatedAbsence.statut,
                  },
                }
              : ev
          )
        );
      } else {
        const createBody: Omit<Absence, "id_absence"> = {
          id_employee,
          type_absence: eventType,
          date_debut: eventStartDate,
          date_fin: eventEndDate,
          motif: eventMotif,
          statut: "En attente",
        };

        const newAbsence = await addAbsence(createBody);

        const newEvent: CalendarEvent = {
          id: newAbsence.id_absence.toString(),
          title: newAbsence.type_absence,
          start: newAbsence.date_debut,
          end: newAbsence.date_fin,
          extendedProps: {
            calendar: getColor(newAbsence.type_absence),
            motif: newAbsence.motif,
            id_employee: newAbsence.id_employee,
            statut: newAbsence.statut,
          },
        };

        setEvents((prev) => [...prev, newEvent]);
      }

      closeModal();
      resetModalFields();
    } catch (err) {
      console.error("Erreur ajout/modif :", err);
      alert("Une erreur est survenue lors de l'enregistrement.");
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    if (!confirm("Voulez-vous vraiment supprimer cette absence ?")) return;

    try {
      await deleteAbsence(Number(selectedEvent.id));
      setEvents((prev) => prev.filter((ev) => ev.id !== selectedEvent.id));

      closeModal();
      resetModalFields();
    } catch (error) {
      console.error("Erreur suppression absence :", error);
      alert("Erreur lors de la suppression.");
    }
  };

  const resetModalFields = () => {
    setSelectedEvent(null);
    setEventType("Conge Paye");
    setEventMotif("");
    setEventStartDate("");
    setEventEndDate("");
  };

  return (
    <>
      <PageMeta title="Calendrier des absences" description="Gestion RH" />

      <div className="rounded-2xl border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-900 p-4">
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
          {selectedEvent ? "Modifier une absence" : "Ajouter une absence"}
        </h3>

        <label className="block mb-1">Type d'absence</label>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value as Absence["type_absence"])}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="Conge Paye">Congé Payé</option>
          <option value="Arret Maladie">Arrêt Maladie</option>
          <option value="Permission">Permission</option>
          <option value="Conge de Maternite">Congé Maternité</option>
          <option value="Conge de Paternite">Congé Paternité</option>
          <option value="Assistance Maternelle">Assistance Maternelle</option>
          <option value="Conge Formation">Congé Formation</option>
          <option value="Mission">Mission</option>
        </select>

        <label className="block mb-1">Motif</label>
        <input
          type="text"
          value={eventMotif}
          onChange={(e) => setEventMotif(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <label className="block mb-1">Date début</label>
        <input
          type="date"
          value={eventStartDate}
          onChange={(e) => setEventStartDate(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <label className="block mb-1">Date fin</label>
        <input
          type="date"
          value={eventEndDate}
          onChange={(e) => setEventEndDate(e.target.value)}
          className="w-full mb-5 p-2 border rounded"
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
            {selectedEvent ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Calendar;
