import React, { useRef, useState, useEffect, useCallback } from "react";
import Hls from "hls.js";
import { Play, Pause, RotateCcw, RotateCw, Maximize, Volume2, VolumeX, Settings, PictureInPicture, Monitor } from "lucide-react";
import "./VideoPlayer.css";

const VideoPlayer = ({ videoData }) => {
  const videoRef = useRef(null), hlsRef = useRef(null), controlsTimeoutRef = useRef(null), containerRef = useRef(null);
  const [playerState, setPlayerState] = useState({ isPlaying: false, progress: 0, duration: 0, currentTime: 0, volume: 1, isMuted: false, playbackRate: 1, error: null, isFullscreen: false, isPiP: false, currentQuality: 'auto', availableQualities: [] });
  const [uiState, setUiState] = useState({ showControls: true, showVolume: false, showSettings: false, showQuality: false });
  const [showPlayPause, setShowPlayPause] = useState(false);

  const initPlayer = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !videoData?._id) return;
  
    try {
      const manifestUrl = `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'}/api/videos/stream/${videoData._id}/master.m3u8`;
      console.log('Loading manifest from:', manifestUrl);
  
      const verifyManifest = async (url, retries = 2) => {
        for (let i = 0; i < retries; i++) {
          try {
            const response = await fetch(url, {
              method: 'GET',
              mode: 'cors',
              credentials: 'omit',
              headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/vnd.apple.mpegurl'
              }
            });
  
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const text = await response.text();
            if (!text.includes('#EXTM3U')) throw new Error('Invalid HLS manifest format');
            console.log('Manifest verification successful');
            return true;
          } catch (error) {
            console.warn(`Manifest verification attempt ${i + 1} failed:`, error);
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
          }
        }
      };
  
      await verifyManifest(manifestUrl);
  
      if (Hls.isSupported()) {
        if (hlsRef.current) hlsRef.current.destroy();
  
        const hls = new Hls({
          maxMaxBufferLength: 600,
          maxBufferSize: 60 * 1000 * 1000,
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 30,
          xhrSetup: (xhr) => {
            xhr.withCredentials = false;
            xhr.setRequestHeader('Cache-Control', 'no-cache');
          }
        });
  
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          if (data.fatal) {
            switch(data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setPlayerState(prev => ({ ...prev, error: 'Network error - attempting to reconnect...' }));
                setTimeout(() => hls.startLoad(), 3000);
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                setPlayerState(prev => ({ ...prev, error: `Playback error: ${data.details}` }));
                hls.destroy();
            }
          }
        });
  
        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          const qualities = data.levels.map((level, index) => ({
            id: index,
            height: level.height,
            name: `${level.height}p`,
            bandwidth: level.bitrate,
            width: level.width
          }));
  
          setPlayerState(prev => ({
            ...prev,
            availableQualities: qualities,
            currentQuality: 'auto',
            error: null,
            duration: data.levels[0].duration
          }));
  
          const attemptPlay = (attempts = 0) => {
            video.play()
              .then(() => setPlayerState(prev => ({ ...prev, isPlaying: true })))
              .catch(err => {
                if (attempts < 2) {
                  video.muted = true;
                  attemptPlay(attempts + 1);
                } else {
                  setPlayerState(prev => ({ ...prev, error: 'Click to play (autoplay blocked)' }));
                }
              });
          };
          attemptPlay();
        });
  
        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          const quality = hls.levels[data.level]?.height + 'p' || 'auto';
          setPlayerState(prev => ({ ...prev, currentQuality: quality }));
        });
  
        hls.loadSource(manifestUrl);
        hls.attachMedia(video);
        hlsRef.current = hls;
  
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = manifestUrl;
        video.addEventListener('loadedmetadata', () => {
          setPlayerState(prev => ({ ...prev, duration: video.duration, error: null }));
          video.play().catch(err => {
            video.muted = true;
            video.play().catch(e => {
              setPlayerState(prev => ({ ...prev, error: 'Click to play (autoplay blocked)' }));
            });
          });
        });
      } else {
        throw new Error("Your browser doesn't support HLS streaming");
      }
    } catch (err) {
      console.error('Player initialization error:', err);
      let errorMessage = err.message;
      if (err.message.includes('404')) errorMessage = 'Video not found on server';
      else if (err.message.includes('CORS')) errorMessage = 'Network error (check CORS configuration)';
  
      setPlayerState(prev => ({ ...prev, error: errorMessage, isPlaying: false }));
    }
  }, [videoData?._id]);

  const togglePlayPause = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (video.paused) {
        await video.play();
        setPlayerState(prev => ({ ...prev, error: null }));
      } else video.pause();
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        video.muted = true;
        await video.play().catch(e => setPlayerState(prev => ({ ...prev, error: "Click to play (autoplay blocked)" })));
      } else setPlayerState(prev => ({ ...prev, error: err.message }));
    }
  
  }, []);

  const changeQuality = useCallback((levelIndex) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
      setPlayerState(prev => ({ ...prev, currentQuality: levelIndex === -1 ? 'auto' : prev.availableQualities[levelIndex]?.name || 'auto' }));
      setUiState(prev => ({ ...prev, showQuality: false }));
    }
  }, []);

  const handleSeek = useCallback((e) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    video.currentTime = (e.target.value / 100) * video.duration;
  }, []);

  const handleVolumeChange = useCallback((e) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    video.muted = newVolume === 0;
    setPlayerState(prev => ({ ...prev, volume: newVolume, isMuted: newVolume === 0 }));
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }, []);

  const changePlaybackSpeed = useCallback((e) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = parseFloat(e.target.value);
    setPlayerState(prev => ({ ...prev, playbackRate: parseFloat(e.target.value) }));
  }, []);

  const togglePictureInPicture = useCallback(async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setPlayerState(prev => ({ ...prev, isPiP: false }));
      } else {
        await videoRef.current.requestPictureInPicture();
        setPlayerState(prev => ({ ...prev, isPiP: true }));
      }
    } catch (err) {
      console.error('PiP error:', err);
      setPlayerState(prev => ({ ...prev, error: "Picture-in-Picture not available" }));
    }
  }, []);

  const handleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setPlayerState(prev => ({ ...prev, isFullscreen: true }));
      } else {
        await document.exitFullscreen();
        setPlayerState(prev => ({ ...prev, isFullscreen: false }));
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
      setPlayerState(prev => ({ ...prev, error: "Fullscreen not available" }));
    }
  }, []);

  const handleMouseMove = useCallback(() => {
    setUiState(prev => ({ ...prev, showControls: true }));
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setUiState(prev => ({ ...prev, showControls: false })), 3000);
  }, []);

  const formatTime = useCallback((time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, []);

  useEffect(() => {
    initPlayer();
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) setPlayerState(prev => ({
        ...prev,
        currentTime: video.currentTime,
        progress: (video.currentTime / video.duration) * 100,
        duration: video.duration
      }));
    };

    const showPlayPauseIcon = () => {
      setShowPlayPause(true);
      setTimeout(() => setShowPlayPause(false), 1000);
    };

    const eventListeners = {
      timeupdate: handleTimeUpdate,
      play: () => setPlayerState(prev => ({ ...prev, isPlaying: true })),
      pause: () => setPlayerState(prev => ({ ...prev, isPlaying: false })),
      volumechange: () => setPlayerState(prev => ({ ...prev, volume: video.volume, isMuted: video.muted })),
      error: () => setPlayerState(prev => ({ ...prev, error: `Video error: ${video.error?.message || 'Unknown error'}` }))
    };

    Object.entries(eventListeners).forEach(([event, handler]) => video.addEventListener(event, handler));
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      Object.entries(eventListeners).forEach(([event, handler]) => video.removeEventListener(event, handler));
    };
  }, [initPlayer]);

  const { isPlaying, progress, duration, currentTime, volume, isMuted, playbackRate, error, isFullscreen, isPiP, currentQuality, availableQualities } = playerState;
  const { showControls, showVolume, showSettings, showQuality } = uiState;

  return (
    <div ref={containerRef} className={`video-container ${isFullscreen ? 'fullscreen' : ''}`} onMouseMove={handleMouseMove} onMouseLeave={() => setUiState(prev => ({ ...prev, showControls: false }))} tabIndex="0" onClick={togglePlayPause}>
      <div className="video-wrapper">
        <video ref={videoRef} className="video-element" onClick={(e) => { e.stopPropagation(); togglePlayPause(); setShowPlayPause(true); setTimeout(() => setShowPlayPause(false), 1000); }} playsInline webkit-playsinline="true" preload="auto" />
        
        {error && <div className="video-error"><p>{error}</p><button onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button></div>}
  
        <div className={`play-pause-flash ${showPlayPause ? 'visible' : ''}`}>{isPlaying ? <Pause size={48} /> : <Play size={48} />}</div>
  
        <div className={`video-overlay ${showControls ? "active" : ""}`}>
          <button className="backward-btn" onClick={(e) => { e.stopPropagation(); videoRef.current.currentTime -= 5; }}><RotateCcw size={24} /></button>
          <button className="play-pause-btn" onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}>{isPlaying ? <Pause size={32} /> : <Play size={32} />}</button>
          <button className="forward-btn" onClick={(e) => { e.stopPropagation(); videoRef.current.currentTime += 5; }}><RotateCw size={24} /></button>
        </div>
  
        <div className={`controls ${showControls ? "" : "hide-controls"}`}>
          <div className="progress-container">
            <span className="time current-time">{formatTime(currentTime)}</span>
            <input type="range" min="0" max="100" value={progress} onChange={handleSeek} className="progress-bar" style={{ '--progress': `${progress}%` }} />
            <span className="time duration">{formatTime(duration)}</span>
          </div>
  
          <div className="controls-right">
            <div className="volume-control">
              <button className="volume-btn" onClick={(e) => { e.stopPropagation(); toggleMute(); }} onMouseEnter={() => setUiState(prev => ({ ...prev, showVolume: true }))} onMouseLeave={() => setUiState(prev => ({ ...prev, showVolume: false }))}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <div className={`volume-slider-container ${showVolume ? 'visible' : ''}`}>
                <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="volume-slider" style={{ '--volume': `${volume * 100}%` }} />
              </div>
            </div>
  
            <div className="settings-control">
              <button className="settings-btn" onClick={(e) => { e.stopPropagation(); setUiState(prev => ({ ...prev, showSettings: !showSettings, showQuality: false })); }}>
                <Settings size={20} />
              </button>
              {showSettings && <div className="settings-menu">
                <div className="settings-option">
                  <label>Speed:</label>
                  <select value={playbackRate} onChange={changePlaybackSpeed}>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => <option key={speed} value={speed}>{speed}x</option>)}
                  </select>
                </div>
              </div>}
            </div>
  
            {availableQualities.length > 0 && <div className="quality-control">
              <button className="quality-btn" onClick={(e) => { e.stopPropagation(); setUiState(prev => ({ ...prev, showQuality: !showQuality, showSettings: false })); }}>
                <Monitor size={20} />
                <span className="quality-label">{currentQuality}</span>
              </button>
              {showQuality && <div className="quality-menu">
                <button className={`quality-option ${currentQuality === 'auto' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); changeQuality(-1); }}>Auto</button>
                {availableQualities.map((quality, index) => (
                  <button key={quality.name} className={`quality-option ${currentQuality === quality.name ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); changeQuality(index); }}>{quality.name}</button>
                ))}
              </div>}
            </div>}
  
            <button className="pip-btn" onClick={(e) => { e.stopPropagation(); togglePictureInPicture(); }} disabled={!document.pictureInPictureEnabled}>
              <PictureInPicture size={20} />
            </button>
  
            <button className="fullscreen-btn" onClick={(e) => { e.stopPropagation(); handleFullscreen(); }}>
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;