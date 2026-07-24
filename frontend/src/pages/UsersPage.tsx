import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getUsers, updateUser, deleteUser } from '../services/users.service';
import type { User } from '../services/users.service';
import { register } from '../services/auth.service';
import Pagination from '../components/Pagination';

const ROLES = ['ADMIN', 'LIBRARIAN', 'READER'] as const;
const PAGE_SIZE = 10;
const roleColor: Record<string, string> = {
  ADMIN: 'bg-mahogany/10 text-mahogany dark:bg-gold/10 dark:text-gold',
  LIBRARIAN: 'bg-gold/20 text-mahogany-dark dark:bg-gold/10 dark:text-gold',
  READER: 'bg-linen text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Partial<User & { password: string }> | null>(null);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'READER' });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = (q = search, p = page) =>
    getUsers({ ...(q && { search: q }), page: String(p), limit: String(PAGE_SIZE) }).then((r) => {
      setUsers(r.data.data);
      setTotal(r.data.total);
    });

  useEffect(() => { load(); }, []);
  useEffect(() => { load(search, page); }, [page]);

  const handleSave = async () => {
    if (!editing?.id) return;
    setSaving(true);
    try {
      await updateUser(editing.id, editing);
      toast.success('Usuario actualizado');
      setEditing(null);
      load(search, page);
    } catch {
      toast.error('Error al actualizar');
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Nombre, email y contraseña son obligatorios');
      return;
    }
    setSaving(true);
    try {
      await register(newUser);
      toast.success('Usuario creado');
      setCreating(false);
      setNewUser({ name: '', email: '', password: '', role: 'READER' });
      load(search, 1);
      setPage(1);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Error al crear usuario');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      toast.success('Usuario eliminado');
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
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Usuarios</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{total} miembros registrados</p>
        </div>
        <button onClick={() => setCreating(true)} className="bg-mahogany hover:bg-mahogany-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Nuevo usuario
        </button>
      </div>
      <input
        type="text"
        placeholder="Buscar por nombre o email…"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); load(e.target.value, 1); }}
        className="w-full border border-linen dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 bg-white rounded-lg px-4 py-2.5 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors"
      />
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-linen/50 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-linen dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-xs tracking-wider uppercase">Nombre</th>
              <th className="text-left px-5 py-3 font-semibold text-xs tracking-wider uppercase">Email</th>
              <th className="text-left px-5 py-3 font-semibold text-xs tracking-wider uppercase">Rol</th>
              <th className="text-left px-5 py-3 font-semibold text-xs tracking-wider uppercase">Creado</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-linen/50 dark:divide-gray-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-ivory dark:hover:bg-gray-800 transition-colors">
                <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-gray-100">{u.name}</td>
                <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{u.email}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColor[u.role]}`}>{u.role}</span>
                </td>
                <td className="px-5 py-3.5 text-gray-400 dark:text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3.5 text-right space-x-3">
                  <button onClick={() => setEditing({ ...u })} className="text-mahogany hover:text-mahogany-dark dark:text-gold dark:hover:text-gold-light text-xs font-medium transition-colors">Editar</button>
                  <button onClick={() => setConfirmDelete(u.id)} className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors">Eliminar</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400 dark:text-gray-500">
                <p className="font-display text-lg mb-1">Sin usuarios</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={total} limit={PAGE_SIZE} onChange={(p) => setPage(p)} />

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm border border-linen/50 dark:border-gray-800">
            <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Editar usuario</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 tracking-wider uppercase">Nombre</label>
                <input value={editing.name ?? ''} onChange={(e) => setEditing((p) => ({ ...p!, name: e.target.value }))}
                  className="w-full border border-linen dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 tracking-wider uppercase">Email</label>
                <input value={editing.email ?? ''} onChange={(e) => setEditing((p) => ({ ...p!, email: e.target.value }))}
                  className="w-full border border-linen dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 tracking-wider uppercase">Rol</label>
                <select value={editing.role ?? 'READER'} onChange={(e) => setEditing((p) => ({ ...p!, role: e.target.value as User['role'] }))}
                  className="w-full border border-linen dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors">
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 tracking-wider uppercase">Nueva contraseña (opcional)</label>
                <input type="password" value={editing.password ?? ''} onChange={(e) => setEditing((p) => ({ ...p!, password: e.target.value }))}
                  className="w-full border border-linen dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm border border-linen dark:border-gray-700 rounded-lg hover:bg-linen/50 dark:hover:bg-gray-800 dark:text-gray-300 transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm bg-mahogany hover:bg-mahogany-dark text-white rounded-lg disabled:opacity-50 transition-colors font-medium">
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-80 shadow-xl border border-linen/50 dark:border-gray-800">
            <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">¿Eliminar usuario?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm border border-linen dark:border-gray-700 rounded-lg hover:bg-linen/50 dark:hover:bg-gray-800 dark:text-gray-300 transition-colors">Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {creating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm border border-linen/50 dark:border-gray-800">
            <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Nuevo usuario</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 tracking-wider uppercase">Nombre</label>
                <input value={newUser.name} onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border border-linen dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 tracking-wider uppercase">Email</label>
                <input type="email" value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))}
                  className="w-full border border-linen dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 tracking-wider uppercase">Contraseña</label>
                <input type="password" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))}
                  className="w-full border border-linen dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 tracking-wider uppercase">Rol</label>
                <select value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))}
                  className="w-full border border-linen dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition-colors">
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => { setCreating(false); setNewUser({ name: '', email: '', password: '', role: 'READER' }); }}
                className="px-4 py-2 text-sm border border-linen dark:border-gray-700 rounded-lg hover:bg-linen/50 dark:hover:bg-gray-800 dark:text-gray-300 transition-colors">Cancelar</button>
              <button onClick={handleCreate} disabled={saving}
                className="px-4 py-2 text-sm bg-mahogany hover:bg-mahogany-dark text-white rounded-lg disabled:opacity-50 transition-colors font-medium">
                {saving ? 'Creando…' : 'Crear usuario'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
