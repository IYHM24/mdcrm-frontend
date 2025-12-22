import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();

  /*  */

  // Vite-recommended way to reference files in `public/`
  const hero = new URL('/assets/Login/Background/fondo/fondo.webp', import.meta.url).href

  /*  */
  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen lg:grid lg:grid-cols-2 shadow-lg">
      <div
        className="flex items-center justify-center py-12 lg:rounded-l-2xl max-sm:rounded-2xl"
      >
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Iniciar sesión</h1>
            <p className="text-balance text-muted-foreground text-gray-600">
              Ingresa al sistema con tus credenciales
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            {error && (
              <div className="bg-red-50 border !border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label className="text-start" htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder='***********'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading} >
              {isLoading ? 'Loading...' : 'Login'}
            </Button>

          </form>

          {/* Registro - proximamente */}
          <div className="mt-4 text-center text-sm">
            {/* Don&apos;t have an account?{" "}
            <a href="#" className="underline">
              Sign up
            </a> */}
          </div>

          {/* Footer */}
          <footer className='text-center text-gray-600'>
            <h3 className='font-bold text-md'>Desarrollado con el 💙 por Ancom</h3>
            <span className='text-sm'>Copyright © {new Date().getFullYear()}</span>
          </footer>

        </div>
      </div>
      <div
        className="hidden bg-muted lg:block dark:bg-muted"
        style={{
          backgroundImage: `url(${hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
      </div>
    </div>
  );
};
