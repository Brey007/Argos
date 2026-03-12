import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import Card from '../../shared/components/ui/card';
import Input from '../../shared/components/ui/input';
import Button from '../../shared/components/ui/Button';

function isValidEmail (email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage () {
    const { signInWithPassword } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState ("");
    const [formError, setFormError] = useState ("");

    const canSubmit = useMemo(() => {
        return isValidEmail(email.trim()) && password.leng >= 8;
    }, [email, password]);

    async function onSubmit(e) {
        e.preventDefault();
        setFormError("");
        if (!canSubmit) {
            setFormError("Please enter a valid email and a password with at least 8 characters.");
            return;
        }

        setSubmitting(true);
        try {
            await signInWithPassword(email.trim(), password);
            navigate(from, { replace: true });
        }catch (error) {
            setFormError(error?.message || "An error occurred during login. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
    <div className="max-w-md mx-auto grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
        <p className="mt-2 text-gray-600">Accede al dashboard con tu cuenta.</p>
      </div>

      <Card className="p-6">
        <form className="grid gap-4" onSubmit={onSubmit}>
          {formError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </div>
          ) : null}

          <Input
            label="Email"
            name="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={!canSubmit || submitting}>
              {submitting ? "Ingresando…" : "Ingresar"}
            </Button>
          </div>

          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link className="text-gray-900 underline" to="/signup">
              Regístrate
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}