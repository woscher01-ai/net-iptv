import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CategoryRow from './components/CategoryRow';
import VideoPlayerModal from './components/VideoPlayerModal';
import PlaylistModal from './components/PlaylistModal';
import { DEMO_CHANNELS, DEMO_PLAYLIST_NAME } from './data/demoChannels';
import { COUNTRY_MAP } from './utils/m3uParser';
import { Tv, Sparkles, Globe, Layers } from 'lucide-react';

export default function App() {
  const [playlistName, setPlaylistName] = useState(() => {
    return localStorage.getItem('streamflix_playlist_name') || DEMO_PLAYLIST_NAME;
  });

  const [channels, setChannels] = useState(() => {
    const saved = localStorage.getItem('streamflix_channels');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved channels:', e);
      }
    }
    return DEMO_CHANNELS;
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('streamflix_favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return ['demo-bbb', 'demo-sintel'];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('group'); // 'group' or 'country'
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [useCorsProxy, setUseCorsProxy] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Persist channels and favorites
  useEffect(() => {
    localStorage.setItem('streamflix_channels', JSON.stringify(channels));
    localStorage.setItem('streamflix_playlist_name', playlistName);
  }, [channels, playlistName]);

  useEffect(() => {
    localStorage.setItem('streamflix_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const toggleFavorite = (channelId) => {
    setFavorites((prev) => {
      if (prev.includes(channelId)) {
        showToast('Removed from My List');
        return prev.filter((id) => id !== channelId);
      } else {
        showToast('Added to My List');
        return [...prev, channelId];
      }
    });
  };

  const isFavorite = (channelId) => favorites.includes(channelId);

  const handleLoadPlaylist = ({ name, channels: newChannels }) => {
    setPlaylistName(name);
    setChannels(newChannels);
    setActiveFilter('all');
    setSelectedCountry('all');
    setSearchTerm('');
    showToast(`Loaded ${newChannels.length} channels from ${name}`);
  };

  // Derive unique countries list from current loaded channels
  const countriesList = useMemo(() => {
    const uniqueMap = {};
    channels.forEach((c) => {
      if (c.countryCode && c.country && !uniqueMap[c.countryCode]) {
        uniqueMap[c.countryCode] = {
          code: c.countryCode,
          name: c.country,
          flag: c.flag || '🌍'
        };
      }
    });
    return Object.values(uniqueMap).sort((a, b) => a.name.localeCompare(b.name));
  }, [channels]);

  // Filter channels based on search, category filter, and country filter
  const filteredChannels = useMemo(() => {
    return channels.filter((c) => {
      const nameMatch = c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const groupMatch = c.group && c.group.toLowerCase().includes(searchTerm.toLowerCase());
      const countryMatch = c.country && c.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = nameMatch || groupMatch || countryMatch;

      if (!matchesSearch) return false;

      // Filter by selected country dropdown
      if (selectedCountry !== 'all' && c.countryCode !== selectedCountry) {
        return false;
      }

      if (activeFilter === 'favorites') {
        return favorites.includes(c.id);
      }
      if (activeFilter !== 'all') {
        return c.group && c.group.toLowerCase() === activeFilter.toLowerCase();
      }
      return true;
    });
  }, [channels, searchTerm, activeFilter, selectedCountry, favorites]);

  // Group channels by Category OR by Country depending on viewMode
  const groupedChannels = useMemo(() => {
    const groups = {};

    if (activeFilter === 'all' && favorites.length > 0 && selectedCountry === 'all' && !searchTerm) {
      const favChannels = channels.filter((c) => favorites.includes(c.id));
      if (favChannels.length > 0) {
        groups['My Favorites List'] = favChannels;
      }
    }

    filteredChannels.forEach((channel) => {
      let key = 'General';
      if (viewMode === 'country') {
        key = channel.country ? `${channel.flag || '🌍'} ${channel.country}` : '🌍 International';
      } else {
        key = channel.group || 'General';
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(channel);
    });

    return groups;
  }, [filteredChannels, activeFilter, viewMode, selectedCountry, favorites, searchTerm, channels]);

  const heroChannel = useMemo(() => {
    const featured = channels.find((c) => c.isFeatured);
    return featured || channels[0] || null;
  }, [channels]);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenPlaylistModal={() => setShowPlaylistModal(true)}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        countriesList={countriesList}
        useCorsProxy={useCorsProxy}
        setUseCorsProxy={setUseCorsProxy}
        favoritesCount={favorites.length}
      />

      {/* Hero Spotlight Section */}
      {heroChannel && activeFilter === 'all' && selectedCountry === 'all' && !searchTerm && (
        <HeroBanner
          channel={heroChannel}
          onPlayChannel={(c) => setActiveChannel(c)}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {/* Main Content Area - Category or Country Carousels */}
      <main className="main-content" style={{ marginTop: (activeFilter === 'all' && selectedCountry === 'all' && !searchTerm) ? '-80px' : '90px' }}>
        {/* Country Quick Pills Bar when in Country Mode */}
        {viewMode === 'country' && countriesList.length > 0 && (
          <div style={{ padding: '0 4% 20px 4%', display: 'flex', gap: '10px', overflowX: 'auto' }} className="no-scrollbar">
            <button
              className={`chip ${selectedCountry === 'all' ? 'active' : ''}`}
              style={{ background: selectedCountry === 'all' ? '#E50914' : '#282828' }}
              onClick={() => setSelectedCountry('all')}
            >
              🌍 All Countries ({channels.length})
            </button>
            {countriesList.map((c) => (
              <button
                key={c.code}
                className="chip"
                style={{ background: selectedCountry === c.code ? '#E50914' : '#282828' }}
                onClick={() => setSelectedCountry(c.code)}
              >
                {c.flag} {c.name}
              </button>
            ))}
          </div>
        )}

        {Object.keys(groupedChannels).length > 0 ? (
          Object.entries(groupedChannels).map(([groupTitle, groupChannels]) => (
            <CategoryRow
              key={groupTitle}
              title={groupTitle}
              channels={groupChannels}
              onPlayChannel={(c) => setActiveChannel(c)}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          <div className="empty-state">
            <Tv size={56} className="empty-icon" />
            <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px' }}>
              No channels found
            </h3>
            <p style={{ fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px auto' }}>
              {searchTerm
                ? `No channels matching "${searchTerm}". Try a different search term.`
                : 'No channels matching the selected country or filter.'}
            </p>
            <button className="btn btn-netflix" onClick={() => { setSelectedCountry('all'); setActiveFilter('all'); setSearchTerm(''); }}>
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Video Streaming Modal */}
      {activeChannel && (
        <VideoPlayerModal
          channel={activeChannel}
          allChannels={channels}
          onClose={() => setActiveChannel(null)}
          onSelectChannel={(ch) => setActiveChannel(ch)}
          useCorsProxy={useCorsProxy}
        />
      )}

      {/* Load Playlist Modal */}
      {showPlaylistModal && (
        <PlaylistModal
          onClose={() => setShowPlaylistModal(false)}
          onLoadPlaylist={handleLoadPlaylist}
          useCorsProxy={useCorsProxy}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast">
          <Sparkles size={16} color="#E50914" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
