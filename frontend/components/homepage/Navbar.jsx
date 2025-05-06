"use client";
import { Menu, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetTrigger } from "../ui/sheet";
import Logo from "../shared/Logo";

// Data for the links in the Navbar. Add, remove or change links here
const linksData = [
  { title: "Hem", href: "/" },
  { title: "Om tjänsten", href: "/" },
  { title: "Vanliga frågor", href: "/" },
  { title: "Kontakt", href: "/" },
];

const Navbar = () => {
  return (
    <nav className="relative z-50 flex h-16 items-center justify-between px-4 shadow-sm">
      <Logo />

      {/* Desktop Navbar */}
      <ul className="hidden items-center gap-6 md:flex">
        {linksData.map((link, index) => (
          <li key={index}>
            <Link className="hover:underline" href={link.href}>
              {link.title}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Navbar in hamburger menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="mt-5 flex flex-col items-start gap-4">
              {linksData.map((link, index) => (
                <Button key={index} variant={"link"} asChild>
                  <a href={link.href}>{link.title}</a>
                </Button>
              ))}
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant={"outline"}>Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
