"use client";

export default function BalloonMark({
  size = 56,
  color = "currentColor",
  accent = null,
  filled = false,
  stroke = 6,
  className = "",
  title,
  accentAttrs = {}, // data-* extra forwarded to the accent dot (CosmicDot anchors)
}) {
  const h = size * (78 / 56);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 56 78"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title || "Operon"}
      className={className}
      style={{ display: "block", overflow: "visible" }}
    >
      {title && <title>{title}</title>}
      {filled ? (
        <circle cx="28" cy="24" r="22" fill={color} />
      ) : (
        <circle cx="28" cy="24" r="21" fill="none" stroke={color} strokeWidth={stroke} />
      )}
      {accent && !filled && (
        <circle cx="28" cy="24" r={stroke * 0.95} fill={accent} {...accentAttrs} />
      )}
      {filled && accent && (
        <path
          d="M16 16 A 16 16 0 0 1 30 9"
          fill="none"
          stroke={accent}
          strokeWidth={stroke * 0.7}
          strokeLinecap="round"
        />
      )}
      <path d="M22 45 L34 45 L28 53 Z" fill={color} />
      <path
        d="M28 53 C 24 61, 35 64, 30 78"
        fill="none"
        stroke={color}
        strokeWidth={stroke * 0.62}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({ fontSize = 22, color = "currentColor", accent = null, filled = false }) {
  const bSize = fontSize * 1.18;
  return (
    <span
      className="inline-flex items-end leading-none font-display font-semibold"
      style={{ fontSize, color, letterSpacing: "-.02em" }}
    >
      <span
        style={{
          display: "inline-flex",
          marginRight: fontSize * -0.02,
          marginBottom: fontSize * -0.16,
        }}
      >
        <BalloonMark
          size={bSize}
          color={color}
          accent={accent}
          filled={filled}
          stroke={5.4}
          title="Operon"
        />
      </span>
      <span style={{ letterSpacing: "-.04em" }}>peron</span>
    </span>
  );
}
