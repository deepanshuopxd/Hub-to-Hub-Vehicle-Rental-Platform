const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const Tesseract = require('tesseract.js');
const streamifier = require('streamifier');

// Helper: Upload Buffer to Cloudinary
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: "vehicle-platform/kyc" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// @desc    Upload KYC Doc & Extract Text (OCR)
// @route   POST /api/kyc/upload
exports.uploadKYC = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // 1. Upload to Cloudinary
    const result = await uploadFromBuffer(req.file.buffer);
    const imageUrl = result.secure_url;

    // 2. Perform OCR (Text Extraction)
    console.log("Starting OCR processing...");
    const { data: { text } } = await Tesseract.recognize(imageUrl, 'eng');
    console.log("OCR Extracted:", text);

    // 3. Simple Regex to find a potential DL number (Format varies by country)
    // Example regex for generic 15-char alphanumeric (Adjust for India/USA)
    const dlRegex = /[A-Z]{2}[0-9]{13}/; 
    const match = text.match(dlRegex);
    const detectedDL = match ? match[0] : null;

    // 4. Update User Profile
    const user = await User.findById(req.user.id);
    user.kyc.dlImage = imageUrl;
    if (detectedDL) user.kyc.dlNumber = detectedDL;
    user.kyc.isVerified = false; // Admin must still manually approve
    await user.save();

    res.json({
      message: 'KYC Uploaded Successfully',
      imageUrl,
      extractedText: text,
      detectedDLNumber: detectedDL || "Could not auto-detect. Please enter manually."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'KYC Processing Failed' });
  }
};