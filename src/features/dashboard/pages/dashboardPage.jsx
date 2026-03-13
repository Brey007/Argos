import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import Spinner from "../../shared/components/ui/spinner";
import Card from "../../shared/components/ui/card";
import Button from "../../shared/components/ui/button";
import { useDashboardData } from "../hooks/useDashboardData";
import DashboardTabs from "../components/DashboardTabs";
import ErrorState from "../components/ErrorState";
import ClientsView from "../components/ClientsView";
import AppointmentsView from "../components/AppoimentsView";
import DetailModal from "../components/DetailModal";
import ClientFormModal from "../components/ClientFormModal";
import AppointmentFormModal from "../components/AppointmentFormModal";

export default function DashboardPage() {
  const { user, signOut, authLoading } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, user, navigate]);

  const {
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
  } = useDashboardData({ userId });

  const [tab, setTab] = useState("clients");

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Modales de formularios
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [clientFormMode, setClientFormMode] = useState("create");
  const [editingClient, setEditingClient] = useState(null);

  const [apptFormOpen, setApptFormOpen] = useState(false);
  const [apptFormMode, setApptFormMode] = useState("create");
  const [editingAppointment, setEditingAppointment] = useState(null);

  const detailOpen = Boolean(selectedClient || selectedAppointment);

  const detailTitle = useMemo(() => {
    if (selectedClient) return `Client: ${selectedClient.name}`;
    if (selectedAppointment) return "Appointment detail";
    return "";
  }, [selectedClient, selectedAppointment]);

  function openCreateClient() {
    setClientFormMode("create");
    setEditingClient(null);
    setClientFormOpen(true);
  }

  function openEditClient(client) {
    setClientFormMode("edit");
    setEditingClient(client);
    setClientFormOpen(true);
  }

  async function handleDeleteClient(client) {
    const ok = window.confirm(`¿Delete client "${client.name}"?\n\nThis action have no turning back.`);
    if (!ok) return;

    try {
      await deleteClient(client.id);
      if (selectedClient?.id === client.id) setSelectedClient(null);
    } catch (e) {
      window.alert(e?.message || "The client can not be deleted.");
    }
  }

  function openCreateAppointment() {
    if (clients.length === 0) {
      window.alert("Create first a client before create an appointment.");
      return;
    }
    setApptFormMode("create");
    setEditingAppointment(null);
    setApptFormOpen(true);
  }

  function openEditAppointment(a) {
    setApptFormMode("edit");
    setEditingAppointment(a);
    setApptFormOpen(true);
  }

  async function handleDeleteAppointment(a) {
    const ok = window.confirm("¿Dele this appointment? This action have no turning back.");
    if (!ok) return;

    try {
      await deleteAppointment(a.id);
      if (selectedAppointment?.id === a.id) setSelectedAppointment(null);
    } catch (e) {
      window.alert(e?.message || "The appointment can not be deleted.");
    }
  }

  async function handleQuickStatus(a, nextStatus) {
    try {
      const updated = await updateAppointment(a.id, {
        clientId: a.clientId,
        dateTime: a.dateTime,
        service: a.service,
        notes: a.notes,
        status: nextStatus,
      });

      if (selectedAppointment?.id === a.id) {
        setSelectedAppointment(updated);
      }
    } catch (e) {
      window.alert(e?.message || "Can not reload the state.");
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-gray-600">Loading data…</p>
        </div>

        <Card className="p-6 flex items-center gap-3">
          <Spinner />
          <span className="text-gray-700">Loading clients and appointments</span>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-gray-600">We couldn't load the data.</p>
        </div>

        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your clients and appointments
          </p>
        </div>

        <div className="flex items-end gap-2">
          <div className="text-sm text-gray-600">{user?.email ? `Sesión: ${user.email}` : null}</div>
          <Button variant="secondary" onClick={async () => await signOut()}>
            Close session
          </Button>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <DashboardTabs active={tab} onChange={setTab} />

        {tab === "clients" ? (
          <Button onClick={openCreateClient}>New client</Button>
        ) : (
          <Button onClick={openCreateAppointment}>New appointment</Button>
        )}
      </div>

      {tab === "clients" ? (
        <ClientsView
          clients={clients}
          onSelectClient={setSelectedClient}
          onCreate={openCreateClient}
          onEdit={openEditClient}
          onDelete={handleDeleteClient}
        />
      ) : (
        <AppointmentsView
          appointments={appointments}
          clientById={clientById}
          onSelectAppointment={setSelectedAppointment}
          onCreate={openCreateAppointment}
          onEdit={openEditAppointment}
          onDelete={handleDeleteAppointment}
          onQuickStatus={handleQuickStatus}
        />
      )}
      <DetailModal
        open={detailOpen}
        title={detailTitle}
        onClose={() => {
          setSelectedClient(null);
          setSelectedAppointment(null);
        }}
      >
        {selectedClient ? (
          <div className="grid gap-2 text-sm">
            <div><span className="font-medium">Name:</span> {selectedClient.name}</div>
            <div><span className="font-medium">Phone:</span> {selectedClient.phone}</div>
            <div><span className="font-medium">Email:</span> {selectedClient.email || "—"}</div>
            <div><span className="font-medium">Status:</span> {selectedClient.status}</div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => openEditClient(selectedClient)}>Edit</Button>
              <Button
                variant="ghost"
                onClick={() => handleDeleteClient(selectedClient)}
                className="text-red-700 hover:bg-red-50"
              >
                Delete
              </Button>
            </div>
          </div>
        ) : null}

        {selectedAppointment ? (
          <div className="grid gap-2 text-sm">
            <div>
              <span className="font-medium">Cliente:</span>{" "}
              {clientById.get(selectedAppointment.clientId)?.name || "Cliente desconocido"}
            </div>
            <div><span className="font-medium">Fecha/hora:</span> {new Date(selectedAppointment.dateTime).toLocaleString("es-CO")}</div>
            <div><span className="font-medium">Servicio:</span> {selectedAppointment.service}</div>
            <div><span className="font-medium">Notas:</span> {selectedAppointment.notes || "—"}</div>
            <div><span className="font-medium">Estado:</span> {selectedAppointment.status}</div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => openEditAppointment(selectedAppointment)}>Edit</Button>
              <Button
                variant="ghost"
                onClick={() => handleDeleteAppointment(selectedAppointment)}
                className="text-red-700 hover:bg-red-50"
              >
                Eliminar
              </Button>
            </div>
          </div>
        ) : null}
      </DetailModal>

      {/* Modal CRUD Clientes */}
      <ClientFormModal
        open={clientFormOpen}
        mode={clientFormMode}
        initialClient={editingClient}
        onClose={() => setClientFormOpen(false)}
        onSubmit={async (payload) => {
          if (clientFormMode === "create") return await createClient(payload);
          if (!editingClient) throw new Error("There is no client to edit.");
          const updated = await updateClient(editingClient.id, payload);
          if (selectedClient?.id === editingClient.id) setSelectedClient(updated);
          return updated;
        }}
      />

      {/* Modal CRUD Citas */}
      <AppointmentFormModal
        open={apptFormOpen}
        mode={apptFormMode}
        initialAppointment={editingAppointment}
        clients={clients}
        onClose={() => setApptFormOpen(false)}
        onSubmit={async (payload) => {
          if (apptFormMode === "create") return await createAppointment(payload);
          if (!editingAppointment) throw new Error("There is no appointment to edit.");
          const updated = await updateAppointment(editingAppointment.id, payload);
          if (selectedAppointment?.id === editingAppointment.id) setSelectedAppointment(updated);
          return updated;
        }}
      />
    </div>
  );
}