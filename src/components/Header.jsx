import React from 'react';
import { Search, Plus, Shield, ShieldOff, Globe, Layers, Activity, CheckCircle2 } from 'lucide-react';

export default function Header({
  searchTerm,
  setSearchTerm,
  onOpenPlaylistModal,
  activeFilter,
  setActiveFilter,
  viewMode,
  setViewMode,
  selectedCountry,
  setSelectedCountry,
  countriesList,
  useCorsProxy,
  setUseCorsProxy,
  favoritesCount,
  onRunHealthCheck,
  isCheckingHealth,
  healthCheckProgress,
  showOnlyWorking,
  setShowOnlyWorking
}) {
  return (
    <header className="navbar scrolled">
      <div className="nav-left">
        <div className="logo-container" onClick={() => { setActiveFilter('all'); setSelectedCountry('all'); }}>
          <span className="logo-text">STREAMFLIX</span>
          <span className="logo-badge">IPTV</span>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-item ${activeFilter === 'all' && selectedCountry === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveFilter('all'); setSelectedCountry('all'); }}
          >
            Home
          </button>

          <button
            className={`nav-item ${activeFilter === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveFilter('favorites')}
          >
            Favorites ({favoritesCount})
          </button>

          {/* Group View vs Country View Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#252525', borderRadius: '20px', padding: '2px', marginLeft: '8px' }}>
            <button
              className={`tab-btn ${viewMode === 'group' ? 'active' : ''}`}
              style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '16px' }}
              onClick={() => setViewMode('group')}
            >
              <Layers size={12} style={{ marginRight: '4px' }} />
              Categories
            </button>
            <button
              className={`tab-btn ${viewMode === 'country' ? 'active' : ''}`}
              style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '16px' }}
              onClick={() => setViewMode('country')}
            >
              <Globe size={12} style={{ marginRight: '4px' }} />
              Countries
            </button>
          </div>
        </nav>
      </div>

      <div className="nav-right">
        {/* Stream Health Check Button */}
        <button
          className={`btn ${showOnlyWorking ? 'btn-netflix' : 'btn-outline'}`}
          onClick={onRunHealthCheck}
          disabled={isCheckingHealth}
          title="Test stream availability across channels"
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          <Activity size={14} className={isCheckingHealth ? "spin-icon" : ""} />
          <span>
            {isCheckingHealth
              ? `Testing (${healthCheckProgress.current}/${healthCheckProgress.total})`
              : 'Test Streams'}
          </span>
        </button>

        {/* Working Channels Filter Toggle */}
        <button
          className={`chip ${showOnlyWorking ? 'active' : ''}`}
          style={{ background: showOnlyWorking ? '#22c55e' : '#282828', borderColor: showOnlyWorking ? '#22c55e' : 'rgba(255,255,255,0.2)', fontSize: '12px', padding: '6px 10px' }}
          onClick={() => setShowOnlyWorking(!showOnlyWorking)}
          title="Filter to display working channels only"
        >
          <CheckCircle2 size={13} style={{ marginRight: '4px' }} />
          Working Only
        </button>

        {/* Country Selector Dropdown */}
        {countriesList && countriesList.length > 0 && (
          <select
            className="form-input"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            style={{ width: 'auto', padding: '6px 12px', fontSize: '13px', background: '#222', borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <option value="all">🌍 All Countries</option>
            {countriesList.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        )}

        {/* Search Bar */}
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search channels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* CORS Proxy Toggle */}
        <button
          className={`btn-icon ${useCorsProxy ? 'active' : ''}`}
          title={useCorsProxy ? "CORS Proxy ENABLED" : "CORS Proxy DISABLED"}
          onClick={() => setUseCorsProxy(!useCorsProxy)}
          style={{ borderColor: useCorsProxy ? '#E50914' : 'rgba(255,255,255,0.2)' }}
        >
          {useCorsProxy ? <Shield size={18} color="#E50914" /> : <ShieldOff size={18} color="#aaa" />}
        </button>

        {/* Load Playlist Modal Button */}
        <button className="btn btn-netflix" onClick={onOpenPlaylistModal}>
          <Plus size={18} />
          <span>Add M3U</span>
        </button>
      </div>
    </header>
  );
}
