"use client";

import { useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import {
  Users,
  Plus,
  Trash2,
  Loader2,
  Mail,
  Shield,
  Calendar,
  AlertCircle,
  UserRoundCog,
  UserRound,
  ShieldCogCorner,
} from "lucide-react";
import Image from "next/image";
import { AdminUser } from "@/db/schema";
import { apiRequest, cn } from "@/lib/utils";
import { useUI } from "@/context";
import DeleteModal from "@/components/shared/DeletModal";
import { Loader } from "@/components/shared/Loader";
import useCopy from "@/hooks/useCopy";

export default function AdminManagementPage() {
  const { addToast } = useUI();
  const { data, mutate, isLoading } = useSWR<{ admins: AdminUser[] }>(
    "/api/admin",
    apiRequest,
  );

  // Demote/Delete Confirmation Modal State
  const [demotingAdmin, setDemotingAdmin] = useState<AdminUser | null>(null);
  const [isDemoting, setIsDemoting] = useState(false);

  const adminsList = [...(data?.admins || [])].sort(
    (a, b) => Number(b.isSuperAdmin) - Number(a.isSuperAdmin),
  );

  const handleDemote = async () => {
    if (!demotingAdmin) return;
    setIsDemoting(true);

    try {
      await apiRequest("/api/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demotingAdmin.email }),
      });
      await mutate();

      addToast("Admin demoted successfully", "success");
      setDemotingAdmin(null);
    } catch (err: any) {
      const msg =
        err instanceof Error ? err.message : "Failed to demote administrator";
      addToast(msg, "error");
    } finally {
      setIsDemoting(false);
    }
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="font-display flex items-center gap-2 text-3xl font-extrabold tracking-tight text-zinc-900">
          <Users className="text-accent size-6" />
          Manage Administrators
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Grant administrative access to users or revoke permissions.
        </p>
      </header>

      {/* Main Grid: Promote User Panel & Admins List Table */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Promotion Box */}
        <PromoteToAdmin
          onPromote={async () => {
            await mutate();
          }}
        />

        {/* Admins Table/Grid */}
        <section className="space-y-4 lg:col-span-2">
          <main className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs">
            <h3 className="font-display border-b border-zinc-200 bg-zinc-50/50 px-5 py-4 text-sm font-bold text-zinc-900">
              Active Administrators
            </h3>

            <>
              {isLoading ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3">
                  <Loader length={12} />
                  <span className="text-xs font-medium text-zinc-500">
                    Loading administrators...
                  </span>
                </div>
              ) : adminsList.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center bg-white px-5 py-8 text-center">
                  <AlertCircle className="text-accent mb-3 size-10" />
                  <h3 className="text-sm font-bold text-zinc-800">
                    No administrators found
                  </h3>
                </div>
              ) : (
                <main className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50/20 text-[10px] font-bold tracking-wider text-zinc-400 uppercase [&_th]:px-5 [&_th]:py-3">
                        <th>Administrator</th>
                        <th>Role</th>
                        <th>Joined Date</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {adminsList.map((adm, index) => (
                        <AdminRow
                          key={index}
                          adm={adm}
                          onDemote={(adm) => setDemotingAdmin(adm)}
                        />
                      ))}
                    </tbody>
                  </table>
                </main>
              )}
            </>
          </main>
        </section>
      </div>

      {/* Demote Confirmation Modal */}
      <DeleteModal
        Icon={AlertCircle}
        modalTitle="Revoke Admin Access"
        excerpt={
          demotingAdmin ? (
            <>
              Are you sure you want to demote &ldquo;
              <span className="font-semibold text-zinc-800">
                {demotingAdmin?.name || demotingAdmin?.email}
              </span>
              &rdquo;? They will lose access to all administrative interfaces
              instantly.
            </>
          ) : null
        }
        cta="Revoke Permanently"
        onCancel={() => setDemotingAdmin(null)}
        onDelete={handleDemote}
        isDeleting={isDemoting}
      />
    </section>
  );
}

const AdminRow = ({
  adm,
  onDemote,
}: {
  adm: AdminUser;
  onDemote: (admin: AdminUser) => void;
}) => {
  const { data: session } = useSession();
  const { copied, copy } = useCopy();
  const isSelf = session?.user.email === adm.email;

  const getDemoteDisableState = () => {
    if (isSelf) return { title: "Cannot demote yourself", disabled: true };
    if (!session?.user.isSuperAdmin)
      return {
        title: "You don't have permission to perform this action",
        disabled: true,
      };
    return { title: "Demote Admin", disabled: false };
  };

  return (
    <tr
      key={adm.id}
      className="transition-300 group hover:bg-zinc-50/50 [&_td]:px-5 [&_td]:py-4"
    >
      <td>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "group-hover:border-accent transition-300 relative flex size-9 shrink-0 items-center justify-center overflow-clip rounded-full border border-zinc-200 text-xs font-bold text-zinc-600 uppercase",
              { "bg-zinc-100": !adm.image },
            )}
          >
            {adm.image ? (
              <Image
                src={adm.image}
                alt={adm.name || "Admin"}
                fill
                sizes="100%"
                className="bject-cover object-center"
              />
            ) : adm.name ? (
              adm.name[0]
            ) : (
              <UserRound />
            )}
          </span>

          <div>
            <span className="block font-bold text-zinc-900">
              {adm.name || "Anonymous User"}
              {isSelf && (
                <span className="ml-1.5 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[9px] font-normal text-zinc-500 uppercase">
                  You
                </span>
              )}
            </span>
            <span
              onClick={() => copy(adm.email || "", 1000)}
              className={cn(
                "transition-300 mt-px block cursor-pointer text-[11px] text-zinc-400 underline-offset-2 hover:underline",
                { "text-green-600": copied },
              )}
            >
              {adm.email}
            </span>
          </div>
        </div>
      </td>
      <td>
        <span className="[&_svg]:text-accent inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.75 text-[10px] font-semibold text-zinc-500 uppercase [&_svg]:size-3.5">
          {adm.isSuperAdmin ? <ShieldCogCorner /> : <Shield />}
          Admin
        </span>
      </td>
      <td>
        <div className="flex items-center gap-1.5 text-zinc-500">
          <Calendar className="size-3.5 text-zinc-400" />
          {new Date(adm.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </td>
      <td className="text-right">
        <button
          disabled={getDemoteDisableState().disabled}
          onClick={() => onDemote(adm)}
          className="transition-300 cursor-pointer rounded-lg p-2 text-zinc-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
          title={getDemoteDisableState().title}
        >
          <Trash2 className="size-4" />
        </button>
      </td>
    </tr>
  );
};

const PromoteToAdmin = ({ onPromote }: { onPromote: () => Promise<void> }) => {
  const [emailInput, setEmailInput] = useState<string>("");
  const [isPromoting, setIsPromoting] = useState<boolean>(false);

  const [toast, setToast] = useState<{
    msg: string;
    type: "error" | "success";
  } | null>(null);

  const handlePromote = async () => {
    if (toast) setToast(null);
    if (!emailInput.trim()) return;

    setIsPromoting(true);
    try {
      await apiRequest<{ success: boolean }>("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.trim() }),
      });

      await onPromote();
      setEmailInput("");
      setToast({ msg: "Admin promoted successfully!", type: "success" });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : `Failed to promote admin`;
      setToast({ msg, type: "error" });
    } finally {
      setIsPromoting(false);
      setTimeout(() => {
        setToast(null);
      }, 60000);
    }
  };

  return (
    <section className="space-y-4 lg:col-span-1">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <h3 className="font-display mb-1 flex items-center gap-1.5 text-sm font-bold text-zinc-900">
          <UserRoundCog className="text-accent mt-px size-5" />
          Promote to Admin
        </h3>
        <p className="mb-4.5 text-xs text-zinc-500">
          Enter the registered email of the user you want to grant admin access.
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handlePromote();
          }}
          className="space-y-3.5"
        >
          <div>
            <label
              htmlFor="admin-email"
              className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
            >
              User Email Address
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                id="admin-email"
                required
                placeholder="name@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pr-4 pl-10 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                disabled={isPromoting}
              />
            </div>
          </div>

          {toast && (
            <p
              className={cn(
                "rounded-xl border px-3 py-2.5 text-xs font-medium",
                {
                  "border-red-200 bg-red-50 text-red-700":
                    toast.type === "error",
                  "border-green-200 bg-green-50 text-green-700":
                    toast.type === "success",
                },
              )}
            >
              {toast.msg}
            </p>
          )}

          <button
            type="submit"
            disabled={isPromoting}
            className="bg-accent hover:bg-accent/90 transition-300 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-md active:scale-95 disabled:opacity-50"
          >
            {isPromoting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Plus className="size-4" />
                Promote User
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};
