import Card from "../../shared/components/ui/card";
import Button from "../../shared/components/ui/button";

export default function ErrorState({ message, onRetry }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold">An error occurred</h3>
      <p className="mt-2 text-gray-600">{message}</p>
      <div className="mt-4">
        <Button onClick={onRetry}>Try again.</Button>
      </div>
    </Card>
  );
}
  