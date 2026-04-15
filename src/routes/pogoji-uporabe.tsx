import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pogoji-uporabe")({
  head: () => ({
    meta: [{ title: "Zgodbe o Pomurju — Pogoji uporabe" }],
  }),
  component: PogojiUporabePage,
});

function PogojiUporabePage() {
  return (
    <main>
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        <h1 className="text-4xl font-black uppercase mb-2">Pogoji uporabe</h1>
        <p className="text-s text-gray-500 tracking-widest uppercase mb-10">
          Zadnja posodobitev: 17.7.2025
        </p>
        <div className="prose prose-s max-w-none text-gray-900">
          <p>
            Dobrodošli na spletni strani Zgodbe o Pomurju, ki jo upravlja Klara
            Durič (v nadaljevanju »upravljavec«). Z uporabo te spletne strani
            soglašate s spodaj navedenimi pogoji uporabe. Če se s pogoji ne
            strinjate, vas prosimo, da spletne strani ne uporabljate.
          </p>

          <h2>1. Vsebina spletne strani</h2>
          <p>
            Vse vsebine na tej spletni strani so informativnega značaja.
            Upravljavec si prizadeva za ažurnost in točnost, a ne jamči za
            popolnost ali brezhibnost informacij. Vsebine lahko kadarkoli
            spremeni brez predhodnega obvestila.
          </p>

          <h2>2. Avtorske pravice</h2>
          <p>
            Vsebine (besedila, fotografije, videi, grafike) so avtorsko
            zaščitene. Njihovo kopiranje, reproduciranje ali razširjanje brez
            pisnega dovoljenja upravljavca ni dovoljeno, razen če ni izrecno
            navedeno drugače.
          </p>

          <h2>3. Komentiranje</h2>
          <p>
            Obiskovalcem je omogočeno komentiranje pod posameznimi objavami.
            Komentarji morajo biti spoštljivi in v skladu z zakonodajo.
            Upravljavec si pridržuje pravico do brisanja komentarjev, ki
            vsebujejo:
          </p>
          <ul>
            <li>sovražni govor,</li>
            <li>osebne žalitve,</li>
            <li>nestrpnost,</li>
            <li>spam,</li>
            <li>oglaševanje tretjih oseb,</li>
            <li>ali kakršnokoli drugo neprimerno vsebino.</li>
          </ul>

          <h2>4. E-novice</h2>
          <p>
            Obiskovalci se lahko prostovoljno prijavijo na prejemanje e-novic.
            Ob prijavi zbiramo vaš elektronski naslov, ki ga uporabljamo
            izključno za pošiljanje novic. Od prejemanja se lahko kadarkoli
            odjavite preko povezave v prejetem sporočilu.
          </p>

          <h2>5. Google AdSense</h2>
          <p>
            Na spletni strani so prisotni oglasi preko storitve Google AdSense,
            ki uporablja piškotke za prikazovanje prilagojenih oglasov. Z
            uporabo strani soglašate z uporabo teh piškotkov (glej tudi politiko
            zasebnosti spodaj).
          </p>

          <h2>6. Omejitev odgovornosti</h2>
          <p>
            Upravljavec ne prevzema odgovornosti za morebitno škodo, ki bi
            nastala zaradi uporabe spletne strani, nedostopnosti vsebin ali
            nepravilnih podatkov.
          </p>

          <h2>7. Spremembe pogojev</h2>
          <p>
            Upravljavec lahko kadarkoli spremeni te pogoje uporabe. Uporabniki
            ste dolžni redno preverjati pogoje in jih ob nadaljnji uporabi
            upoštevati.
          </p>
        </div>
      </div>
    </main>
  );
}
