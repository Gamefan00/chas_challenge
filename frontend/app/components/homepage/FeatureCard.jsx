import React from "react";

const FeatureCard = () => {
  return (
    <>
      {/* Section Title */}
      <h2 className="flex justify-center p-2">Hur kan vi hjälpa dig?</h2>
      {/* Contianer for Feature Cards */}
      <div className="flex flex-col md:flex md:flex-row justify-center gap-10">
        {/* Card 1 */}
        <div className="card bg-base-100 h-82 w-full shadow-md ">
          <div className="card-body flex justify-between">
            {/* Icon for documentation */}
            {/* <FileText /> from lucide react*/}
            <div className="">Dokument ikon här</div>
            {/* Card Content */}
            <div className="flex flex-col justify-end">
              <div className="flex flex-col gap-2">
                {/* Card Title */}
                <h3 className="card-title">Fylla i formulär</h3>
                {/* Card Description */}
                <p className="mb-10 leading-relaxed">
                  Få hjälp med att välja rätt fomulär och formulera dina svar på ett sätt som ökar
                  dina chanser att få rätt stöd.
                </p>
              </div>
              {/* Card Button */}
              <button className="btn btn-primary shadow-md">
                <a href="/">Starta formulärguide</a>
              </button>
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="card bg-base-100 h-82 w-full shadow-md">
          <div className="card-body flex justify-between">
            {/* <MessageSquareMore /> from lucide react */}
            <div className="mb-10">Pratbubbla ikon här</div>

            {/* Card Content */}
            <div className="flex flex-col justify-end">
              <div className="flex flex-col gap-2">
                {/* Card Title */}
                <h3 className="card-title">Förbered utredningssamtal</h3>
                {/* Card Description */}
                <p className="mb-10 leading-relaxed">
                  Simulera ett utredningssamtal med vår AI och lär dig svara på handläggarens frågor
                  på ett tydligt och effektivt sätt.
                </p>
              </div>
              {/* Card Button */}
              <button className="btn btn-primary shadow-md">
                <a href="/">Förbered samtal</a>
              </button>
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="card bg-base-100 h-82 w-full shadow-md ">
          <div className="card-body flex justify-between">
            {/* <PenLine/> from lucide react */}
            <div className="mb-10">Penna ikon här</div>
            {/* Card Content */}
            <div className="flex flex-col justify-end">
              <div className="flex flex-col gap-2">
                {/* Card Title */}
                <h3>Lär dig mer</h3>
                {/* Card Description */}
                <p className="mb-10 leading-relaxed">
                  Förstår dina rättigheter och skyldigheter kring arbetshjälpmedel genom att läsa
                  guider, artiklar och expertråd.
                </p>
              </div>
              {/* Card Button */}
              <button className="btn btn-accent bg-accent shadow-md">
                <a href="/">Utforska resurser</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeatureCard;
