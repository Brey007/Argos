import Button from "../../shared/components/ui/button";

export default function () {
    return (
        <div className="mt-4 flex gap-2">
            <Button onClick={() => window.alert("Demo: Accion wa")}> waza </Button>
        </div>
    )
}