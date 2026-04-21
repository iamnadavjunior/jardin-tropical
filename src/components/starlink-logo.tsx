export function StarlinkLogo({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 40"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Starlink"
      role="img"
    >
      {/* Stylised orbit / dish glyph */}
      <g fill="currentColor">
        <ellipse cx="20" cy="20" rx="16" ry="6" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(-20 20 20)" />
        <circle cx="20" cy="20" r="3.2" />
        <circle cx="33" cy="11" r="1.6" />
      </g>
      {/* Wordmark */}
      <text
        x="48"
        y="27"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="600"
        fontSize="20"
        letterSpacing="2"
        fill="currentColor"
      >
        STARLINK
      </text>
    </svg>
  );
}
