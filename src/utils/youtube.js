/**
 * YouTube Utility Functions
 * Handles YouTube URL parsing and embed generation
 */

/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 */
export const extractYouTubeId = (url) => {
  if (!url) return null;
  
  // If it's already just an ID
  if (!url.includes('youtube.com') && !url.includes('youtu.be') && /^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  
  // Standard watch URL
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/);
  if (watchMatch) return watchMatch[1];
  
  // Short URL
  const shortMatch = url.match(/youtu\.be\/([^&\n?#]+)/);
  if (shortMatch) return shortMatch[1];
  
  return null;
};

/**
 * Check if URL is a YouTube link
 */
export const isYouTubeLink = (url) => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be') || /^[a-zA-Z0-9_-]{11}$/.test(url);
};

/**
 * Get YouTube embed URL
 */
export const getYouTubeEmbedUrl = (url) => {
  const videoId = extractYouTubeId(url);
  if (!videoId) return url;
  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * Get YouTube watch URL
 */
export const getYouTubeWatchUrl = (url) => {
  const videoId = extractYouTubeId(url);
  if (!videoId) return url;
  return `https://www.youtube.com/watch?v=${videoId}`;
};

/**
 * Get YouTube thumbnail URL
 */
export const getYouTubeThumbnail = (url, quality = 'mqdefault') => {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  
  const qualities = {
    'default': 'default',
    'mqdefault': 'mqdefault',
    'hqdefault': 'hqdefault',
    'sddefault': 'sddefault',
    'maxresdefault': 'maxresdefault'
  };
  
  const qualityKey = qualities[quality] || 'mqdefault';
  return `https://img.youtube.com/vi/${videoId}/${qualityKey}.jpg`;
};

