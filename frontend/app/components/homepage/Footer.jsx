import React from "react";

const Footer = () => {
  return (
    <footer className="bg-footer text-background w-full">
      <div className="flex flex-col justify-around gap-10 p-10 sm:flex-row">
        <div className="flex flex-col items-start gap-2">
          <h2>Ansökshjälpen</h2>
          <div className="bg-primary h-[2px] w-[45px]" />
          <div className="flex flex-col gap-4 opacity-90">
            <a href="">Om oss</a>
            <a href="">Tillgänglighetsredogörelse</a>
            <a href="">Användervillkor</a>
            <a href="">Integritespolicy</a>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2">
          <h2>Resurser</h2>
          <div className="bg-primary h-[2px] w-[45px]" />
          <div className="flex flex-col gap-4 opacity-90">
            <a href="">Lagar & regler</a>
            <a href="">Försäkringskassan</a>
            <a href="">Funktionsrättsorganisationer</a>
            <a href="">Vanliga hjälpmedel</a>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2">
          <h2>Kontakt</h2>
          <div className="bg-primary h-[2px] w-[45px]" />
          <div className="flex flex-col gap-4 opacity-90">
            <a href="">inte@ansokningshalpen.se</a>
            <a href="">070-123 45 67</a>
            <a href="">Kontaktformulär</a>
            <a href="">Feedback</a>
          </div>
        </div>
      </div>
      <div className="bg-base-100 h-px w-full opacity-20" />
      <div className="flex justify-center p-4">
        <h4 className="">© 2025 Ansökshjälpen. Alla rättigheter förbehållna</h4>
      </div>
    </footer>
  );
};

export default Footer;
