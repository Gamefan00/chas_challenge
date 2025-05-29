"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetTitle,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "../ui/sheet";
import Logo from "../shared/Logo";

// Data for the links in the Navbar. Add, remove or change links here
const linksData = [
  { title: "Hem", href: "/" },
  { title: "Om tjänsten", href: "/information" },
  { title: "Vanliga frågor", href: "/#vanligaFrågor" },
  { title: "Kontakt", href: "/#footer" },
];

const Navbar = ({ position }) => {
  return (
    <nav
      className={`bg-background ${position} top-0 z-50 flex h-16 w-full items-center justify-between px-4 shadow-sm`}
    >
      <h1 className="sr-only">Ansökshjälpen</h1>
      <Logo />

      {/* Desktop Navbar */}
      <ul className="hidden items-center gap-6 md:flex">
        {linksData.map((link, index) => (
          <li key={index}>
            <Link className="px-2 !py-3.5 font-medium hover:underline" href={link.href}>
              {link.title}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Navbar in hamburger menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button aria-label="Open" variant="outline">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="sr-only">Menu</SheetTitle>

            <div className="mt-5 flex flex-col items-start gap-4">
              {linksData.map((link, index) => (
                <Button key={index} variant={"link"} asChild>
                  <a href={link.href}>{link.title}</a>
                </Button>
              ))}
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant={"outline"}>Stäng </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
