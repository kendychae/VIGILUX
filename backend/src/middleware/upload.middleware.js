const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// File signature validation
const fileSignatures = {
  'image/jpeg': [
    [0xFF, 0xD8, 0xFF, 0xE0],
    [0xFF, 0xD8, 0xFF, 0xE1],
    [0xFF, 0xD8, 0xFF, 0xE2],
    [0xFF, 0xD8, 0xFF, 0xE8]
  ],
  'image/png': [
    [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]
  ],
  'video/mp4': [
    [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70],
    [0x00, 0x00, 0x00, 0x1C, 0x66, 0x74, 0x79, 0x70],
    [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70]
  ]
};

// Validate file signature (magic number)
function validateFileSignature(buffer, mimeType) {
  const signatures = fileSignatures[mimeType];
  if (!signatures) return false;

  for (const signature of signatures) {
    let match = true;
    for (let i = 0; i < signature.length; i++) {
      if (buffer[i] !== signature[i]) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }

  return false;
}

// Configure memory storage (files stored in memory as Buffer)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'video/mp4'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.mp4'];

  // Check MIME type
  if (!allowedMimes.includes(file.mimetype)) {
    return cb(
      new Error(
        'Invalid file type. Only JPEG, PNG, and MP4 files are allowed.'
      ),
      false
    );
  }

  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(
      new Error(
        'Invalid file extension. Only .jpg, .jpeg, .png, and .mp4 extensions are allowed.'
      ),
      false
    );
  }

  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB max per file
    files: 5 // Maximum 5 files per request
  },
  fileFilter: fileFilter
});

// Middleware to validate file signatures after upload
const validateFileSignatures = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    for (const file of req.files) {
      // Validate file signature matches MIME type
      const isValid = validateFileSignature(file.buffer, file.mimetype);

      if (!isValid) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: `File "${file.originalname}" appears to be corrupted or has an invalid file type. The file signature does not match the expected format.`
        });
      }

      // Additional size checks based on file type
      if (file.mimetype.startsWith('image/') && file.size > 10 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: `Image file "${file.originalname}" exceeds the 10 MB size limit.`
        });
      }

      if (file.mimetype.startsWith('video/') && file.size > 50 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: `Video file "${file.originalname}" exceeds the 50 MB size limit.`
        });
      }
    }

    next();
  } catch (error) {
    console.error('File signature validation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An error occurred while validating uploaded files.'
    });
  }
};

// Error handler for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: 'Payload Too Large',
        message: 'File size exceeds the maximum limit of 50 MB per file.'
      });
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Maximum 5 files allowed per upload.'
      });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Unexpected file field in request.'
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Upload Error',
      message: err.message
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      error: 'Upload Error',
      message: err.message
    });
  }

  next();
};

// Generate secure filename
function generateSecureFilename(originalFilename) {
  const ext = path.extname(originalFilename).toLowerCase();
  const uuid = crypto.randomUUID();
  return `${uuid}${ext}`;
}

// Add metadata to uploaded files
const enrichFileMetadata = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  req.files = req.files.map(file => ({
    ...file,
    secureFilename: generateSecureFilename(file.originalname),
    uploadedAt: new Date().toISOString(),
    userId: req.user?.id || null
  }));

  next();
};

module.exports = {
  upload,
  validateFileSignatures,
  handleMulterError,
  enrichFileMetadata,
  generateSecureFilename
};
