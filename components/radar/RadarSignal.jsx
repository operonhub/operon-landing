export default function RadarSignal({ variant = 0, compact = false, framed = false }) {
  const patterns = [
    [28, 54, 38, 72, 48, 84, 61, 76, 46],
    [74, 44, 63, 34, 58, 25, 69, 42, 80],
    [35, 68, 49, 81, 57, 31, 71, 52, 88],
  ];
  const values = patterns[variant % patterns.length];

  return (
    <div
      className={`relative overflow-hidden bg-ink ${
        framed ? "rounded-2xl border border-line" : "border-b border-line"
      } ${compact ? "h-28" : "h-44 lg:h-52"}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 dot-grid-dark opacity-50" />
      <div className="absolute left-5 right-5 top-5 flex items-center justify-between font-mono-up text-paper/40">
        <span>SIGNAL / 0{variant + 1}</span>
        <span>OPERON / RADAR</span>
      </div>
      <svg viewBox="0 0 900 260" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[72%] w-full">
        <polyline
          points={values.map((value, index) => `${(index / (values.length - 1)) * 900},${240 - value * 2.25}`).join(" ")}
          fill="none"
          stroke="#F2C94C"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
        {values.map((value, index) => (
          <circle
            key={index}
            cx={(index / (values.length - 1)) * 900}
            cy={240 - value * 2.25}
            r="4"
            fill={index === values.length - 1 ? "#F2C94C" : "#FBF9F4"}
          />
        ))}
      </svg>
      <div className="absolute bottom-0 right-0 h-16 w-16 border-l border-t border-paper/15 bg-blue" />
    </div>
  );
}
