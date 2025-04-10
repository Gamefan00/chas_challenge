import React from "react";

const HeroSection = () => {
  return (
    <div className="hero card bg-accent">
      <div className="hero-content max-w-lg flex-col py-12 text-center">
        <h1>Förenkla din väg till arbetshjälpmedel</h1>
        <p className="py-2 !text-base">
          Låt vår AI-assistent guida dig genom ansökningsprocessen och maximera dina chanser att få
          rätt stöd för dina behov.
        </p>
        <button className="btn btn-primary">Kom igång nu</button>
      </div>
    </div>
  );
};

export default HeroSection;
