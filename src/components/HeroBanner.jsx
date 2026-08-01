import React, { useState } from 'react';
import { Play, Heart, Tv } from 'lucide-react';

export default function HeroBanner({ channel, onPlayChannel, isFavorite, onToggleFavorite }) {
  const [backdropError, setBackdropError] = useState(false);

  if (!channel) return null;

  const defaultBackdrop = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1400&q=80";
  const backdropUrl = (!backdropError && channel.backdrop) ? channel.backdrop : defaultBackdrop;

  return (
    <div
      className="hero"
      style={{ backgroundImage: `url(${backdropUrl})` }}
      onError={() => setBackdropError(true)}
    >
      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="hero-tag">
          <Tv size={14} />
          <span>SPOTLIGHT IPTV CHANNEL</span>
        </div>

        <h1 className="hero-title">{channel.name}</h1>

        <div className="hero-meta">
          {channel.flag && <span style={{ fontSize: '16px' }}>{channel.flag}</span>}
          {channel.isLive !== false && <span className="badge-live">LIVE</span>}
          <span className="badge-quality">{channel.quality || "HD 1080p"}</span>
          <span className="hero-group">• {channel.group || "General"}</span>
        </div>

        <p className="hero-description">
          {channel.description || `Watch ${channel.name} live stream now in high definition. Part of the ${channel.group || 'IPTV'} group collection.`}
        </p>

        <div className="hero-actions">
          <button className="btn btn-netflix" onClick={() => onPlayChannel(channel)}>
            <Play size={20} fill="#fff" />
            <span>Play Stream</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => onToggleFavorite(channel.id)}
          >
            <Heart
              size={18}
              fill={isFavorite(channel.id) ? "#E50914" : "none"}
              color={isFavorite(channel.id) ? "#E50914" : "#fff"}
            />
            <span>{isFavorite(channel.id) ? "In My List" : "My List"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
