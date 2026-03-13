import Card from "../../shared/components/ui/card";
import Button from "../../shared/components/ui/button";


export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <Card className="p-6 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
      {actionLabel ? (
        <div className="mt-4">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      ) : null}
    </Card>
  );
}