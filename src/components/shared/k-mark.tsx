export function KMark({ size = 48 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center gradient-hero shadow-colored"
      style={{ width: size, height: size, borderRadius: "14px" }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size * 0.5}
        height={size * 0.5}
        fill="none"
        stroke="#fff"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 13V51" />
        <path d="M46 17L31 32L47 50" />
      </svg>
    </div>
  );
}
