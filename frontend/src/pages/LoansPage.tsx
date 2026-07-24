import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getLoans, createLoan, returnLoan } from '../services/loans.service';
import type { Loan } from '../services/loans.service';
import { getBooks } from '../services/books.service';
import type { Book } from '../services/books.service';
import { getUsers } from '../services/users.service';
import type { User } from '../services/users.service';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 10;

const LoansPage = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ bookId: '', dueDate: '', userId: '' });
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ACTIVE');

  const load = (status = statusFilter, p = page) =>
    getLoans({ status, page: String(p), limit: String(PAGE_SIZE) }).then((r) => {
      setLoans(r.data.data);
      setTotal(r.data.total);
    });

  useEffect(() => {
    load();
    getBooks({ limit: '100' }).then((r) => setBooks(r.data.data));
    if (user?.role === 'ADMIN') getUsers({ limit: '100' }).then((r) => setUsers(r.data.data));
  }, []);
  useEffect(() => { load(statusFilter, page); }, [page]);

  const handleCreate = async () => {
    if (!form.bookId || !form.dueDate) {
      toast.error('Libro y fecha de devolución son obligatorios');
      return;
    }
    setSaving(true);
    try {
      await createLoan({ bookId: form.bookId, dueDate: form.dueDate, ...(form.userId && { userId: form.userId }) });
      toast.success('Préstamo registrado');
      setModal(false);
      setForm({ bookId: '', dueDate: '', userId: '' });
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Error al crear préstamo');
    } finally {
      setSaving(false);
    }
  };

  const handleReturn = async (id: string) => {
    try {
      await returnLoan(id);
      toast.success('Devolución registrada');
      load();
    } catch {
      toast.error('Error al registrar devolución');
    }
  };

  const statusColor: Record<string, string> = {
    ACTIVE: 'bg-mahogany/10 text-mahogany dark:bg-gold/10 dark:text-gold',
    RETURNED: 'bg-linen text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    OVERDUE: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  };

  const statusLabel: Record<string, string> = {
    ACTIVE: 'Activo',
    RETURNED: 'Devuelto',
    OVERDUE: 'Vencido',
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Préstamos</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{total} registros</p>
        </div>
        <button onClick={() => setModal(true)} className="bg-mahogany hover:bg-mahogany-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Nuevo préstamo
        </button>
      </div>
      <div className="flex gap-2 mb-5">
        {(['ACTIVE', 'RETURNED', 'OVERDUE'] as const).map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); load(s, 1); }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              statusFilter === s ? statusColor[s] : 'bg-linen/60 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-linen dark:hover:bg-gray-700'
            }`}
          >
            {statusLabel[s]}
          </button>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-linen/50 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-linen dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-xs tracking-wider uppercase">Libro</th>
              <th className="text-left px-5 py-3 font-semibold text-xs tracking-wider uppercase">Usuario</th>
              <th className="text-left px-5 py-3 font-semibold text-xs tracking-wider uppercase">Prestado</th>
              <th className="text-left px-5 py-3 font-semibold text-xs tracking-wider uppercase">Vencimiento</th>
              <th className="text-left px-5 py-3 font-semibold text-xs tracking-wider uppercase">Estado</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-linen/50 dark:divide-gray-800">
            {loans.map((l) => (
              <tr key={l.id} className="hover:bg-ivory dark:hover:bg-gray-800 transition-colors">
                <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-gray-100">{l.book?.title}</td>
                <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{l.user?.name}</td>
                <td className="px-5 py-3.5 text-gray-400 dark:text-gray-500">{new Date(l.loanedAt).toLocaleDateString()}</td>
                <td className="px-5 py-3.5 text-gray-400 dark:text-gray-500">{new Date(l.dueDate).toLocaleDateString()}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[l.status]}`}>{statusLabel[l.status]}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  {l.status === 'ACTIVE' && (
                    <button onClick={() => handleReturn(l.id)} className="text-mahogany hover:text-mahogany-dark dark:text-gold dark:hover:text-gold-light text-xs font-medium transition-colors">
                      Registrar devolución
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {loans.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400 dark:text-gray-500">
                <p className="font-display text-lg mb-1">Sin préstamos</p>
                <p className="text-sm">No hay registros para este estado</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={total} limit={PAGE_SIZE} onChange={(p) => setPage(p)} />

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm border border-linen/50 dark:border-gray-800">
            <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Nuevo préstamo</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 tracking-wider uppercase">Libro</label>
                <select
                  value={form.bookId}
                  onChange={(e) => setForm((f) => ({ ...f, bookId: e.target.value }))}
                  className="w-full border border-linen dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors"
                >
                  <option value="">Seleccionar libro…</option>
                  {books.filter((b) => b.available > 0).map((b) => (
                    <option key={b.id} value={b.id}>{b.title} (disponibles: {b.available})</option>
                  ))}
                </select>
              </div>
              {user?.role === 'ADMIN' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 tracking-wider uppercase">Usuario</label>
                  <select
                    value={form.userId}
                    onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}
                    className="w-full border border-linen dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors"
                  >
                    <option value="">Propio usuario</option>
                    {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 tracking-wider uppercase">Fecha de devolución</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                  className="w-full border border-linen dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setModal(false)} className="px-4 py-2 text-sm border border-linen dark:border-gray-700 rounded-lg hover:bg-linen/50 dark:hover:bg-gray-800 dark:text-gray-300 transition-colors">Cancelar</button>
              <button onClick={handleCreate} disabled={saving} className="px-4 py-2 text-sm bg-mahogany hover:bg-mahogany-dark text-white rounded-lg disabled:opacity-50 transition-colors font-medium">
                {saving ? 'Guardando…' : 'Registrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansPage;
