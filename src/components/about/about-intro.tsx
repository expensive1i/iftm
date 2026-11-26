import { WriteOn } from "@/components/ui/write-on";
import { Container } from "@/components/ui/container";

/*
 * Straight after the About banner: the impact statement in large type (with
 * the figures picked out as chips, like the home page statement), written
 * in on scroll, then the
 * two paragraphs about the movement at full width.
 * Copy from the current ifollowthemoney.org About page.
 */
export function AboutIntro() {
  return (
    <section aria-label="What we have achieved" className="bg-white">
      <Container className="py-16 sm:py-20 lg:max-w-[80rem] lg:py-24">
        {/* Written word by word with GSAP each time it scrolls into view */}
        <WriteOn
          as="p"
          lang="en"
          className="[font-family:Cambria,Georgia,serif] text-[1.375rem]/[2.35rem] font-medium text-pretty text-black sm:text-[2rem]/[3.25rem] lg:text-[2.5rem]/[4rem]"
          text={[
            "Our team has tracked a total of ",
            { chip: "$13.5 million" },
            " in government projects in ",
            { chip: "371 grassroots communities" },
            " and further saved the Nigerian Government the tune of ",
            { chip: "₦447 million" },
            " from financial leakages.",
          ]}
        />

        <div className="mt-10 space-y-6 border-t border-foreground/10 pt-10 text-[1.0625rem]/[1.9rem] text-muted sm:mt-14 sm:pt-12 sm:text-lg/[2rem]">
          <p lang="en" className="text-justify hyphens-manual">
            {
              "Follow The Money is now the largest citi­zen-led so­cio-dig­i­tal ac­count­abil­ity move­ment in Africa, driving grass­roots par­tic­i­pa­tion in main­stream issues and nudging crit­i­cal stake­hold­ers to hold gov­ern­ments accountable. It is a network of jour­nal­ists, data wran­glers, de­vel­op­ment en­thu­si­asts, com­mu­nity cham­pi­ons, in­for­ma­tion an­a­lysts, legal prac­ti­tion­ers, and citizens across Africa who are pas­sion­ate about open data and en­sur­ing more trans­par­ent gov­ern­ment processes."
            }
          </p>
          <p lang="en" className="text-justify hyphens-manual">
            {
              "iFol­low­The­Money is an online com­mu­nity for thou­sands of pas­sion­ate young people across Africa who are hold­ing their gov­ern­ment to ac­count­able stan­dards in order to ensure that the div­i­dends of de­moc­racy are achieved and public funds work for the good of the people. You too can be a part of the so­lu­tion in your com­mu­nity by joining our team of citizen eval­u­a­tors, and com­mu­nity cham­pi­ons at ifollow​the​money.org."
            }
          </p>
        </div>
      </Container>
    </section>
  );
}
