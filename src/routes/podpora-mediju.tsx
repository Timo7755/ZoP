import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScrollReveal } from "../components/ScrollReveal";

export const Route = createFileRoute("/podpora-mediju")({
  head: () => ({
    meta: [{ title: "Zgodbe o Pomurju — Podpora mediju" }],
  }),
  component: PodporaMedijuPage,
});

const AMOUNTS = [5, 10, 20, 30];

function PodporaMedijuPage() {
  const [selected, setSelected] = useState<number>(10);

  return (
    <main>
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-24">
        <ScrollReveal>
          <h1 className="text-5xl font-black uppercase text-center leading-tight mb-10">
            Enkratna podpora mediju
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="max-w-2xl mx-auto">
            <p className="text-m text-gray-900 font-semibold leading-relaxed text-center mb-16">
              Ta medij je pripravljen od nas za vas. Za lokalno skupnost in
              druge, ki jih dogajanje v Pomurju zanima.
              <br />
              <br />
              Medij je financiran iz lastnih sredstev, ki jih kot fotografinja
              dobim s svojim delom. Noben članek na tem mediju ni bil plačan.
              <br />
              <br />
              Če bi želeli podpreti ta medij in bi prispevati za potne stroške,
              lahko to storite spodaj:
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <div className="flex justify-center gap-4 mb-10 flex-wrap">
            {AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelected(amount)}
                className={`w-24 h-14 text-xl font-black uppercase border-2 transition-colors cursor-pointer rounded-xl ${
                  selected === amount
                    ? "border-[#ec3032] text-[#ec3032] bg-[#ec3032]/5"
                    : "border-gray-200 text-black hover:border-[#ec3032] hover:text-[#ec3032]"
                }`}
              >
                {amount} €
              </button>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={220}>
          <div className="flex justify-center">
            <button
              className="bg-[#ec3032] text-white text-sm font-bold tracking-widest uppercase px-12 py-4 hover:bg-[#c42527] transition-colors cursor-pointer"
              onClick={() =>
                alert(
                  `Hvala za podporo ${selected} €! Plačilni sistem bo kmalu na voljo.`,
                )
              }
            >
              Podpri z {selected} €
            </button>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
