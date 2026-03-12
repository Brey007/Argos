import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import Card from '../../shared/components/ui/card';
import Input from '../../shared/components/ui/input';
import Button from '../../shared/components/ui/button';

function isValidEmail (email) {
     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignupPage () {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState ("");
    const [formError, setFormError] = useState ("");
    const [info, setInfo] = useState("");

    const canSubmit = useMemo(() => {
        return isValidEmail(email.trim()) && password.length >= 8;
    }, [email, password]);

    async function onSubmit(e) {
        e.preventDefault();
        setFormError("");
        setInfo("");

        if (!canSubmit) {
            setFormError("Please enter a valid email and a password with at least 8 characters.");
            return;
        }

        setSubmitting(true);
        try{
            const {data}= await signUp({email: email.trim(), password});
            if (!data?.session) {
                setInfo("Signup successful! Please check your email to confirm your account.");
                return;
            }

            navigate("/dashboard", { replace: true });
        } catch (error) {
            setFormError(error?.message || "An error occurred during signup. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return(
    <div className="max-w-md mx-auto grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Crear cuenta</h1>
        <p className="mt-2 text-gray-600">Regístrate para acceder al dashboard.</p>
      </div>

      <Card className="p-6">
        <form className="grid gap-4" onSubmit={onSubmit}>
          {formError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </div>
          ) : null}

          {info ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {info}
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
            placeholder="mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={!canSubmit || submitting}>
              {submitting ? "Creando…" : "Crear cuenta"}
            </Button>
          </div>

          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link className="text-gray-900 underline" to="/login">
              Inicia sesión
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}