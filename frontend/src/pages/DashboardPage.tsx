import { useEffect, useState } from 'react';
import api from '../services/api';

interface Stats {
  books: number;
  articles: number;
  activeLoans: number;
  users: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<Stats>({ books: 0, articles: 0, activeLoans: 0, users: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/books?limit=1'),
      api.get('/articles?limit=1'),
      api.get('/loans?status=ACTIVE&limit=1'),
    ])
      .then(([b, a, l]) => {
        setStats({
          books: b.data.total,
          articles: a.data.total,
          activeLoans: l.data.total,
          users: 0,
        });
      })
      .catch(() => {});
  }, []);

  const statTotal = stats.books + stats.articles + stats.activeLoans;

  return (
    <div className="min-h-screen bg-ivory dark:bg-gray-950">
      {/* Borde superior — acento de encuadernación */}
      <div className="h-0.5 bg-gradient-to-r from-mahogany-dark via-gold to-mahogany-dark opacity-70" />

      <div className="px-8 lg:px-12 py-10">
        {/* Cabecera */}
        <div className="mb-12">
          <p className="text-mahogany dark:text-gold text-xs font-semibold tracking-widest uppercase mb-2">
            Resumen de tu colección
          </p>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Tu Biblioteca
          </h1>
        </div>

        {/* Héroe — total de recursos */}
        <div className="bg-espresso dark:bg-gray-900 rounded-2xl p-8 sm:p-10 mb-10 border border-gold/10">
          <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-3">
            Total de recursos
          </p>
          <div className="flex items-baseline gap-4">
            <span className="font-display text-6xl sm:text-7xl font-bold text-white">
              {statTotal.toLocaleString()}
            </span>
            <span className="text-lg text-parchment/60 font-light">
              disponibles en el sistema
            </span>
          </div>
          <div className="mt-6 h-0.5 w-16 bg-gradient-to-r from-gold to-mahogany" />
        </div>

        {/* Grid de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Libros */}
          <div className="group bg-white dark:bg-gray-900 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-mahogany">
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  Libros
                </p>
                <p className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                  {stats.books.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-linen dark:bg-gray-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-mahogany dark:text-gold">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Volúmenes catalogados en tu colección
            </p>
          </div>

          {/* Artículos */}
          <div className="group bg-white dark:bg-gray-900 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-gold">
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  Artículos
                </p>
                <p className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                  {stats.articles.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-linen dark:bg-gray-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-mahogany dark:text-gold">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Referencias y documentación registrada
            </p>
          </div>

          {/* Préstamos activos */}
          <div className="group bg-white dark:bg-gray-900 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-parchment">
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  Préstamos activos
                </p>
                <p className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                  {stats.activeLoans.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-linen dark:bg-gray-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-mahogany dark:text-gold">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Recursos circulando en este momento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
