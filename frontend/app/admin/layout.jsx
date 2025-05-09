import AdminSidebar from "@/components/adminpage/AdminSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminProtectedPage from "@/components/adminpage/AdminProtectedPage";
export default function AdminLayout({ children }) {
  return (
    <AdminProtectedPage>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-4">
          <SidebarProvider>
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
        </main>
      </div>
    </AdminProtectedPage>
  );
}
