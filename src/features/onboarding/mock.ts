import type { AppUser } from "@/types/user";

export const userMock: AppUser = {
  id: "user-alba",
  firstName: "Alba",
  lastName: "García",
  email: "alba@flowhabit.app",
  avatarInitials: "AG",
};

export const onboardingCopyMock = {
  welcomeTitle: ["Pequeños hábitos,", "grandes cambios."],
  welcomeSubtitle:
    "Construye tu rutina ideal y conviértela en progreso visible cada día.",
  selectionTitle: "¿Qué hábitos quieres construir?",
  selectionSubtitle:
    "Selecciona los que más te importan para iniciar tu rutina.",
  confirmationTitle: "¡Genial! Estos son tus hábitos",
  confirmationSubtitle: "Siempre puedes editarlos más tarde.",
};
