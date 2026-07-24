import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getBooks, createBook, updateBook, deleteBook } from '../services/books.service';
import type { Book } from '../services/books.service';
import api from '../services/api';
import Pagination from '../components/Pagination';

interface Category { id: string; name: string; }

const PAGE_SIZE = 10;
const empty: Partial<Book> = { title: '', author: '', isbn: '', description: '', quantity: 1, categoryId: '' };

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [modal, setModal] = useState<{ open: boolean; data: Partial<Book> }>({ open: false, data: empty });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = (q = search, p = page) =>
    getBooks({ ...(q && { search: q }), page: String(p), limit: String(PAGE_SIZE) }).then((r) => {
      setBooks(r.data.data);
      setTotal(r.data.total);
    });

  useEffect(() => {
    load();
    api.get<Category[]>('/categories').then((r) => setCategories(r.data));
  }, []);

  useEffect(() => { load(search, page); }, [page]);

  const openCreate = () => setModal({ open: true, data: { ...empty } });
  const openEdit = (b: Book) => setModal({ open: true, data: { ...b } });
  const closeModal = () => setModal({ open: false, data: empty });

  const handleSave = async () => {
    if (!modal.data.title || !modal.data.author) {
      toast.error('Título y autor son obligatorios');
      return;
    }
    setSaving(true);
    try {
      if (modal.data.id) {
        await updateBook(modal.data.id, modal.data);
        toast.success('Libro actualizado');
      } else {
        await createBook(modal.data);
        toast.success('Libro creado');
      }
      closeModal();
      load(search, page);
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id);
      toast.success('Libro eliminado');
      setConfirmDelete(null);
      load(search, page);
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Libros</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{total} volúmenes en catálogo</p>
        </div>
        <button onClick={openCreate} className="bg-mahogany hover:bg-mahogany-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Nuevo libro
        </button>
      </div>
      <input
        type="text"
        placeholder="Buscar por título, autor o ISBN…"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); load(e.target.value, 1); }}
        className="w-full border border-linen dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 bg-white rounded-lg px-4 py-2.5 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors"
      />
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-linen/50 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-linen dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-xs tracking-wider uppercase">Título</th>
              <th className="text-left px-5 py-3 font-semibold text-xs tracking-wider uppercase">Autor</th>
              <th className="text-left px-5 py-3 font-semibold text-xs tracking-wider uppercase">ISBN</th>
              <th className="text-left px-5 py-3 font-semibold text-xs tracking-wider uppercase">Categoría</th>
              <th className="text-right px-5 py-3 font-semibold text-xs tracking-wider uppercase">Disponibles</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-linen/50 dark:divide-gray-800">
            {books.map((b) => (
              <tr key={b.id} className="hover:bg-ivory dark:hover:bg-gray-800 transition-colors">
                <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-gray-100">{b.title}</td>
                <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">{b.author}</td>
                <td className="px-5 py-3.5 text-gray-400 dark:text-gray-500 font-mono text-xs">{b.isbn ?? '—'}</td>
                <td className="px-5 py-3.5">
                  {b.category?.name ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-linen dark:bg-gray-800 text-mahogany dark:text-gold">{b.category.name}</span>
                  ) : '—'}
                </td>
                <td className="px-5 py-3.5 text-right font-medium">
                  <span className={b.available === 0 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}>
                    {b.available}/{b.quantity}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right space-x-3">
                  <button onClick={() => openEdit(b)} className="text-mahogany hover:text-mahogany-dark dark:text-gold dark:hover:text-gold-light text-xs font-medium transition-colors">Editar</button>
                  <button onClick={() => setConfirmDelete(b.id)} className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">Eliminar</button>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400 dark:text-gray-500">
                <p className="font-display text-lg mb-1">Sin resultados</p>
                <p className="text-sm">Intenta con otro término de búsqueda</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={total} limit={PAGE_SIZE} onChange={(p) => setPage(p)} />

      {/* Modal Crear/Editar */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md border border-linen/50 dark:border-gray-800">
            <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{modal.data.id ? 'Editar libro' : 'Nuevo libro'}</h3>
            <div className="space-y-3">
              {(['title', 'author', 'isbn', 'description'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 tracking-wider uppercase">{field === 'title' ? 'Título' : field === 'author' ? 'Autor' : field === 'isbn' ? 'ISBN' : 'Descripción'}</label>
                  <input
                    value={(modal.data[field] as string) ?? ''}
                    onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, [field]: e.target.value } }))}
                    className="w-full border border-linen dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 tracking-wider uppercase">Cantidad</label>
                <input
                  type="number"
                  min={1}
                  value={modal.data.quantity ?? 1}
                  onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, quantity: parseInt(e.target.value) } }))}
                  className="w-full border border-linen dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 tracking-wider uppercase">Categoría</label>
                <select
                  value={modal.data.categoryId ?? ''}
                  onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, categoryId: e.target.value || undefined } }))}
                  className="w-full border border-linen dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors"
                >
                  <option value="">Sin categoría</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={closeModal} className="px-4 py-2 text-sm rounded-lg border border-linen dark:border-gray-700 hover:bg-linen/50 dark:hover:bg-gray-800 dark:text-gray-300 transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-mahogany hover:bg-mahogany-dark text-white disabled:opacity-50 transition-colors font-medium">
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-80 shadow-xl border border-linen/50 dark:border-gray-800">
            <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">¿Eliminar libro?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm border border-linen dark:border-gray-700 rounded-lg hover:bg-linen/50 dark:hover:bg-gray-800 dark:text-gray-300 transition-colors">Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
