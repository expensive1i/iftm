/** The three orbit dots from the left of the logo mark, as a small accent. */
export function OrbitDots({ className = "size-9" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={className}>
      {[135, 180, 225].map((deg) => {
        const r = (deg * Math.PI) / 180;
        return (
          <circle
            key={deg}
            cx={+(34 + Math.cos(r) * 26).toFixed(2)}
            cy={+(20 + Math.sin(r) * 16).toFixed(2)}
            r="4.5"
            className="fill-primary"
          />
        );
      })}
    </svg>
  );
}
