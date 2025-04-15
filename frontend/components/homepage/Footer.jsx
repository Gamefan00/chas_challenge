"use client";

import { motion } from "framer-motion";

const Footer = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-footer w-full px-4 text-primary-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-10 py-10 sm:flex-row">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start gap-2"
        >
          <h2>Ansökshjälpen</h2>
          <div className="bg-primary h-[2px] w-[45px]" />
          <div className="flex flex-col gap-4 opacity-90">
            <a href="">Om oss</a>
            <a href="">Tillgänglighetsredogörelse</a>
            <a href="">Användervillkor</a>
            <a href="">Integritespolicy</a>
          </div>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-start gap-2"
        >
          <h2>Resurser</h2>
          <div className="bg-primary h-[2px] w-[45px]" />
          <div className="flex flex-col gap-4 opacity-90">
            <a href="">Lagar & regler</a>
            <a href="">Försäkringskassan</a>
            <a href="">Funktionsrättsorganisationer</a>
            <a href="">Vanliga hjälpmedel</a>
          </div>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-start gap-2"
        >
          <h2>Kontakt</h2>
          <div className="bg-primary h-[2px] w-[45px]" />
          <div className="flex flex-col gap-4 opacity-90">
            <a href="">inte@ansokningshalpen.se</a>
            <a href="">070-123 45 67</a>
            <a href="">Kontaktformulär</a>
            <a href="">Feedback</a>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="w-full opacity-20"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="flex justify-center p-4"
      >
        <small>© 2025 Ansökshjälpen. Alla rättigheter förbehållna</small>
      </motion.div>
    </footer>
  );
};

export default Footer;
