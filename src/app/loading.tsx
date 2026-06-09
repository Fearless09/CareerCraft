import { Loader } from "@/components/shared/Loader";

export default function RootLoading() {
  return (
    <main className="mb-25 flex flex-1 flex-col items-center justify-center px-4">
      <Loader />
    </main>
  );
}
