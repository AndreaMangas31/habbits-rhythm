"use client";

import "./background.css";
import { IconSparkles } from "@tabler/icons-react";

export function Background() {
  return (
    <div className="absolute z-0 h-full w-full ">
      {/* Fondo */}
      <div className="absolute inset-0 bg-linear-to-br from-[#FBF8FF] via-[#F7F4FF] to-[#FAFCFF]" />

      {/* Aurora */}
      <div className="aurora" />

      {/* Glow central */}
      <div className="absolute left-1/2 top-1/2 h-175 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-[35px]" />

      {/* Blobs */}
      <div className="blob blob-purple" />
      <div className="blob blob-green" />
      <div className="blob blob-pink" />

      {/* Sparkles */}
      <IconSparkles className="sparkle left-[12%] top-[22%] h-5 w-5 text-violet-300" />
      <IconSparkles className="sparkle delay-1 left-[80%] top-[14%] h-4 w-4 text-violet-300" />
      <IconSparkles className="sparkle delay-2 left-[20%] bottom-[18%] h-3 w-3 text-fuchsia-300" />
      <IconSparkles className="sparkle delay-3 right-[18%] bottom-[24%] h-4 w-4 text-emerald-300" />

      {/* Noise */}
      <div className="noise" />
    </div>
  );
}
