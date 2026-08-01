import React, { useState } from 'react';
import { Play, Heart } from 'lucide-react';

export default function ChannelCard({ channel, onPlayChannel, isFavorite, onToggleFavorite }) {
  const [logoError, setLogoError] = useState(false);
  const [backdropError, setBackdropError] = useState(false);

  const bgGradients = [
    'linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)',
    'linear-gradient(135deg, #232526 0%, #414345 100%)',
    'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    'linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)',
    'linear-gradient(135deg, #141e30 0%, #243b55 100%)'
  ];

  const bgIndex = (channel.id.length + (channel.name ? channel.name.length : 0)) % bgGradients.length;
  const cardBgStyle = (channel.backdrop && !backdropError)
    ? { backgroundImage: `url(${channel.backdrop})` }
    : { background: bgGradients[bgIndex] };

  const favorite = isFavorite(channel.id);

  return (
    <div
      className="channel-card"
      onClick={() => onPlayChannel(channel)}
    >
      <div
        className="card-bg"
        style={cardBgStyle}
        onError={() => setBackdropError(true)}
      >
        <div className="card-gradient" />

        {/* Flag badge top right */}
        {channel.flag && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              zIndex: 10,
              fontSize: '16px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))'
            }}
            title={channel.country}
          >
            {channel.flag}
          </div>
        )}

        {/* Play Icon on Hover */}
        <div className="card-play-icon">
          <Play size={22} fill="#fff" style={{ marginLeft: '2px' }} />
        </div>

        {/* Channel Logo or Fallback Text */}
        {channel.logo && !logoError ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="card-logo"
            onError={() => setLogoError(true)}
            loading="lazy"
          />
        ) : (
          <div className="card-placeholder-logo">
            {channel.name ? channel.name.substring(0, 12) : "TV"}
          </div>
        )}
      </div>

      <div className="card-info">
        <h4 className="card-title">{channel.name}</h4>
        <div className="card-footer">
          <span className="card-group">
            {channel.group || "General"}
          </span>
          <div className="card-actions">
            <button
              className={`card-fav-btn ${favorite ? 'active' : ''}`}
              title={favorite ? "Remove from Favorites" : "Add to Favorites"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(channel.id);
              }}
            >
              <Heart
                size={16}
                fill={favorite ? "#E50914" : "none"}
                color={favorite ? "#E50914" : "#ffffff"}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
