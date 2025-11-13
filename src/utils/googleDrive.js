/**
 * Google Drive Utility Functions
 * Converts Google Drive share links to direct download and embed URLs
 */

/**
 * Extract file ID from Google Drive share link
 * Supports multiple formats:
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - FILE_ID (if already extracted)
 */
export const extractFileId = (url) => {
  if (!url) return null;
  
  // If it's already just an ID
  if (!url.includes('drive.google.com') && !url.includes('/')) {
    return url;
  }
  
  // Extract from /file/d/FILE_ID/view or /file/d/FILE_ID
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  
  // Extract from ?id=FILE_ID
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];
  
  // Extract from /uc?id=FILE_ID
  const ucMatch = url.match(/\/uc\?id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) return ucMatch[1];
  
  return null;
};

/**
 * Convert Google Drive share link to direct download URL
 * @param {string} shareLink - Google Drive share link
 * @returns {string} Direct download URL
 */
export const getDownloadUrl = (shareLink) => {
  const fileId = extractFileId(shareLink);
  if (!fileId) return shareLink; // Return original if can't extract
  
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

/**
 * Convert Google Drive share link to embed/view URL
 * @param {string} shareLink - Google Drive share link
 * @returns {string} Embed URL for PDF viewer
 */
export const getEmbedUrl = (shareLink) => {
  const fileId = extractFileId(shareLink);
  if (!fileId) return shareLink; // Return original if can't extract
  
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

/**
 * Convert Google Drive share link to direct view URL (for iframe)
 * @param {string} shareLink - Google Drive share link
 * @returns {string} Direct view URL
 */
export const getViewUrl = (shareLink) => {
  const fileId = extractFileId(shareLink);
  if (!fileId) return shareLink;
  
  return `https://drive.google.com/file/d/${fileId}/view`;
};

/**
 * Validate if a URL is a Google Drive link
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export const isGoogleDriveLink = (url) => {
  if (!url) return false;
  return url.includes('drive.google.com') || /^[a-zA-Z0-9_-]+$/.test(url);
};

/**
 * Get all URLs for a Google Drive file
 * @param {string} shareLink - Google Drive share link
 * @returns {object} Object with downloadUrl, embedUrl, viewUrl, and fileId
 */
export const getDriveUrls = (shareLink) => {
  const fileId = extractFileId(shareLink);
  
  if (!fileId) {
    return {
      fileId: null,
      downloadUrl: shareLink,
      embedUrl: shareLink,
      viewUrl: shareLink,
      shareLink: shareLink
    };
  }
  
  return {
    fileId,
    downloadUrl: getDownloadUrl(shareLink),
    embedUrl: getEmbedUrl(shareLink),
    viewUrl: getViewUrl(shareLink),
    shareLink: shareLink
  };
};

