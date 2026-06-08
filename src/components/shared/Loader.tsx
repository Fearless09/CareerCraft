export function Loader({
  length = 18,
  height = "32px",
}: {
  length?: number;
  height?: string;
}) {
  return (
    <ul className="flex h-8 items-center gap-1" style={{ height }}>
      {Array.from({ length }).map((_, i) => (
        <li
          key={i}
          className="bg-accent h-[33%] w-2 animate-[wave_1s_infinite_ease-in-out] rounded-full"
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </ul>
  );
}
