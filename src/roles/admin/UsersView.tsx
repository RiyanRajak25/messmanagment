import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { api } from '../../api/client';
import { AppUser, UserRole, Mess } from '../../types';
import { useToast } from '../../components/Toast';
import {
  Users,
  Shield,
  ShieldCheck,
  UserCheck,
  Building2,
  Mail,
  Plus,
  Search,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const UsersView: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [messes, setMesses] = useState<Mess[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [userList, messList] = await Promise.all([
          api.users.list(),
          api.messes.list(),
        ]);
        setUsers(userList);
        setMesses(messList);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const getMessName = (messId?: string | null) => {
    if (!messId) return 'Station HQ / Central Depot';
    const m = messes.find((mess) => mess.id === messId);
    return m?.name || messId;
  };

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, is_active: !u.is_active };
          toast({
            title: updated.is_active ? 'Security Clearance Restored' : 'Clearance Suspended',
            message: `${u.name} clearance status modified. Event recorded in military audit trail.`,
          });
          return updated;
        }
        return u;
      })
    );
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
        <div className="w-10 h-10 border-2 border-sand/40 border-t-gold-500 rounded-full animate-spin" />
        <span className="font-heading font-semibold text-xs text-pine/80 mt-4 uppercase tracking-wider">
          Verifying Personnel &amp; Ranks Roster...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Subheader */}
      <div className="p-6 bg-white border border-sand/30 rounded-card shadow-subtle border-l-4 border-l-gold-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-sand/20 border border-sand text-olive-deep text-[10px] font-heading font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3 h-3 text-gold-600" />
            <span>Security &amp; Access Control • Staff Appointments</span>
          </div>
          <h2 className="font-heading font-bold text-2xl text-olive-deep tracking-tight">
            Personnel Appointments &amp; Role Clearances
          </h2>
          <p className="text-xs text-pine/70 font-sans mt-0.5">
            Staff &amp; administrators appointed to Station Administration, Central Supply Depot, Dining Messes &amp; Accounts.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            toast({
              title: 'Personnel Directive Required',
              message: 'Staff assignment requires Administrative Director order.',
            })
          }
          icon={<Plus className="w-4 h-4" />}
        >
          Add Appointed Staff
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border-sand/30 bg-white">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-pine/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search personnel by name, role, or email coordinates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-mono font-medium rounded-control border border-sand bg-snow focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive text-olive-deep placeholder:text-pine/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs font-heading font-semibold rounded-control border border-sand bg-white text-olive-deep focus:outline-none focus:border-olive"
          >
            <option value="all">All Roles</option>
            <option value="administrator">Station Administration HQ</option>
            <option value="store_keeper">Central Supply Depot</option>
            <option value="mess_manager">Hostel Mess Manager</option>
            <option value="finance_staff">Central Accounts Officer</option>
            <option value="vendor">Provisions Contractor</option>
          </select>
        </div>
      </Card>

      {/* Personnel Table */}
      <div className="rounded-card border border-sand/30 bg-white shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-operational w-full text-left border-collapse">
            <thead>
              <tr className="bg-olive-deep text-sand text-[10px] font-heading font-bold uppercase tracking-wider select-none">
                <th className="py-3 px-4">Officer / Appointed Staff</th>
                <th className="py-3 px-4">System Role &amp; Department</th>
                <th className="py-3 px-4">Station Appointment / Unit</th>
                <th className="py-3 px-4">Official Email Coordinates</th>
                <th className="py-3 px-4 text-center">Clearance Status</th>
                <th className="py-3 px-4 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 text-xs font-sans text-olive-deep">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-pine/60 italic font-sans">
                    No appointed personnel match the filter query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-snow/60 transition-colors">
                    {/* User & Rank */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-control bg-olive-night text-gold font-heading font-bold flex items-center justify-center text-xs shadow-subtle border border-sand/30 shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-heading font-bold text-olive-deep text-sm">{u.name}</div>
                          <div className="font-mono text-[10px] text-pine/60 uppercase">
                            SERVICE ID: {u.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-pill bg-sand/20 border border-sand/40 text-olive-deep text-[11px] font-heading font-bold capitalize">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Unit */}
                    <td className="py-3.5 px-4">
                      <div className="font-heading font-semibold text-olive-deep">{getMessName(u.mess_id)}</div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-pine">
                      {u.email}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      {u.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold uppercase">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Authorized
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-danger/10 text-danger border border-danger/30 text-[10px] font-mono font-bold uppercase">
                          <Lock className="w-3 h-3 text-danger" /> Suspended
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u.id)}
                        className={`px-3 py-1 text-xs font-heading font-bold rounded-control border transition-all ${
                          u.is_active
                            ? 'border-sand text-pine/80 hover:bg-snow hover:text-danger hover:border-danger/40'
                            : 'border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800'
                        }`}
                      >
                        {u.is_active ? 'Revoke Access' : 'Restore Access'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersView;
