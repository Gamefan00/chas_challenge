import "../globals.css";
import Footer from "../../components/shared/Footer";
import Navbar from "../../components/homepage/Navbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import UserIdInitializer from "@/components/UserIdInitializer";
import CookieConsent from "@/components/shared/CookieConsent";

export const metadata = {
  title: "Ansökshjälpen",
  description: "En aitjänst för att förenkla ansökningsprocessen",
};

export default function RootLayout({ children }) {
  return (
    <div className="pt-16">
      <UserIdInitializer />
      <Navbar position={"fixed"} />
      <SidebarProvider>
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
      <CookieConsent />
      <Footer />
    </div>
  );
}
