"use client";

import { IconArrowRight, IconLeaf } from "@tabler/icons-react";
import { Button } from "@/components/ui";
import { Background } from "../ui/Backgound";
import { Translate } from "@/components/layout/AppTranslate";

type WelcomeStepProps = {
  onStart: () => void;
};

export function WelcomeStep({ onStart }: WelcomeStepProps) {
  return (
    <section className="relative flex flex-col min-h-dvh items-center  overflow-hidden px-4 py-4 sm:px-6">
      <Background />
      {/* Header */}
      <div className="z-1 flex w-full justify-start items-center gap-2 text-sm font-semibold text-foreground/85">
        <IconLeaf className="h-4 w-4 text-primary" stroke={2} />
        <span>Flowhabit</span>
      </div>
      <div className="z-1 flex flex-1 flex-col h-max items-center bg-transparent justify-center max-w-xl text-center gap-4">
        <img
          src="/plant.png"
          alt="Ilustración de una planta de bienvenida"
          className=" w-40"
        />
        <h1 className=" text-3xl font-bold  text-foreground sm:text-5xl">
          <span className="block"><Translate fallback="…">Pequeños hábitos,</Translate></span>
          <span className="block text-primary"><Translate fallback="…">grandes cambios.</Translate></span>
        </h1>
        <p className=" text-base text-muted sm:text-lg">
          <Translate fallback="…">Construye tu rutina ideal y conviértela en progreso visible cada día.</Translate>
        </p>

        <Button
          size="lg"
          className=" h-12 min-w-44 rounded-2xl px-6 text-base"
          onClick={onStart}
        >
          <Translate fallback="…">Empezar</Translate>
          <IconArrowRight className="ml-2 h-4 w-4" stroke={2.2} />
        </Button>
      </div>
    </section>
  );
}
