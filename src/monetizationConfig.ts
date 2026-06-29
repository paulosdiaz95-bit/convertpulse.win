/**
 * Universal Unit Converter - Monetization Architecture Configuration
 * 
 * To activate live advertisements (Google AdSense, Mediavine, Raptive, etc.):
 * 1. Set `enableLiveAds` to true.
 * 2. Select the preferred provider.
 * 3. Add your publisher or client ID.
 * 4. Paste relevant Ad unit slot IDs below.
 * 
 * Initially, these render elegant, high-fidelity development placeholders so
 * you can visualize layout shift, styling alignment, and design flow before approval.
 */

export interface MonetizationConfig {
  enableLiveAds: boolean;
  provider: "adsense" | "mediavine" | "raptive" | "custom";
  adsenseClientId: string; // e.g. "ca-pub-1234567890123456"
  
  // Specific ad slot placements mapped to unique page structures
  slots: {
    headerBanner: string; // AdSense slot ID for top leaderboard
    sidebarRail: string;  // AdSense slot ID for sidebar
    inlineContent: string; // AdSense slot ID for in-feed lists
    stickyFooter: string; // AdSense slot ID for mobile anchor
    articleFeed: string;  // AdSense slot ID for article native ads
  };
}

export const MONETIZATION_CONFIG: MonetizationConfig = {
  // Set to false during development, change to true once ads are approved and live
  enableLiveAds: false, 
  provider: "adsense",
  adsenseClientId: "", // PLACE YOUR ADSENSE CA-PUB KEY HERE
  slots: {
    headerBanner: "", // PLACE AD SLOT ID HERE
    sidebarRail: "",  // PLACE AD SLOT ID HERE
    inlineContent: "", // PLACE AD SLOT ID HERE
    stickyFooter: "", // PLACE AD SLOT ID HERE
    articleFeed: "",  // PLACE AD SLOT ID HERE
  }
};
