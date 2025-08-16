import React, { useState, useEffect } from "react";
import "./VideoList.css";

const VideoList = ({ onVideoSelect }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/videos");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          if (data.videos && Array.isArray(data.videos)) {
            setVideos(data.videos);
          } else {
            throw new Error("Invalid API response format");
          }
        } else {
          setVideos(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoUpload = async (event) => {
    const formData = new FormData();
    formData.append("video", event.target.files[0]);
    
    try {
      const response = await fetch("http://localhost:3000/api/videos/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed! Status: ${response.status}`);
      }
      
      const newVideo = await response.json();
      setVideos((prevVideos) => [newVideo, ...prevVideos]);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading videos...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Error loading videos: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="video-list-container">
      <h2 className="video-list-title">Available Videos</h2>
      
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      
      {videos.length === 0 ? (
        <div className="no-videos">No videos found</div>
      ) : (
        <ul className="video-list">
          {videos.map((video) => (
            <li 
              key={video._id} 
              className="video-item"
              onClick={() => onVideoSelect(video)}
            >
              <div className="video-title">{video.title}</div>
              {video.description && (
                <div className="video-description">{video.description}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VideoList;
