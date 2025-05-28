"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const IntegritetPage = () => {
  return (
    <div className="bg-background min-h-screen w-full px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Tillbaka</span>
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Integritetspolicy</CardTitle>
              <CardDescription>Senast uppdaterad: 20 Maj, 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h2 className="mb-3 text-xl font-semibold">1. Inledning</h2>
                <p className="">
                  Vi på Ansökshjälpen värnar om din personliga integritet. Denna integritetspolicy
                  förklarar hur vi samlar in, använder, lagrar och skyddar dina personuppgifter när
                  du använder vår tjänst för att söka arbetshjälpmedel via Försäkringskassan.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold">2. Personuppgifter vi samlar in</h2>
                <p className="mb-2">
                  När du använder vår tjänst för att skapa en ansökan om arbetshjälpmedel kan vi
                  samla in följande uppgifter:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    Personuppgifter som du aktivt lämnar när du använder vår chatt (namn,
                    kontaktuppgifter)
                  </li>
                  <li>Information om din funktionsnedsättning och behov av arbetshjälpmedel</li>
                  <li>Information om din arbetsplats och arbetssituation</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold">3. Hur vi använder dina uppgifter</h2>
                <p className="mb-2">Dina uppgifter används endast för att:</p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Hjälpa dig att skapa och slutföra en ansökan om arbetshjälpmedel</li>
                  <li>Spara din påbörjade ansökan så att du kan fortsätta senare</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold">4. Datalagring och säkerhet</h2>
                <p className="mb-2">
                  Alla konversationer och uppgifter som du lämnar i vår tjänst:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Lagras krypterat i en säker databas</li>
                  <li>Sparas endast i 100 dagar, därefter raderas de automatiskt</li>
                  <li>Skyddas med stark kryptering för att förhindra obehörig åtkomst</li>
                  <li>Delas aldrig med tredje part</li>
                </ul>
                <p className="mt-2">
                  Vi använder cookies och lokalt lagringsutrymme i din webbläsare för att spara din
                  sessionstoken och dina preferenser. Detta gör att du kan fortsätta en påbörjad
                  ansökan utan att behöva logga in.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold">5. Dina rättigheter</h2>
                <p className="mb-2">Enligt GDPR (Dataskyddsförordningen) har du rätt att:</p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Begära tillgång till dina personuppgifter</li>
                  <li>Begära rättelse av felaktiga uppgifter</li>
                  <li>Begära radering av dina uppgifter</li>
                  <li>Begära begränsning av behandling</li>
                  <li>Invända mot viss behandling</li>
                  <li>Få dina uppgifter överförda till annan tjänst (dataportabilitet)</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold">6. Cookies och sessionsspårning</h2>
                <p className="">
                  Vi använder cookies för att lagra din sessionstoken och dina inställningar. Dessa
                  cookies är nödvändiga för att tjänsten ska fungera och för att du ska kunna
                  fortsätta en påbörjad ansökan vid ett senare tillfälle. Du kan när som helst rensa
                  cookies i din webbläsare, men det kan innebära att din sparade ansökan inte längre
                  är tillgänglig.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-xl font-semibold">7. Kontaktuppgifter</h2>
                <p className="">
                  Om du har frågor om vår integritetspolicy eller hur vi hanterar dina uppgifter,
                  vänligen kontakta oss på:
                </p>
                <div className="mt-2">
                  <p>
                    <strong>Ansökshjälpen</strong>
                  </p>
                  <p className="">
                    E-post:{" "}
                    <a href="mailto:info@LIDOL.se" className="hover:text-primary transition-colors">
                      <span>info@LIDOL.se</span>
                    </a>
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default IntegritetPage;
