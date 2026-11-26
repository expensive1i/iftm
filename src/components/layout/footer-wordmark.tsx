/**
 * The footer's bottom edge: "iFollowTheMoney" set huge
 * across the full width, like a sign-off. It fades out towards the bottom
 * and the page edge trims it slightly, like a horizon.
 */
export function FooterWordmark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none overflow-hidden select-none [mask-image:linear-gradient(to_bottom,black_25%,transparent_95%)]"
    >
      <div className="flex translate-y-[14%] justify-center px-[2vw] pt-8">
        <span className="font-display text-[11vw]/[0.9] font-bold tracking-[-0.045em] whitespace-nowrap text-white/90">
          iFollowTheMoney
        </span>
      </div>
    </div>
  );
}
