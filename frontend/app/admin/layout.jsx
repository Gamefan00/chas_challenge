import AdminSidebar from "@/components/shared/AdminSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminProtectedPage from "@/components/admin/AdminProtectedPage";
export default function AdminLayout({ children }) {
  return (
    <AdminProtectedPage>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1">
          <SidebarProvider>
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
        </main>
      </div>
    </AdminProtectedPage>
  );
}
