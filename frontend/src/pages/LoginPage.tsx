import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login as loginService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginService(email, password);
      login(data.token, data.user);
      navigate('/');
    } catch {
      toast.error('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo — lomo de libro */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 bg-espresso">
        <span className="text-gold text-xs font-semibold tracking-widest uppercase">OwnLibrary</span>
        <div>
          <blockquote className="font-display text-3xl text-ivory/90 leading-relaxed italic mb-6">
            "Una biblioteca es un arsenal de libertad."
          </blockquote>
          <div className="w-10 h-px bg-gold mb-4" />
          <p className="text-parchment/50 text-sm">Voltaire</p>
        </div>
        <p className="text-parchment/30 text-xs tracking-widest uppercase">Sistema de gestión bibliográfica</p>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center bg-ivory dark:bg-gray-950 p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="lg:hidden text-mahogany text-xs font-semibold tracking-widest uppercase mb-3">OwnLibrary</p>
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-1">Iniciar sesión</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Accede al panel de gestión</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 tracking-wider uppercase">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-linen dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 dark:focus:border-gold/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 tracking-wider uppercase">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-linen dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 dark:focus:border-gold/40 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-mahogany hover:bg-mahogany-dark text-white py-2.5 rounded-lg disabled:opacity-60 transition-colors text-sm font-semibold mt-1"
            >
              {loading ? 'Ingresando…' : 'Entrar'}
            </button>
          </form>
          <p className="text-xs text-gray-400/60 dark:text-gray-600 mt-6 text-center">
            admin@library.com · admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
