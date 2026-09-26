/** Seed notes shown on habit detail before the user writes their own. */
export const habitNotesMock = [
  "Hoy me sentí con más energía al completar este hábito.",
  "Fue más fácil de lo esperado. Voy a mantener el mismo horario.",
  "Hubo distracciones, pero igual lo completé.",
  "Pequeño avance, gran constancia.",
] as const;

export const habitDetailCopyMock = {
  notesPlaceholder: "Escribe una reflexión sobre este hábito...",
  emptyNotes: "Aún no hay notas.",
  checkInLabel: "Check-in",
  completedLabel: "Completado",
};
