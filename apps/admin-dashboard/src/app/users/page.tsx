import { requireAdmin } from '../../lib/admin-auth';
import { prisma } from '@gate-access/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';
import * as argon2 from 'argon2';

export const metadata = { title: 'Users' };

// ─── Server actions ───────────────────────────────────────────────────────────

async function resetPassword(formData: FormData) {
  'use server';
  requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return;

  const tempPassword = randomBytes(10).toString('hex'); // 20-char hex
  const passwordHash = await argon2.hash(tempPassword);

  await prisma.user.update({ where: { id }, data: { passwordHash } });

  // Flash the temp password via a short-lived cookie (httpOnly=false so we
  // can read it server-side on redirect, then immediately delete it)
  cookies().set('_pwflash', JSON.stringify({ id, pw: tempPassword }), {
    path: '/',
    maxAge: 120,
    sameSite: 'lax',
  });

  revalidatePath('/users');
  redirect('/users');
}

async function toggleSuspendUser(formData: FormData) {
  'use server';
  requireAdmin();
  const id = formData.get('id') as string;
  const current = formData.get('deletedAt') as string;
  if (!id) return;
  await prisma.user.update({
    where: { id },
    data: { deletedAt: current === 'null' ? new Date() : null },
  });
  revalidatePath('/users');
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ROLES = ['ADMIN', 'TENANT_ADMIN', 'TENANT_USER', 'VISITOR'] as const;

interface SearchParams { q?: string; role?: string; status?: string }

export default async function UsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  requireAdmin();

  const search = searchParams.q?.trim() ?? '';
  const roleFilter = searchParams.role ?? '';
  const statusFilter = searchParams.status ?? 'active';

  const users = await prisma.user.findMany({
    where: {
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(roleFilter ? { role: roleFilter as (typeof ROLES)[number] } : {}),
      ...(statusFilter === 'active'
        ? { deletedAt: null }
        : statusFilter === 'suspended'
        ? { NOT: { deletedAt: null } }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      deletedAt: true,
      createdAt: true,
      organization: { select: { id: true, name: true, plan: true } },
    },
  });

  // Read and clear the password-reset flash cookie
  let pwFlash: { id: string; pw: string } | null = null;
  try {
    const raw = cookies().get('_pwflash')?.value;
    if (raw) {
      pwFlash = JSON.parse(raw) as { id: string; pw: string };
      cookies().delete('_pwflash');
    }
  } catch {
    // ignore malformed cookie
  }

  return (
    <div className="max-w-6xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500">
            {users.length} result{users.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* ── Password reset flash ─────────────────────────────────────────────── */}
      {pwFlash && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
          <p className="font-semibold text-amber-800">Temporary password set</p>
          <p className="mt-1 text-amber-700">
            Share this securely with the user — it won&apos;t be shown again:
          </p>
          <code className="mt-2 block rounded-lg bg-amber-100 px-4 py-2.5 font-mono text-base font-bold tracking-wider text-amber-900">
            {pwFlash.pw}
          </code>
        </div>
      )}

      {/* ── Filters ──────────────────────────────────────────────────────────── */}
      <form method="GET" className="flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={search}
          placeholder="Search by name or email…"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <select
          name="role"
          defaultValue={roleFilter}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r.replace('_', ' ')}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={statusFilter}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Filter
        </button>
        <a
          href="/users"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          Clear
        </a>
      </form>

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-medium text-slate-500">
            <tr>
              <th className="px-5 py-3 text-left">User</th>
              <th className="px-5 py-3 text-left">Organization</th>
              <th className="px-5 py-3 text-left">Role</th>
              <th className="px-5 py-3 text-left">Joined</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const suspended = user.deletedAt !== null;
                const isFlash = pwFlash?.id === user.id;
                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-slate-50 ${suspended ? 'opacity-60' : ''} ${
                      isFlash ? 'bg-amber-50' : ''
                    }`}
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      {user.organization ? (
                        <div>
                          <p className="text-slate-700">{user.organization.name}</p>
                          <PlanBadge plan={user.organization.plan} />
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-xs">No org</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">
                      {user.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          suspended
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {suspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Reset password */}
                        <form action={resetPassword}>
                          <input type="hidden" name="id" value={user.id} />
                          <button
                            type="submit"
                            className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            Reset Password
                          </button>
                        </form>

                        {/* Suspend / Activate */}
                        <form action={toggleSuspendUser}>
                          <input type="hidden" name="id" value={user.id} />
                          <input
                            type="hidden"
                            name="deletedAt"
                            value={String(user.deletedAt)}
                          />
                          <button
                            type="submit"
                            className={`rounded border px-2 py-1 text-xs ${
                              suspended
                                ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                                : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                            }`}
                          >
                            {suspended ? 'Activate' : 'Suspend'}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-700',
    TENANT_ADMIN: 'bg-orange-100 text-orange-700',
    TENANT_USER: 'bg-blue-100 text-blue-700',
    VISITOR: 'bg-slate-100 text-slate-600',
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        styles[role] ?? styles.VISITOR
      }`}
    >
      {role.replace('_', ' ')}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    FREE: 'bg-slate-100 text-slate-700',
    PRO: 'bg-blue-100 text-blue-700',
    ENTERPRISE: 'bg-violet-100 text-violet-700',
  };
  return (
    <span
      className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
        styles[plan] ?? styles.FREE
      }`}
    >
      {plan}
    </span>
  );
}
