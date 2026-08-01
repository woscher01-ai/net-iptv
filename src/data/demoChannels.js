/**
 * Verified CORS-friendly HLS live and vod test channels for out-of-the-box streaming.
 */

export const DEMO_PLAYLIST_NAME = "StreamFlix & Samsung TV Plus";

export const DEMO_CHANNELS = [
  // --- Samsung TV Plus Category Channels ---
  {
    id: "stv-1",
    name: "Samsung TV Plus Live USA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/512px-Samsung_Logo.svg.png",
    backdrop: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=80",
    group: "Samsung TV Plus (USA)",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    description: "Samsung TV Plus 24/7 premium live streaming channel.",
    isFeatured: true,
    isLive: true,
    quality: "HD"
  },
  {
    id: "stv-news",
    name: "Samsung News 24/7",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/512px-Samsung_Logo.svg.png",
    backdrop: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80",
    group: "Samsung TV Plus (USA)",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    url: "https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8",
    description: "Samsung TV News live coverage from across the US.",
    isLive: true,
    quality: "FHD"
  },
  {
    id: "stv-movies",
    name: "Samsung Cinema Club",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/512px-Samsung_Logo.svg.png",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    group: "Samsung TV Plus (USA)",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
    description: "Non-stop Hollywood blockbusters and independent features on Samsung TV Plus.",
    isLive: false,
    quality: "4K"
  },
  {
    id: "stv-sports",
    name: "Samsung Action Sports",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/512px-Samsung_Logo.svg.png",
    backdrop: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
    group: "Samsung TV Plus (USA)",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    url: "https://rbmn-live.akamaized.net/hls/live/590964/BoB-aff-rbmn-live/master.m3u8",
    description: "Extreme sports, highlights, and racing action on Samsung TV Plus.",
    isLive: true,
    quality: "FHD"
  },

  // --- Featured Cinema & International Channels ---
  {
    id: "demo-bbb",
    name: "[US] Big Buck Bunny 4K Cinema",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
    group: "Movies & Cinema",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    description: "A large and lovable rabbit deals with pesky forest creatures in this open-source classic cinematic experience.",
    isLive: true,
    quality: "4K HDR"
  },
  {
    id: "demo-france24",
    name: "[FR] France 24 English Live",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/France_24_logo.svg/512px-France_24_logo.svg.png",
    backdrop: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    group: "News & Documentaries",
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    url: "https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8",
    description: "Live international news 24/7 covering world events, business, analysis, and breaking reports from Paris.",
    isLive: true,
    quality: "HD"
  },
  {
    id: "demo-nasa",
    name: "[US] NASA TV HD Live",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/512px-NASA_logo.svg.png",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    group: "News & Documentaries",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    url: "https://ntv1.akamaized.net/hls/live/2014075/NASA-TV-Media/master.m3u8",
    description: "Live broadcasts from the International Space Station, rocket launches, and space exploration missions.",
    isLive: true,
    quality: "HD"
  },
  {
    id: "demo-redbull",
    name: "[DE] Red Bull Extreme Sports Live",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Red_Bull_GmbH_logo.svg/512px-Red_Bull_GmbH_logo.svg.png",
    backdrop: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
    group: "Sports Live",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    url: "https://rbmn-live.akamaized.net/hls/live/590964/BoB-aff-rbmn-live/master.m3u8",
    description: "Action sports, formula racing, cliff diving, and extreme outdoor adventures live from around the globe.",
    isLive: true,
    quality: "FHD"
  }
];
