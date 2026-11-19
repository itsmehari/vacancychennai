import HomeBreakout from "@/components/home/home-breakout";
import HomeHeroRotator from "@/components/home/home-hero-rotator";
import type { Location } from "@/types/domain";

type Props = {
  jobCount: number;
  areaCount: number;
  categories: string[];
  locations: Location[];
  /** Live insight from listings, e.g. “Most openings right now: …”. */
  dynamicAreaInsight: string | null;
};

/** Three reference layouts — window, board, orbit — cross-fading on a timer. */
export default function HomeHero(props: Props) {
  return (
    <HomeBreakout>
      <HomeHeroRotator {...props} />
    </HomeBreakout>
  );
}
