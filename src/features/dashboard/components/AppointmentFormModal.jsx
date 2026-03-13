import { useEffect, useMemo, useState } from 'react';
import DetailModal from './DetailModal';
import Input from '../../shared/components/ui/input';
import Button from '../../shared/components/ui/button';

function isoToLocalInputValue (iso) {
    if (!iso) return "";
    const date = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localInputValueToIso (local) {
    if (!localValue) return "";
    const d = new Date (localValue);
    return d.toISOString();
}

export default function AppointmentFormModal({
    open,
    mode,
    initialAppointment,
    clients,
    onClose,
    onSubmit,
}) {
    const isEdit = mode === "edit";
    const [clientId, setClientId] = useState("");
    const [dateTimeLocal, setDateTimeLocal] = useState("");
    const [service, setService] = useState("");
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState("scheduled");
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;
        if (isEdit && initialAppoiment) {
            setClientId(initialAppoiment.clientId || "");
            setDateTimeLocal(isoToLocalInputValue(initialAppointment.dateTime));
            setService(initialAppointment.service || "");
            setNotes(initialAppoiment.notes || "");
            setStatus(initialAppoiment.status || "");
        } else {
            setClientId(clients?.[0]?.id || "");
            setDateTimeLocal("");
            setService("");
            setNotes("");
            setStatus("scheduled");
        }

        setFormError("");
        setSubmitting(false);
    }, [open, isEdit, initialAppointment, clients]);

    const validation = useMemo (() => {
        const errors = {};
        const s = service.trim();
        const dtIso = localInputValueToIso(dateTimeLocal);

        if (!clientId) errors.clientId = "Select a client.";
        if (!dateTimeLocal) errors.dateTime = "The date/hour is required."
        if (dateTimeLocal && !dtIso) errors.dateTime = "Date/hour must be in a valid format.";
        if (!s) errors.service = "The service is required.";

        return {
            ok: Object.keys(errors).length === 0,
            errors, 
            payload: {
                clientId,
                dateTime: dtIso,
                service: s,
                notes: notes.trim(),
                status,
            },
        };
    }, [clientId, dateTimeLocal, service, notes, status]);

    async function handleSubmit(e) {
        e.preventDefault();
        setFormError("");

        if (!validation.ok) {
            setFormError("Please fix the errors in the form.");
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit(validation.payload);
            onClose();
        } catch (error) {
            setFormError(error?.message || "An error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
    <DetailModal open={open} title={isEdit ? "Edit Appointment" : "New Appointment"} onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {formError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        ) : null}

        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-gray-800">Client</label>
          <select
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            {Array.isArray(clients) && clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {validation.errors.clientId ? <p className="text-sm text-red-600">{validation.errors.clientId}</p> : null}
        </div>

        <Input
          label="Date & Time"
          name="dateTime"
          type="datetime-local"
          value={dateTimeLocal}
          onChange={(e) => setDateTimeLocal(e.target.value)}
        />
        {validation.errors.dateTime ? <p className="text-sm text-red-600 -mt-3">{validation.errors.dateTime}</p> : null}

        <Input
          label="Service"
          name="service"
          placeholder="e.g. Assembly, Repair, Consultation..."
          value={service}
          onChange={(e) => setService(e.target.value)}
        />
        {validation.errors.service ? <p className="text-sm text-red-600 -mt-3">{validation.errors.service}</p> : null}

        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-gray-800">Notes (optional)</label>
          <textarea
            className="min-h-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observations..."
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-gray-800">State</label>
          <select
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="scheduled">Agended</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Canceled</option>
          </select>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={!validation.ok || submitting}>
            {submitting ? "Save…" : isEdit ? "Save changes" : "Create Appointment"}
          </Button>
        </div>
      </form>
    </DetailModal>
  );
}