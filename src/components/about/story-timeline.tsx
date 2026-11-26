import { Container } from "@/components/ui/container";

// From the current ifollowthemoney.org About page.
const steps = [
  {
    when: "2012",
    title: "CODE is founded",
    text: "Connected Development (CODE) starts as a non-governmental organisation to help marginalised communities be heard and hold government to account.",
  },
  {
    when: "2013",
    title: "Bagega, Zamfara",
    text: "Over 1,500 children in Bagega had lead poisoning. Citizens rallied on Twitter and Facebook, at home and abroad, until $5.3 million was released for treatment and remediation.",
  },
  {
    when: "Since",
    title: "Projects back on track",
    text: "Abandoned and stalled projects have been restarted and finished after tracking: schools, primary health centres, and water, sanitation and hygiene facilities.",
  },
  {
    when: "Today",
    title: "A movement across Africa",
    text: "$13.5 million in government projects tracked across 371 grassroots communities, and ₦447 million saved from financial leakages.",
  },
];

/**
 * The story as a timeline: the heading stays in view on the left on large
 * screens while the steps run down a red line on the right.
 */
export function StoryTimeline() {
  return (
    <section aria-labelledby="story-title" className="border-y border-foreground/[0.06] bg-[#FCFCFB]">
      <Container className="grid gap-12 py-20 sm:py-24 lg:max-w-[80rem] lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-28">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">Our story</p>
          <h2
            id="story-title"
            className="mt-4 [font-family:Cambria,Georgia,serif] text-[2.25rem]/[2.75rem] font-medium text-balance text-black sm:text-[2.75rem]/[3.375rem]"
          >
            From one campaign to a movement.
          </h2>
          <p className="mt-6 max-w-md text-base/[1.8rem] text-muted sm:text-lg/8">
            How a campaign for the children of Bagega became more than ten years of tracking public money.
          </p>
        </div>

        <ol>
          {steps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[4.25rem_1fr] sm:grid-cols-[6rem_1fr]">
              <p className="pt-0.5 [font-family:Cambria,Georgia,serif] text-[1.375rem]/none font-medium text-primary sm:text-[1.75rem]/none">
                {s.when}
              </p>
              {/* The red line runs down this column; a dot marks each step */}
              <div
                className={`relative border-l border-primary/25 pl-6 sm:pl-8 ${i < steps.length - 1 ? "pb-12" : "border-transparent"}`}
              >
                <span aria-hidden className="absolute top-1.5 -left-[5.5px] size-2.5 rounded-full bg-primary ring-4 ring-[#FCFCFB]" />
                <h3 className="[font-family:Cambria,Georgia,serif] text-[1.375rem]/tight font-medium text-black sm:text-[1.5rem]/tight">
                  {s.title}
                </h3>
                <p className="mt-2.5 max-w-xl text-[0.9375rem]/7 text-muted sm:text-base/7">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
