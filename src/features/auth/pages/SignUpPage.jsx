import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import Card from '../../shared/components/ui/card';
import Input from '../../shared/components/ui/input';
import Button from '../../shared/components/ui/button';
import fondo from '../../../assets/fondo.png';

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

    return (
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-12 bg-gradient-to-br from-slate-900 via-slate-950 to-black">
          <div className="max-w-md w-full">
            <h1 className="text-5xl font-bold tracking-tight text-white">Argos</h1>
            <p className="mt-3 text-sm text-white/75">Crea tu cuenta y accede al panel de gestión.</p>

            <Card className="mt-10 p-8 shadow-2xl">
              <form className="grid gap-5" onSubmit={onSubmit}>
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
                  <Link className="text-indigo-700 font-semibold" to="/login">
                    Inicia sesión
                  </Link>
                </p>
              </form>
            </Card>
          </div>
        </div>

        <div
          className="hidden md:block bg-cover bg-center"
          style={{
            backgroundImage: `url(${fondo})`,
          }}
        >
          <div className="h-full w-full bg-black/30" />
        </div>
      </div>
    );
}