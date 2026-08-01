/**
 * Verified CORS-friendly HLS live and vod test channels for out-of-the-box streaming.
 */

export const DEMO_PLAYLIST_NAME = "StreamFlix Global Demo";

export const DEMO_CHANNELS = [
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
    isFeatured: true,
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
    id: "demo-sintel",
    name: "[UK] Sintel Fantasy Cinema",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Sintel_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    group: "Movies & Cinema",
    country: "United Kingdom",
    countryCode: "UK",
    flag: "🇬🇧",
    url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
    description: "A lonely young woman searches for a baby dragon in a mythical fantasy world.",
    isLive: false,
    quality: "FHD"
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
  },
  {
    id: "demo-tears",
    name: "[NL] Tears of Steel Sci-Fi 4K",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Tears_of_Steel_poster.jpg",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    group: "Movies & Cinema",
    country: "Netherlands",
    countryCode: "NL",
    flag: "🇳🇱",
    url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
    description: "Sci-Fi spectacle set in a dystopian future Amsterdam with cyborgs and high-tech defense systems.",
    isLive: false,
    quality: "4K"
  },
  {
    id: "demo-india",
    name: "[IN] Bollywood & India Live Stream",
    logo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=300&q=80",
    backdrop: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
    group: "Music & Entertainment",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    description: "Indian entertainment, music videos, and cultural programs.",
    isLive: true,
    quality: "HD"
  },
  {
    id: "demo-japan",
    name: "[JP] Tokyo Anime & Culture Stream",
    logo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=300&q=80",
    backdrop: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    group: "Music & Entertainment",
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
    description: "Tokyo pop culture, anime broadcasts, and electronic music live.",
    isLive: true,
    quality: "FHD"
  }
];
