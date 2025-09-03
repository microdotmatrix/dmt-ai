export default async function CreateMemorialImagePage({
  params,
}: {
  params: { entryId: string };
}) {
  const { entryId } = await params;
  return (
    <main>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">Create Memorial Image</h1>
        <p className="text-muted-foreground">
          Create a new memorial image for your entry.
        </p>
      </div>
    </main>
  );
}
