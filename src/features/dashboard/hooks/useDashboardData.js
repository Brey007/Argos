import { useEffect, useMemo, useState } from "react";
import { createClientDb, deleteClientDb, listClients, updateClientDb } from "../data/clientsApi";
import { countAppointmentsForClient, createAppointmentDb, deleteAppointmentDb, listAppointments, updateAppointmentDb } from "../data/appointmentsApi";

export function useDashboardData({ userId }) {
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!userId) return;

      setLoading(true);
      setError("");

      try {
        const [c, a] = await Promise.all([listClients(userId), listAppointments(userId)]);
        if (!alive) return;

        setClients(c);
        setAppointments(a);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Error loading the data.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [userId, reloadKey]);

  const clientById = useMemo(() => {
    const map = new Map();
    for (const c of clients) map.set(c.id, c);
    return map;
  }, [clients]);

  async function createClient(payload) {
    const row = await createClientDb(userId, payload);
    setClients((prev) => [row, ...prev]);
    return row;
  }

  async function updateClient(clientId, payload) {
    const row = await updateClientDb(userId, clientId, payload);
    setClients((prev) => prev.map((c) => (c.id === clientId ? row : c)));
    return row;
  }

  async function deleteClient(clientId) {
    const n = await countAppointmentsForClient(userId, clientId);
    if (n > 0) {
      throw new Error("You can not delete this user (associated appointments).");
    }

    await deleteClientDb(userId, clientId);

    setClients((prev) => prev.filter((c) => c.id !== clientId));
  }

  async function createAppointment(payload) {
    const row = await createAppointmentDb(userId, payload);
    setAppointments((prev) => [row, ...prev]);
    return row;
  }

  async function updateAppointment(appointmentId, payload) {
    const row = await updateAppointmentDb(userId, appointmentId, payload);
    setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? row : a)));
    return row;
  }

  async function deleteAppointment(appointmentId) {
    await deleteAppointmentDb(userId, appointmentId);
    setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
  }

  return {
    clients,
    appointments,
    clientById,
    loading,
    error,
    reload,
    createClient,
    updateClient,
    deleteClient,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
}