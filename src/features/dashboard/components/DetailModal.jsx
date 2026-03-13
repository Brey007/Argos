import Button from "../../shared/components/ui/button";
import Card from "../../shared/components/ui/card";

export default function DetailModal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <Card className="w-full max-w-lg p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" onClick={onClose} aria-label="Cerrar">
            Close
          </Button>
        </div>

        <div className="mt-4">{children}</div>
      </Card>
    </div>
  );
}