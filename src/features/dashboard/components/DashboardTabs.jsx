import Button from "../../shared/components/ui/button";

export default function DashboardTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant={active === "clients" ? "primary" : "secondary"}
        onClick={() => onChange("clients")}
      >
        Clients
      </Button>

      <Button
        variant={active === "appointments" ? "primary" : "secondary"}
        onClick={() => onChange("appointments")}
      >
        Appointments
      </Button>

      <Button
        variant={active === "learn" ? "primary" : "secondary"}
        onClick={() => onChange("learn")}
      >
        Learn
      </Button>
    </div>
  );
}