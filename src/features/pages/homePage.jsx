import Card from "../shared/components/ui/card";
import Button from "../shared/components/ui/button";

export default function HomePage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className = "text-2xl font-semibold tracking-tight">welcomewe</h1>
                <p className = "mt-2 text-gray-200">
                Papaya
                </p>
            </div>

                  <Card className="p-6">
                    <h2 className="text-lg font-semibold">Probandooo</h2>
                    <p className="mt-2 text-gray-600">
                    Pitufin
                    </p>

                    <div className="mt-4 flex gap-2">
                    <Button onClick={() => window.alert("Demo: Acción de ejemplo")}>Acción de ejemplo</Button>
                    <Button variant="secondary" onClick={() => window.alert("Demo: Acción secundaria")}>
                        Secundaria
                    </Button>
                    </div>
                </Card>
        </div>
    )
}