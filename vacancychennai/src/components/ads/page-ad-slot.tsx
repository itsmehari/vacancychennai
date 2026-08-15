import { PartnerAdRotator } from "@/components/ads/partner-ad-rotator";
import { partnerAds, type PartnerAdShape } from "@/lib/partner-ads";

type Props = {
  shape: PartnerAdShape;
  placement: string;
  className?: string;
};

export function PageAdSlot({ shape, placement, className }: Props) {
  return (
    <div className={className}>
      <PartnerAdRotator shape={shape} ads={partnerAds(placement)} placement={placement} />
    </div>
  );
}
