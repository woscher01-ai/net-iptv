import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  X, Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  PictureInPicture2, SkipBack, SkipForward, RefreshCw,
  Settings, Radio, AlertTriangle
} from 'lucide-react';

export default function VideoPlayerModal({
  channel,
  onClose,
  allChannels,
  onSelectChannel,
  useCorsProxy
}) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState(null);
  const [qualityLevels, setQualityLevels] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(-1);
  const [streamStats, setStreamStats] = useState({ resolution: 'Detecting...', bitrate: 'Auto' });

  // Compute final stream URL (optional CORS proxy)
  const getStreamUrl = () => {
    if (!channel || !channel.url) return '';
    if (useCorsProxy) {
      // CORS proxy wrapper
      return `https://corsproxy.io/?${encodeURIComponent(channel.url)}`;
    }
    return channel.url;
  };

  // Initialize HLS / Native Video Playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !channel) return;

    setError(null);
    setIsPlaying(false);
    setQualityLevels([]);

    const streamUrl = getStreamUrl();

    // Destroy existing Hls instance if any
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported() && (streamUrl.includes('.m3u8') || !video.canPlayType('application/vnd.apple.mpegurl'))) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        setQualityLevels(hls.levels);
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = hls.levels[data.level];
        if (level) {
          setStreamStats({
            resolution: `${level.width || 1920}x${level.height || 1080}`,
            bitrate: `${Math.round((level.bitrate || 0) / 1000)} kbps`
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.warn('HLS stream warning/error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error: Unable to fetch live stream chunks. Check internet or CORS permissions.');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Media playback error: Stream format unreadable.');
              hls.recoverMediaError();
              break;
            default:
              setError('Stream unavailable or blocked by server.');
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl') || video.canPlayType('video/mp4')) {
      // Native browser HLS/MP4 support
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
    } else {
      setError('HLS video playback is not supported in this browser.');
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [channel, useCorsProxy]);

  // Handle Controls Timeout (auto fade controls after 3s of mouse rest)
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3500);
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        togglePiP();
      } else if (e.key === 'Escape') {
        if (!document.fullscreenElement) {
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        playNextChannel();
      } else if (e.key === 'ArrowLeft') {
        playPrevChannel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, channel, allChannels]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    try {
      if (videoRef.current && document.pictureInPictureEnabled) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      }
    } catch (err) {
      console.warn('PiP failed:', err);
    }
  };

  const handleQualityChange = (e) => {
    const levelIdx = parseInt(e.target.value, 10);
    setCurrentQuality(levelIdx);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIdx;
    }
  };

  const currentIndex = allChannels.findIndex((c) => c.id === channel.id);

  const playPrevChannel = () => {
    if (allChannels.length === 0) return;
    const prevIdx = currentIndex <= 0 ? allChannels.length - 1 : currentIndex - 1;
    onSelectChannel(allChannels[prevIdx]);
  };

  const playNextChannel = () => {
    if (allChannels.length === 0) return;
    const nextIdx = currentIndex >= allChannels.length - 1 ? 0 : currentIndex + 1;
    onSelectChannel(allChannels[nextIdx]);
  };

  const handleRetry = () => {
    setError(null);
    if (hlsRef.current) {
      hlsRef.current.startLoad();
    } else if (videoRef.current) {
      videoRef.current.load();
    }
  };

  return (
    <div
      className="player-modal"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <div className="player-stage">
        <video
          ref={videoRef}
          className="player-video"
          playsInline
          onClick={togglePlay}
        />

        {/* Error Overlay */}
        {error && (
          <div className="error-container">
            <AlertTriangle size={48} color="#E50914" style={{ marginBottom: '12px' }} />
            <h3 className="error-title">Stream Error</h3>
            <p className="error-message">{error}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-netflix" onClick={handleRetry}>
                <RefreshCw size={16} />
                <span>Retry Stream</span>
              </button>
              <button className="btn btn-secondary" onClick={onClose}>
                <span>Close Player</span>
              </button>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        <div className={`player-controls-overlay ${showControls ? '' : 'idle'}`}>
          {/* Top Bar */}
          <div className="player-top-bar">
            <div className="player-channel-info">
              {channel.logo && (
                <img src={channel.logo} alt={channel.name} className="player-channel-logo" />
              )}
              <div>
                <h3 className="player-channel-name">{channel.name}</h3>
                <span style={{ fontSize: '12px', color: '#aaa' }}>{channel.group || 'IPTV Stream'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="btn-icon" onClick={onClose} title="Close Player (Esc)">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="player-bottom-bar">
            {/* Live Indicator Line */}
            <div className="player-progress-container">
              <div className="player-progress-bar" style={{ width: '100%' }} />
            </div>

            <div className="player-control-buttons">
              {/* Left Controls */}
              <div className="controls-group">
                <button className="btn-icon" onClick={togglePlay} title={isPlaying ? "Pause (Space)" : "Play (Space)"}>
                  {isPlaying ? <Pause size={22} /> : <Play size={22} fill="#fff" />}
                </button>

                <button className="btn-icon" onClick={playPrevChannel} title="Previous Channel (Left Arrow)">
                  <SkipBack size={20} />
                </button>

                <button className="btn-icon" onClick={playNextChannel} title="Next Channel (Right Arrow)">
                  <SkipForward size={20} />
                </button>

                <button className="btn-icon" onClick={toggleMute} title={isMuted ? "Unmute (M)" : "Mute (M)"}>
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '12px' }}>
                  <span className="badge-live">LIVE</span>
                  <span className="badge-quality">{streamStats.resolution}</span>
                </div>
              </div>

              {/* Right Controls */}
              <div className="controls-group">
                {/* Quality selector */}
                {qualityLevels.length > 0 && (
                  <select
                    className="form-input"
                    value={currentQuality}
                    onChange={handleQualityChange}
                    style={{ width: 'auto', padding: '4px 8px', fontSize: '12px' }}
                  >
                    <option value={-1}>Auto ({streamStats.bitrate})</option>
                    {qualityLevels.map((lvl, idx) => (
                      <option key={idx} value={idx}>
                        {lvl.height}p ({Math.round(lvl.bitrate / 1000)}k)
                      </option>
                    ))}
                  </select>
                )}

                <button className="btn-icon" onClick={togglePiP} title="Picture-in-Picture (P)">
                  <PictureInPicture2 size={20} />
                </button>

                <button className="btn-icon" onClick={toggleFullscreen} title="Fullscreen (F)">
                  {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
