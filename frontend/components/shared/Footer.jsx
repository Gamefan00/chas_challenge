"use client";

import { motion } from "framer-motion";
import { Linkedin, Facebook, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  // Don't show footer on chatbot pages
  if (pathname.includes("/applicationChat") || pathname.includes("/interviewChat")) {
    return null;
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <footer className="bg-footer text-primary-foreground w-full px-4 py-8">
      <motion.div
        className="mx-auto w-full max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main footer content */}
        <div className="grid grid-cols-1 justify-between gap-8 sm:grid-cols-2 lg:flex lg:justify-between">
          {/* Company Info */}
          <motion.div variants={sectionVariants} className="flex flex-col items-start gap-3">
            <h2 className="text-lg font-semibold">Ansökshjälpen</h2>
            <div className="bg-primary h-[2px] w-[45px]" />
            <div className="flex flex-col gap-3 opacity-90">
              <Link href="/om-oss" className="hover:text-primary transition-colors">
                Om oss
              </Link>
              <Link href="/tillganglighet" className="hover:text-primary transition-colors">
                Tillgänglighetsredogörelse
              </Link>
              <Link href="/anvandarvillkor" className="hover:text-primary transition-colors">
                Användervillkor
              </Link>
              <Link href="/integrity" className="hover:text-primary transition-colors">
                Integritetspolicy
              </Link>
              <Link href="/cookies" className="hover:text-primary transition-colors">
                Cookie-inställningar
              </Link>
            </div>
          </motion.div>

          {/* Resources */}
          <motion.div variants={sectionVariants} className="flex flex-col items-start gap-3">
            <h2 className="text-lg font-semibold">Resurser</h2>
            <div className="bg-primary h-[2px] w-[45px]" />
            <div className="flex flex-col gap-3 opacity-90">
              <Link href="/lagar-regler" className="hover:text-primary transition-colors">
                Lagar & regler
              </Link>
              <a
                href="https://www.forsakringskassan.se"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Försäkringskassan
              </a>
              <Link href="/organisationer" className="hover:text-primary transition-colors">
                Funktionsrättsorganisationer
              </Link>
              <Link href="/hjalpmedel" className="hover:text-primary transition-colors">
                Vanliga hjälpmedel
              </Link>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div variants={sectionVariants} className="flex flex-col items-start gap-3">
            <h2 className="text-lg font-semibold">Kontakt</h2>
            <div className="bg-primary h-[2px] w-[45px]" />
            <div className="flex flex-col gap-3 opacity-90">
              <a
                href="mailto:info@ansokshalpen.se"
                className="hover:text-primary flex items-center gap-2 transition-colors"
              >
                <Mail size={16} />
                <span>info@ansokshalpen.se</span>
              </a>
              <a
                href="tel:+46701234567"
                className="hover:text-primary flex items-center gap-2 transition-colors"
              >
                <Phone size={16} />
                <span>070-123 45 67</span>
              </a>
              <Link href="/kontakt" className="hover:text-primary transition-colors">
                Kontaktformulär
              </Link>
              <Link href="/feedback" className="hover:text-primary transition-colors">
                Feedback
              </Link>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div variants={sectionVariants} className="flex flex-col items-start gap-3">
            <h2 className="text-lg font-semibold">Sociala Medier</h2>
            <div className="bg-primary h-[2px] w-[45px]" />
            <div className="flex flex-col gap-3 opacity-90">
              <div className="mt-2 flex gap-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-opacity-20 bg-primary rounded-full p-2 transition-colors hover:opacity-90"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-opacity-20 bg-primary rounded-full p-2 transition-colors hover:opacity-90"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          variants={sectionVariants}
          className="bg-muted-foreground/40 my-6 h-px w-full opacity-20"
        />

        {/* Copyright */}
        <motion.div variants={sectionVariants} className="text-center">
          <small className="text-muted-foreground sm:text-left">
            © 2025 Ansökshjälpen. Alla rättigheter förbehållna
          </small>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
