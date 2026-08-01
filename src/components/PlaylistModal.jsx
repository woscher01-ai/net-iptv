import React, { useState } from 'react';
import { X, Link, Upload, FileText, Check, AlertCircle, Play } from 'lucide-react';
import { parseM3U } from '../utils/m3uParser';
import { DEMO_CHANNELS, DEMO_PLAYLIST_NAME } from '../data/demoChannels';

export default function PlaylistModal({ onClose, onLoadPlaylist, useCorsProxy }) {
  const [activeTab, setActiveTab] = useState('url');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError('');

    try {
      let fetchUrl = urlInput.trim();
      if (useCorsProxy) {
        fetchUrl = `https://corsproxy.io/?${encodeURIComponent(fetchUrl)}`;
      }

      const res = await fetch(fetchUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch playlist (HTTP Status ${res.status})`);
      }
      const text = await res.text();
      const parsedChannels = parseM3U(text);

      if (parsedChannels.length === 0) {
        throw new Error('No valid streams or #EXTINF entries found in M3U file.');
      }

      onLoadPlaylist({
        name: playlistName.trim() || 'Custom M3U Playlist',
        channels: parsedChannels
      });
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error fetching or parsing M3U URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsedChannels = parseM3U(text);
        if (parsedChannels.length === 0) {
          throw new Error('No valid channels found in uploaded M3U file.');
        }

        onLoadPlaylist({
          name: playlistName.trim() || file.name.replace(/\.[^/.]+$/, ""),
          channels: parsedChannels
        });
        onClose();
      } catch (err) {
        setError(err.message || 'Failed to parse M3U file.');
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('File reading failed.');
      setLoading(false);
    };
    reader.readAsText(file);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    setLoading(true);
    setError('');

    try {
      const parsedChannels = parseM3U(textInput);
      if (parsedChannels.length === 0) {
        throw new Error('No valid channels found in pasted text.');
      }

      onLoadPlaylist({
        name: playlistName.trim() || 'Pasted M3U Playlist',
        channels: parsedChannels
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDemo = () => {
    onLoadPlaylist({
      name: DEMO_PLAYLIST_NAME,
      channels: DEMO_CHANNELS
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span>Add M3U Playlist</span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Tab Navigation */}
          <div className="tab-nav">
            <button
              className={`tab-btn ${activeTab === 'url' ? 'active' : ''}`}
              onClick={() => setActiveTab('url')}
            >
              <Link size={14} style={{ display: 'inline', marginRight: '6px' }} />
              M3U URL
            </button>
            <button
              className={`tab-btn ${activeTab === 'file' ? 'active' : ''}`}
              onClick={() => setActiveTab('file')}
            >
              <Upload size={14} style={{ display: 'inline', marginRight: '6px' }} />
              Upload File
            </button>
            <button
              className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
              onClick={() => setActiveTab('text')}
            >
              <FileText size={14} style={{ display: 'inline', marginRight: '6px' }} />
              Paste Text
            </button>
          </div>

          {error && (
            <div style={{ background: 'rgba(229, 9, 20, 0.15)', border: '1px solid #E50914', padding: '10px 14px', borderRadius: '6px', color: '#fff', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} color="#E50914" />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Playlist Name (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. My Favorite Sports Pack"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
          </div>

          {/* URL Tab */}
          {activeTab === 'url' && (
            <form onSubmit={handleUrlSubmit}>
              <div className="form-group">
                <label className="form-label">M3U or M3U8 Playlist URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://example.com/playlist.m3u"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-netflix"
                style={{ width: '100%', marginTop: '12px' }}
                disabled={loading}
              >
                {loading ? 'Fetching & Parsing...' : 'Load M3U URL'}
              </button>
            </form>
          )}

          {/* File Upload Tab */}
          {activeTab === 'file' && (
            <div className="form-group">
              <label className="form-label">Select .m3u / .m3u8 / .txt file</label>
              <label className="file-dropzone">
                <Upload size={32} color="#E50914" style={{ marginBottom: '8px' }} />
                <p style={{ fontSize: '14px', color: '#fff', fontWeight: '600' }}>
                  Click to browse or drag & drop M3U file
                </p>
                <span style={{ fontSize: '12px', color: '#888' }}>Supports .m3u, .m3u8, .txt</span>
                <input
                  type="file"
                  accept=".m3u,.m3u8,.txt"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          )}

          {/* Direct Text Tab */}
          {activeTab === 'text' && (
            <form onSubmit={handleTextSubmit}>
              <div className="form-group">
                <label className="form-label">Paste M3U Content</label>
                <textarea
                  className="form-input"
                  rows={6}
                  placeholder={`#EXTM3U\n#EXTINF:-1 tvg-logo="https://logo.png" group-title="News", Live News\nhttps://stream.m3u8`}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-netflix"
                style={{ width: '100%', marginTop: '12px' }}
                disabled={loading}
              >
                {loading ? 'Parsing...' : 'Parse Raw M3U'}
              </button>
            </form>
          )}

          {/* Demo Channels Preset Button */}
          <div className="sample-playlists">
            <div className="sample-title">Preset Quick Load</div>
            <div className="sample-chips">
              <button className="chip" onClick={handleLoadDemo}>
                <Play size={12} style={{ marginRight: '4px', fill: '#E50914', color: '#E50914' }} />
                Load StreamFlix Demo Channels (CORS Verified)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
