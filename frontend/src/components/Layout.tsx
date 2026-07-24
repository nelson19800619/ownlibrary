import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Toaster } from 'react-hot-toast';

const NAV_ITEMS = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    to: '/books',
    label: 'Libros',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
      </svg>
    ),
  },
  {
    to: '/articles',
    label: 'Artículos',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    to: '/loans',
    label: 'Préstamos',
    roles: ['ADMIN', 'LIBRARIAN'],
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
      </svg>
    ),
  },
  {
    to: '/users',
    label: 'Usuarios',
    roles: ['ADMIN'],
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    ),
  },
];

const roleLabel: Record<string, string> = {
  ADMIN: 'Administrador',
  LIBRARIAN: 'Bibliotecario',
  READER: 'Lector',
};

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '?';

  return (
    <div className="flex h-screen bg-ivory dark:bg-gray-950 transition-colors">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#1f2937' : '#fff',
            color: theme === 'dark' ? '#f3f4f6' : '#1c1410',
            borderLeft: '3px solid #d4a96a',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
          },
        }}
      />

      {/* Sidebar — espresso oscuro, como estanterías de biblioteca */}
      <aside className="w-56 flex-shrink-0 flex flex-col bg-espresso dark:bg-gray-900 transition-colors">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <h1 className="font-display text-xl font-bold text-gold leading-snug tracking-tight">
            OwnLibrary
          </h1>
          <p className="text-[10px] text-parchment/50 mt-0.5 tracking-widest uppercase">
            Gestión de fondos
          </p>
        </div>

        {/* Nav — pestañas de catálogo */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user?.role ?? '')).map(
            (item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-gold border-l-2 border-gold'
                      : 'text-parchment/60 border-l-2 border-transparent hover:bg-white/5 hover:text-parchment'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            )
          )}
        </nav>

        {/* Sección de usuario */}
        <div className="p-3 border-t border-white/10">
          <div className="rounded-xl p-3 bg-white/5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-espresso bg-gold flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-parchment truncate leading-tight">{user?.name}</p>
                <p className="text-[10px] text-parchment/45 mt-0.5">{roleLabel[user?.role ?? ''] ?? user?.role}</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={toggle}
                title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium text-parchment/50 hover:text-gold hover:bg-white/10 transition-colors"
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 7.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.005 9.005 0 0012 21a9.005 9.005 0 008.354-5.646z" />
                  </svg>
                )}
                Tema
              </button>
              <button
                onClick={() => setConfirmLogout(true)}
                title="Cerrar sesión"
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium text-parchment/50 hover:text-red-400 hover:bg-red-900/20 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                Salir
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Área de contenido principal */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* Modal de confirmación de logout */}
      {confirmLogout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-80 border border-linen dark:border-gray-800">
            <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Cerrar sesión</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">¿Estás seguro que deseas salir del sistema?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 px-4 py-2 text-sm font-medium border border-linen dark:border-gray-700 rounded-lg hover:bg-linen/50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={logout}
                className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
