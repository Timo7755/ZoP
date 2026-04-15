import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [{ title: "Zgodbe o Pomurju — Impressum" }],
  }),
  component: ImpressumPage,
});

function ImpressumPage() {
  return (
    <main>
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        <h1 className="text-4xl font-black uppercase mb-10">Impressum</h1>
        <div className="prose prose-sm max-w-none text-gray-700">
          <p className="font-bold text-black text-2xl">Zgodbe o Pomurju</p>
          <div className="text-lg">
            <p>Pomurski spletni medij</p>

            <p>
              Klara Durič s.p.
              <br />
              Gerlinci 2<br />
              9261 Cankova
              <br />
              Slovenija
            </p>

            <p>
              Davčna št: 91109345
              <br />
              Matična številka: 9838716000
              <br />
              Številka medija: 2613
            </p>

            <p>
              Odgovorna urednica: Klara Durič
              <br />
              <a href="mailto:urednistvo@zgodbeopomurju.com">
                urednistvo@zgodbeopomurju.com
              </a>
              <br />
              041 541 778
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
