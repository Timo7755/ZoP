import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/politika-zasebnosti")({
  head: () => ({
    meta: [{ title: "Zgodbe o Pomurju — Politika zasebnosti" }],
  }),
  component: PravilnikZasebnostiPage,
});

function PravilnikZasebnostiPage() {
  return (
    <main>
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        <h1 className="text-4xl font-black uppercase mb-2">
          Politika zasebnosti
        </h1>
        <p className="text-s text-gray-500 tracking-widest uppercase mb-10">
          Zadnja posodobitev: 17.7.2025
        </p>
        <div className="prose prose-s max-w-none text-gray-900">
          <p>
            Ta politika zasebnosti določa, kako Zgodbe o Pomurju (v
            nadaljevanju: »medij«, »mi«, »nas«) obdeluje in varuje osebne
            podatke uporabnikov, zbranih preko spletne strani
            www.klaraduric.com.
          </p>

          <h2>1. Upravljavec osebnih podatkov</h2>
          <p>
            Upravljavec osebnih podatkov je:
            <br />
            Klara Durič s.p.
            <br />
            Naslov: Gerlinci 2, 9261 Cankova
            <br />
            E-pošta:{" "}
            <a href="mailto:urednistvo@zgodbeopomurju.com">
              urednistvo@zgodbeopomurju.com
            </a>
            <br />
            Telefon: 041 541 778
          </p>

          <h2>2. Katere podatke zbiramo?</h2>
          <p>Zbiramo naslednje osebne podatke:</p>
          <ul>
            <li>E-poštni naslov (ob prijavi na e-novice)</li>
            <li>
              IP naslov in podatki o uporabi spletne strani (preko piškotkov)
            </li>
            <li>Podatki, ki jih prostovoljno vnesete v komentarje</li>
          </ul>

          <h2>3. Namen zbiranja podatkov</h2>
          <p>Vaše podatke uporabljamo za naslednje namene:</p>
          <ul>
            <li>Pošiljanje e-novic (z vašim soglasjem)</li>
            <li>Prikazovanje prilagojenih oglasov (Google AdSense)</li>
            <li>Upravljanje spletnih komentarjev</li>
            <li>Analiza obiskov strani (Google Analytics)</li>
          </ul>

          <h2>4. Piškotki in Google AdSense</h2>
          <p>
            Spletna stran uporablja piškotke, vključno s piškotki tretjih oseb
            (Google AdSense), za prikaz prilagojenih oglasov, analizo prometa in
            delovanje spletne strani. Piškotke lahko nadzirate in izbrišete
            preko nastavitev svojega brskalnika. Z nadaljnjo uporabo strani
            soglašate z njihovo uporabo.
          </p>

          <h2>5. Varstvo in hramba podatkov</h2>
          <p>
            Vaše podatke varujemo z ustreznimi tehničnimi in organizacijskimi
            ukrepi. Podatkov ne posredujemo tretjim osebam, razen v primeru
            sodelovanja s pogodbenimi obdelovalci (npr. ponudnik e-poštne
            platforme) ali če to zahteva zakon.
          </p>

          <h2>6. Pravice uporabnikov</h2>
          <p>V skladu z GDPR imate pravico do:</p>
          <ul>
            <li>dostopa do svojih podatkov,</li>
            <li>popravka ali izbrisa,</li>
            <li>omejitve obdelave,</li>
            <li>ugovora obdelavi,</li>
            <li>prenosljivosti podatkov,</li>
            <li>vložitve pritožbe pri Informacijskem pooblaščencu RS.</li>
          </ul>
          <p>
            Za uveljavljanje svojih pravic nam lahko pišete na{" "}
            <a href="mailto:urednistvo@zgodbeopomurju.com">
              urednistvo@zgodbeopomurju.com
            </a>
            .
          </p>

          <h2>7. Spremembe politike zasebnosti</h2>
          <p>
            Pridržujemo si pravico do spremembe te politike zasebnosti. Datum
            zadnje spremembe je naveden na vrhu dokumenta.
          </p>
        </div>
      </div>
    </main>
  );
}
