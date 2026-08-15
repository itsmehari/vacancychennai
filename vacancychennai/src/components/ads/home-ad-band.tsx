import HomeSectionShell from "@/components/home/home-section-shell";
import { PageAdSlot } from "@/components/ads/page-ad-slot";

export function HomeAdBand({ placement }: { placement: string }) {
  return (
    <HomeSectionShell variant="muted" fullBleed>
      <PageAdSlot shape="rectangle" placement={placement} />
    </HomeSectionShell>
  );
}
