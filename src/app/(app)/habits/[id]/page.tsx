type HabitDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function HabitDetailPage({
  params,
}: HabitDetailPageProps) {
  const { id } = await params;

  return <main className="p-6">Habit detail placeholder: {id}</main>;
}
