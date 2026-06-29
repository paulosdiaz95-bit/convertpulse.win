import React, { useEffect, useState } from "react";
import { MONETIZATION_CONFIG } from "../monetizationConfig";
import { X, Sparkles, HelpCircle, Monitor, ShieldCheck } from "lucide-react";

// Helper to push Google AdSense queue
const pushAdSense = () => {
  try {
    const w = window as any;
    (w.adsbygoogle = w.adsbygoogle || []).push({});
  } catch (err) {
    console.warn("AdSense trigger postponed: waiting for network script loading.", err);
  }
};

/**
 * 1. AD BANNER (Leaderboard Ad Zone)
 * Standard size: 728x90, 320x50, or responsive fluid.
 * Best used: Top of page, below header, or bottom of results container.
 */
interface AdBannerProps {
  slotType: "headerBanner" | "articleFeed";
}

export function AdBanner({ slotType }: AdBannerProps) {
  const slotId = MONETIZATION_CONFIG.slots[slotType];
  const isLive = MONETIZATION_CONFIG.enableLiveAds && MONETIZATION_CONFIG.adsenseClientId && slotId;

  useEffect(() => {
    if (isLive) {
      pushAdSense();
    }
  }, [isLive]);

  if (isLive) {
    return (
      <div className="w-full text-center my-6 overflow-hidden min-h-[90px]">
        <span className="text-[9px] font-mono tracking-wider text-slate-400 block mb-1">ADVERTISEMENT</span>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={MONETIZATION_CONFIG.adsenseClientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Developer / Mock Mode Placeholder
  return (
    <div className="w-full bg-brand-50/40 dark:bg-brand-950/20 border border-dashed border-brand-200 dark:border-brand-800/80 rounded-2xl p-6 my-6 text-center select-none transition-all hover:bg-brand-50 dark:hover:bg-brand-950/35 relative overflow-hidden group min-h-[110px] flex flex-col items-center justify-center">
      <div className="absolute top-0 right-0 p-1 bg-brand-600 text-white text-[8px] font-bold uppercase tracking-widest rounded-bl-xl shadow-xs">
        Monetization Zone
      </div>
      <div className="flex items-center gap-2 mb-1.5">
        <Monitor className="w-4 h-4 text-brand-600 dark:text-brand-400" />
        <span className="text-[10px] font-mono tracking-widest text-brand-700 dark:text-brand-300 font-bold uppercase">
          Leaderboard Ad Placement
        </span>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl font-medium">
        ⚡ Dev Space: After Google AdSense approval, this area will dynamically render premium programmatic banner ads.
      </p>
      <div className="text-[9px] text-slate-400 font-mono mt-1">
        Type: Banner Leaderboard | Slots: Header & Results Bottom
      </div>
    </div>
  );
}

/**
 * 2. AD INLINE (In-Content Inline Ad Zone)
 * Standard size: 300x250, 336x280.
 * Best used: Nested elegantly inside calculations blocks or landing grids.
 */
export function AdInline() {
  const slotId = MONETIZATION_CONFIG.slots.inlineContent;
  const isLive = MONETIZATION_CONFIG.enableLiveAds && MONETIZATION_CONFIG.adsenseClientId && slotId;

  useEffect(() => {
    if (isLive) {
      pushAdSense();
    }
  }, [isLive]);

  if (isLive) {
    return (
      <div className="w-full text-center my-4 overflow-hidden min-h-[250px]">
        <span className="text-[9px] font-mono tracking-wider text-slate-400 block mb-1">ADVERTISEMENT</span>
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: "300px", height: "250px" }}
          data-ad-client={MONETIZATION_CONFIG.adsenseClientId}
          data-ad-slot={slotId}
        />
      </div>
    );
  }

  return (
    <div className="bg-brand-50/20 dark:bg-brand-950/10 border border-brand-200/50 dark:border-brand-800/40 rounded-xl p-5 my-4 text-center select-none flex flex-col items-center justify-center min-h-[160px] relative">
      <span className="text-[9px] font-mono tracking-wider text-brand-500 uppercase font-bold mb-1">
        AD INLINE PLACEHOLDER
      </span>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
        Responsive inline rectangular block. Perfect for high-CTR placements between the calculation details and unit tables.
      </p>
    </div>
  );
}

/**
 * 3. AD SIDEBAR (Sidebar Block)
 * Standard size: 300x600, 160x600.
 * Best used: Fixed in sidebar drawers or as a sticky companion panel.
 */
export function AdSidebar() {
  const slotId = MONETIZATION_CONFIG.slots.sidebarRail;
  const isLive = MONETIZATION_CONFIG.enableLiveAds && MONETIZATION_CONFIG.adsenseClientId && slotId;

  useEffect(() => {
    if (isLive) {
      pushAdSense();
    }
  }, [isLive]);

  if (isLive) {
    return (
      <div className="w-full text-center my-4 overflow-hidden min-h-[600px]">
        <span className="text-[9px] font-mono tracking-wider text-slate-400 block mb-1">ADVERTISEMENT</span>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={MONETIZATION_CONFIG.adsenseClientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-brand-50/40 dark:bg-brand-950/20 border border-dashed border-brand-200 dark:border-brand-800/80 rounded-xl p-5 text-center select-none transition-all hover:bg-brand-50 dark:hover:bg-brand-950/35 flex flex-col items-center justify-center min-h-[220px]">
      <ShieldCheck className="w-5 h-5 text-brand-600 dark:text-brand-400 mb-1.5" />
      <span className="text-[10px] font-mono tracking-widest text-brand-700 dark:text-brand-300 font-bold uppercase mb-1">
        Sidebar Companion Ad
      </span>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
        AdSense, Mediavine or direct sponsor sidebar rail goes here. Automatically resizes on tablets.
      </p>
    </div>
  );
}

/**
 * 4. STICKY BOTTOM AD (Anchor Bottom Ad Overlay)
 * Standard size: 320x50 on mobile, 728x90 on desktop.
 * Highly requested feature for high CTR RPM boosts, floating at the screen bottom.
 */
export function StickyBottomAd() {
  const [visible, setVisible] = useState(true);
  const slotId = MONETIZATION_CONFIG.slots.stickyFooter;
  const isLive = MONETIZATION_CONFIG.enableLiveAds && MONETIZATION_CONFIG.adsenseClientId && slotId;

  useEffect(() => {
    if (isLive && visible) {
      pushAdSense();
    }
  }, [isLive, visible]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 py-3 shadow-2xl flex items-center justify-center transition-transform">
      <div className="max-w-6xl w-full px-4 flex items-center justify-between gap-4">
        {/* Ad container */}
        <div className="flex-1 flex justify-center">
          {isLive ? (
            <ins
              className="adsbygoogle"
              style={{ display: "inline-block", width: "100%", height: "50px" }}
              data-ad-client={MONETIZATION_CONFIG.adsenseClientId}
              data-ad-slot={slotId}
            />
          ) : (
            <div className="flex items-center gap-3">
              <span className="bg-brand-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider shrink-0">
                Anchor Ad
              </span>
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-tight">
                💡 Bottom Sticky Zone configured. Perfect for high-engagement mobile devices.
              </p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => setVisible(false)}
          className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close Advertisement"
          id="btn-close-sticky-ad"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/**
 * 5. NATIVE AD (Integrated Sponsorship Block)
 * Looks like part of the site styling, but labeled. Ideal for direct sponsorships or high CPC affiliating.
 */
interface NativeAdProps {
  campaign?: "neon" | "course" | "drizzle";
}

export function NativeAd({ campaign = "neon" }: NativeAdProps) {
  if (campaign === "neon") {
    return (
      <div className="w-full bg-linear-to-r from-brand-50/40 to-emerald-50/10 dark:from-brand-950/20 dark:to-emerald-950/5 border border-brand-100/55 dark:border-brand-900/30 rounded-xl p-5 my-6 select-none shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
        <div>
          <span className="text-[9px] font-mono tracking-widest text-brand-600 dark:text-brand-400 uppercase block mb-1 font-bold">
            PREMIUM SPONSOR
          </span>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            ⚡ Deploy lightning-fast serverless database clusters
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Get 100% serverless PostgreSQL database schemas configured in 3 seconds with Neon's native platform.
          </p>
        </div>
        <a
          href="https://neon.tech"
          target="_blank"
          rel="noopener noreferrer referrer"
          className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-700 dark:hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 text-center"
        >
          Try Free
        </a>
      </div>
    );
  }

  if (campaign === "course") {
    return (
      <div className="w-full bg-linear-to-r from-brand-50/40 to-slate-50/50 dark:from-brand-950/20 dark:to-slate-900/10 border border-brand-100/55 dark:border-brand-900/30 rounded-xl p-5 my-6 select-none shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
        <div>
          <span className="text-[9px] font-mono tracking-widest text-brand-600 dark:text-brand-400 uppercase block mb-1 font-bold">
            EDUCATIONAL PARTNER
          </span>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Master Advanced Mathematics & Engineering Metrics
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Learn metric conversion matrices, dimensional analysis, and fluid dynamics calculation logic with our expert guides.
          </p>
        </div>
        <button className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-700 dark:hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0">
          Get 40% Off
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-brand-50/30 dark:bg-brand-950/10 border border-brand-100/50 dark:border-brand-900/20 rounded-lg p-3.5 select-none text-center">
      <span className="text-[9px] font-mono text-brand-600 dark:text-brand-400 uppercase tracking-widest block mb-1 font-bold">
        DEVELOPER SPONSORSHIP
      </span>
      <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
        Need schema-first database relations with instant migration sync? Explore Drizzle ORM toolkit.
      </p>
    </div>
  );
}

/**
 * 6. ARTICLE AD (Elegant Ad placed between articles)
 * Best used: Under Related Educational Articles block.
 */
export function ArticleAd() {
  const slotId = MONETIZATION_CONFIG.slots.articleFeed;
  const isLive = MONETIZATION_CONFIG.enableLiveAds && MONETIZATION_CONFIG.adsenseClientId && slotId;

  useEffect(() => {
    if (isLive) {
      pushAdSense();
    }
  }, [isLive]);

  if (isLive) {
    return (
      <div className="w-full text-center my-4 overflow-hidden min-h-[120px]">
        <span className="text-[9px] font-mono tracking-wider text-slate-400 block mb-1">ADVERTISEMENT</span>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={MONETIZATION_CONFIG.adsenseClientId}
          data-ad-slot={slotId}
          data-ad-format="fluid"
        />
      </div>
    );
  }

  return (
    <div className="border border-dashed border-brand-200/50 dark:border-brand-800/40 bg-brand-50/10 dark:bg-brand-950/5 rounded-xl p-4 my-4 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Article Feed Monetization Zone
        </span>
      </div>
      <span className="text-[9px] text-slate-400 font-mono">Native Ad Unit Placement</span>
    </div>
  );
}
