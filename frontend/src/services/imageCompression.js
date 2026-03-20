import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

/**
 * Image Compression Service
 * Handles client-side image compression and upload with progress tracking
 */

/**
 * Compression targets
 */
const COMPRESSION_TARGETS = {
  thumbnail: {
    maxWidth: 300,
    maxHeight: 300,
    quality: 0.7,
  },
  upload: {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.8,
  },
  highQuality: {
    maxWidth: 2560,
    maxHeight: 2560,
    quality: 0.85,
  },
};

/**
 * Calculate new dimensions maintaining aspect ratio
 * @param {number} width - Original width
 * @param {number} height - Original height
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {Object} New dimensions {width, height}
 */
const calculateDimensions = (width, height, maxWidth, maxHeight) => {
  const aspectRatio = width / height;

  let newWidth = width;
  let newHeight = height;

  // Scale down if needed
  if (width > maxWidth) {
    newWidth = maxWidth;
    newHeight = newWidth / aspectRatio;
  }

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * aspectRatio;
  }

  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight),
  };
};

/**
 * Compress a single image
 * @param {string} uri - Image URI
 * @param {Object} options - Compression options
 * @returns {Promise<Object>} Compressed image info
 */
export const compressImage = async (uri, options = {}) => {
  try {
    // Get original image info
    const imageInfo = await FileSystem.getInfoAsync(uri);
    if (!imageInfo.exists) {
      throw new Error('Image file not found');
    }

    // Default to 'upload' preset
    const preset = options.preset || 'upload';
    const compressionSettings = COMPRESSION_TARGETS[preset] || COMPRESSION_TARGETS.upload;

    // Get image dimensions
    const { width, height } = options;
    if (!width || !height) {
      throw new Error('Image dimensions required for compression');
    }

    // Calculate new dimensions
    const newDimensions = calculateDimensions(
      width,
      height,
      compressionSettings.maxWidth,
      compressionSettings.maxHeight
    );

    // Prepare manipulation actions
    const actions = [];

    // Resize if needed
    if (newDimensions.width !== width || newDimensions.height !== height) {
      actions.push({
        resize: newDimensions,
      });
    }

    // Compress image
    const compressedImage = await ImageManipulator.manipulateAsync(
      uri,
      actions,
      {
        compress: compressionSettings.quality,
        format: ImageManipulator.SaveFormat.JPEG, // Always convert to JPEG for consistency
      }
    );

    // Get compressed file info
    const compressedInfo = await FileSystem.getInfoAsync(compressedImage.uri);

    // Calculate compression ratio
    const originalSize = imageInfo.size;
    const compressedSize = compressedInfo.size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

    return {
      uri: compressedImage.uri,
      width: compressedImage.width,
      height: compressedImage.height,
      originalSize,
      compressedSize,
      compressionRatio: Math.round(compressionRatio),
      format: 'jpeg',
    };

  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error(`Image compression failed: ${error.message}`);
  }
};

/**
 * Compress multiple images
 * @param {Array} images - Array of image objects with uri, width, height
 * @param {Object} options - Compression options
 * @param {Function} onProgress - Progress callback (current, total)
 * @returns {Promise<Array>} Array of compressed image info
 */
export const compressImages = async (images, options = {}, onProgress = null) => {
  const compressedImages = [];
  const total = images.length;

  for (let i = 0; i < images.length; i++) {
    try {
      const image = images[i];
      const compressed = await compressImage(image.uri, {
        ...options,
        width: image.width,
        height: image.height,
      });

      compressedImages.push({
        ...compressed,
        originalUri: image.uri,
        index: i,
      });

      // Report progress
      if (onProgress) {
        onProgress(i + 1, total);
      }

    } catch (error) {
      console.error(`Error compressing image ${i}:`, error);
      // Continue with other images
      compressedImages.push({
        error: error.message,
        originalUri: images[i].uri,
        index: i,
      });
    }
  }

  return compressedImages;
};

/**
 * Create thumbnail from image
 * @param {string} uri - Image URI
 * @param {Object} dimensions - Image dimensions {width, height}
 * @returns {Promise<Object>} Thumbnail info
 */
export const createThumbnail = async (uri, dimensions) => {
  return await compressImage(uri, {
    ...dimensions,
    preset: 'thumbnail',
  });
};

/**
 * Upload image with progress tracking
 * @param {string} uri - Image URI
 * @param {string} uploadUrl - Upload endpoint URL
 * @param {Object} options - Upload options
 * @param {Function} onProgress - Progress callback (percentage)
 * @returns {Promise<Object>} Upload response
 */
export const uploadImage = async (uri, uploadUrl, options = {}, onProgress = null) => {
  try {
    const uploadOptions = {
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: options.fieldName || 'media',
      httpMethod: 'POST',
      headers: options.headers || {},
    };

    // Create upload task
    const uploadTask = FileSystem.createUploadTask(
      uploadUrl,
      uri,
      uploadOptions,
      (data) => {
        // Progress callback
        if (onProgress && data.totalBytesSent && data.totalBytesExpectedToSend) {
          const percentage = (data.totalBytesSent / data.totalBytesExpectedToSend) * 100;
          onProgress(Math.round(percentage));
        }
      }
    );

    // Execute upload
    const result = await uploadTask.uploadAsync();

    if (result.status !== 200 && result.status !== 201) {
      throw new Error(`Upload failed with status ${result.status}`);
    }

    return {
      success: true,
      status: result.status,
      data: result.body ? JSON.parse(result.body) : null,
    };

  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

/**
 * Upload multiple images with retry logic
 * @param {Array} images - Array of compressed images
 * @param {string} uploadUrl - Upload endpoint URL
 * @param {Object} options - Upload options
 * @param {Function} onProgress - Progress callback (current, total, percentage)
 * @returns {Promise<Array>} Array of upload results
 */
export const uploadImages = async (images, uploadUrl, options = {}, onProgress = null) => {
  const uploadResults = [];
  const total = images.length;
  const maxRetries = options.maxRetries || 3;

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    let retries = 0;
    let uploaded = false;

    while (retries < maxRetries && !uploaded) {
      try {
        const result = await uploadImage(
          image.uri,
          uploadUrl,
          options,
          (percentage) => {
            if (onProgress) {
              onProgress(i + 1, total, percentage);
            }
          }
        );

        uploadResults.push({
          ...result,
          imageIndex: i,
          originalUri: image.originalUri,
        });

        uploaded = true;

      } catch (error) {
        retries++;
        console.error(`Upload attempt ${retries} failed for image ${i}:`, error);

        if (retries >= maxRetries) {
          uploadResults.push({
            success: false,
            error: error.message,
            imageIndex: i,
            originalUri: image.originalUri,
          });
        } else {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        }
      }
    }
  }

  return uploadResults;
};

/**
 * Compress and upload images in one operation
 * @param {Array} images - Array of original images
 * @param {string} uploadUrl - Upload endpoint URL
 * @param {Object} options - Options for compression and upload
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Results {compressed, uploaded}
 */
export const compressAndUpload = async (images, uploadUrl, options = {}, onProgress = null) => {
  try {
    // Step 1: Compress images
    const compressed = await compressImages(
      images,
      options.compression,
      (current, total) => {
        if (onProgress) {
          onProgress({
            stage: 'compress',
            current,
            total,
            percentage: Math.round((current / total) * 50), // 0-50%
          });
        }
      }
    );

    // Filter out failed compressions
    const validCompressed = compressed.filter(img => !img.error);

    if (validCompressed.length === 0) {
      throw new Error('All images failed to compress');
    }

    // Step 2: Upload compressed images
    const uploaded = await uploadImages(
      validCompressed,
      uploadUrl,
      options.upload,
      (current, total, uploadPercentage) => {
        if (onProgress) {
          const basePercentage = 50; // Compression complete
          const uploadProgress = (current / total) * 50; // 50-100%
          onProgress({
            stage: 'upload',
            current,
            total,
            percentage: Math.round(basePercentage + uploadProgress),
          });
        }
      }
    );

    return {
      compressed,
      uploaded,
      totalSize: validCompressed.reduce((sum, img) => sum + img.compressedSize, 0),
      successCount: uploaded.filter(result => result.success).length,
      failureCount: uploaded.filter(result => !result.success).length,
    };

  } catch (error) {
    console.error('Error in compress and upload:', error);
    throw error;
  }
};

/**
 * Clean up temporary compressed images
 * @param {Array} compressedImages - Array of compressed image objects
 */
export const cleanupCompressedImages = async (compressedImages) => {
  for (const image of compressedImages) {
    try {
      if (image.uri && image.uri.includes('ImageManipulator')) {
        await FileSystem.deleteAsync(image.uri, { idempotent: true });
      }
    } catch (error) {
      console.warn('Error cleaning up compressed image:', error);
    }
  }
};

export default {
  compressImage,
  compressImages,
  createThumbnail,
  uploadImage,
  uploadImages,
  compressAndUpload,
  cleanupCompressedImages,
  COMPRESSION_TARGETS,
};
