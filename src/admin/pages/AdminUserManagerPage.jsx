import React from 'react';
import userData from '../../data/users.json';
import roleData from '../../data/roles.json';
import logData from '../../data/activity-logs.json';
import { UserCheck, ShieldCheck, History } from 'lucide-react';

export default function AdminUserManagerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif font-bold text-2xl text-slate-900">Users, Roles & Activity Audit</h1>
        <p className="text-xs text-slate-500">Role-based access control and system activity logs.</p>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b font-bold text-sm text-slate-900">Active CMS Administrators</div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[10px]">
              <th className="p-4">User Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {userData.map((u) => (
              <tr key={u.id}>
                <td className="p-4 font-bold text-slate-900">{u.name}</td>
                <td className="p-4 text-slate-600 font-mono">{u.email}</td>
                <td className="p-4"><span className="bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded text-[10px]">{u.role}</span></td>
                <td className="p-4 text-emerald-600 font-bold">{u.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
