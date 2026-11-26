import { CampaignCard } from "@/components/sections/campaign-card";
import { CampaignSlider } from "@/components/sections/campaign-slider";
import { Container } from "@/components/ui/container";
import { campaigns } from "@/config/campaigns";

/**
 * Campaigns from the network (as in "Our Campaigns" on the current site):
 * the title on the left with the slider controls on the right, then the
 * cards in a one-row slider.
 */
export function Campaigns() {
  return (
    <section
      aria-labelledby="campaigns-title"
      className="border-t bg-white"
    >
      <Container className="py-16 sm:py-20 lg:max-w-[80rem] lg:py-24">
        <CampaignSlider
          label="Campaigns"
          header={
            <>
              <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
                Campaigns
              </p>
              <h2
                id="campaigns-title"
                className="mt-4 max-w-[22ch] [font-family:Cambria,Georgia,serif] text-[2.25rem]/[2.75rem] font-medium text-balance text-black sm:text-[2.75rem]/[3.375rem] lg:text-[3.25rem]/[3.875rem]"
              >
                Citizens asking where the money went.
              </h2>
            </>
          }
        >
          {campaigns.map((c) => (
            <li
              key={c.slug}
              className="w-[80%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]"
            >
              <CampaignCard campaign={c} />
            </li>
          ))}
        </CampaignSlider>
      </Container>
    </section>
  );
}

