import { Menu, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

// Data for the links in the Navbar. Add, remove or change links here
const linksData = [
  { title: "Hem", href: "/" },
  { title: "Om tjänsten", href: "/" },
  { title: "Vanliga frågor", href: "/" },
  { title: "Kontakt", href: "/" },
];

const Navbar = () => {
  return (
    <div className="navbar relative z-50 justify-between px-4 shadow-md">
      {/* Logo and site name  */}
      <div className="items-center">
        <Link href="/" className="flex items-center">
          <Plus className="text-background bg-primary mr-2 rounded-md" />
          <h3 className="text-primary">Ansökshjälpen</h3>
        </Link>
      </div>

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
      <div className="dropdown dropdown-end block md:hidden">
        <button className="btn m-1" aria-haspopup="true" aria-label="Open menu">
          <Menu />
        </button>
        <ul className="dropdown-content menu bg-base-100 rounded-box z-1 mt-2 w-52 p-2 shadow-sm">
          {linksData.map((link, index) => (
            <li key={index}>
              <Link href={link.href}>{link.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
