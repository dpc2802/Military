/**
 * Layout del panel de administración.
 */

import { redirect } from "next/navigation";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, type AdminSessionData } from "@/lib/session";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Panel Admin — SGB MILITARY",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getIronSession<AdminSessionData>(await cookies(), sessionOptions);
  if (!session.admin?.isLoggedIn) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <AdminSidebar username={session.admin.username} />
      <main className="flex-1 overflow-auto pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
