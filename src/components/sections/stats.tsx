import { CountUp } from "@/components/sections/count-up";
import { Container } from "@/components/ui/container";

/*
 * Headline numbers straight under the hero, so visitors see the impact at a
 * glance. From the current ifollowthemoney.org About page (which also quotes
 * an older $10.6M / 191 communities; the larger, more recent set is used).
 */
const stats = [
  { to: 10, suffix: "+", label: "Years tracking public money" },
  { to: 13.5, decimals: 1, prefix: "$", suffix: "M", label: "In government projects tracked" },
  { to: 371, label: "Grassroots communities reached" },
  { to: 447, prefix: "₦", suffix: "M", label: "Saved from financial leakages" },
];

export function Stats() {
  return (
    <section aria-label="Our impact in numbers" className="border-y bg-white">
      <Container className="lg:max-w-[80rem]">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={[
                "flex flex-col-reverse py-8 sm:py-10",
                i % 2 === 1 ? "border-l pl-6 sm:pl-8" : "",
                i < 2 ? "border-b lg:border-b-0" : "",
                i === 2 ? "lg:border-l lg:pl-8" : "",
                i > 0 && i !== 2 ? "lg:pl-8" : "",
              ].join(" ")}
            >
              <dt className="mt-2 text-[0.9375rem] text-muted">{s.label}</dt>
              <dd className="[font-family:Cambria,Georgia,serif] text-[2.25rem]/none font-medium text-black sm:text-[3rem]">
                <CountUp to={s.to} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
