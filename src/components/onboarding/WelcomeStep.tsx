"use client";

import { motion } from "framer-motion";
import { IconArrowRight, IconLeaf, IconSparkles } from "@tabler/icons-react";
import { Button } from "@/components/ui";
import { Background } from "../ui/Backgound";

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
          alt="Welcome plant illustration"
          className=" w-40"
        />
        <h1 className=" text-3xl font-bold  text-foreground sm:text-5xl">
          <span className="block">Pequenos habitos,</span>
          <span className="block text-primary">grandes cambios.</span>
        </h1>
        <p className=" text-base text-muted sm:text-lg">
          Construye tu rutina ideal y conviertela en progreso visible cada dia.
        </p>

        <Button
          size="lg"
          className=" h-12 min-w-44 rounded-2xl px-6 text-base"
          onClick={onStart}
        >
          Empezar
          <IconArrowRight className="ml-2 h-4 w-4" stroke={2.2} />
        </Button>
      </div>
    </section>
  );
}
