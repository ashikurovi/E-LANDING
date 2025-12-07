import EmblaCarousel from "@/components/shared/EmblaCarouel";
import { getBanners } from "@/lib/api-services";
import Image from "next/image";
import React from "react";

const HeroCarousel: React.FC = async () => {
  let banners: any[] = [];

  try {
    banners = await getBanners('COMP-000001');
  } catch (error) {
    console.error("Failed to load banners:", error);
    // banners will remain empty array
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto">
      <EmblaCarousel dotButtons autoplay>
        {banners.map((banner) => (
          <div
            key={banner.id || banner.slug}
            className="[flex:0_0_100%] w-full h-full"
          >
            <Image
              src={banner.bannerImage || banner.image?.url || "/images/logo.png"}
              alt={banner.name || "Banner Image"}
              width={1280}
              height={500}
              className="sm:aspect-[16/5] aspect-[16/7] "
            />
          </div>
        ))}
      </EmblaCarousel>
    </section>
  );
};

export default HeroCarousel;
