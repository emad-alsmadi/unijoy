const axios = require('axios');

// Service to upload images to free hosting services and return URLs
class ImageUploadService {
  
  // Method 1: Using ImgBB (Free Image Hosting)
  static async uploadToImgBB(base64Image) {
    try {
      const apiKey = process.env.IMGBB_API_KEY || 'c6c00b7f5c5d1f7d0b4e8d4b5e5d5f5e'; // Free API key
      
      const formData = new FormData();
      formData.append('key', apiKey);
      formData.append('image', base64Image.split(',')[1]); // Remove data:image/...;base64, prefix
      
      const response = await axios.post('https://api.imgbb.com/1/upload', formData);
      
      if (response.data.success) {
        return {
          success: true,
          url: response.data.data.url,
          thumbnailUrl: response.data.data.thumb.url,
          deleteUrl: response.data.data.delete_url
        };
      } else {
        throw new Error('ImgBB upload failed');
      }
    } catch (error) {
      console.error('ImgBB upload error:', error);
      return { success: false, error: error.message };
    }
  }

  // Method 2: Using Postimages (Free, no API key needed)
  static async uploadToPostImages(base64Image) {
    try {
      // Convert base64 to buffer
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Create FormData for Postimages
      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('upload', buffer, 'image.jpg');
      formData.append('private', 'false');
      
      const response = await axios.post('https://postimages.org/api/upload', formData, {
        headers: {
          ...formData.getHeaders()
        }
      });
      
      if (response.data.success) {
        return {
          success: true,
          url: response.data.url,
          thumbnailUrl: response.data.thumbnail_url
        };
      } else {
        throw new Error('Postimages upload failed');
      }
    } catch (error) {
      console.error('Postimages upload error:', error);
      return { success: false, error: error.message };
    }
  }

  // Method 3: Using FreeImageHost (Free, no API key)
  static async uploadToFreeImageHost(base64Image) {
    try {
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      
      const response = await axios.post('https://freeimage.host/api/1/upload', {
        key: '6d207e02198a8478dbb5ea6d5ceb3112',
        action: 'upload',
        source: base64Data,
        format: 'json'
      });
      
      if (response.data.success) {
        return {
          success: true,
          url: response.data.image.url,
          thumbnailUrl: response.data.thumb.url
        };
      } else {
        throw new Error('FreeImageHost upload failed');
      }
    } catch (error) {
      console.error('FreeImageHost upload error:', error);
      return { success: false, error: error.message };
    }
  }

  // Main upload method - tries multiple services
  static async uploadImage(base64Image) {
    console.log('Starting image upload...');
    
    // Try ImgBB first
    let result = await this.uploadToImgBB(base64Image);
    if (result.success) {
      console.log('ImgBB upload successful:', result.url);
      return result;
    }
    
    // Try Postimages as backup
    console.log('Trying Postimages...');
    result = await this.uploadToPostImages(base64Image);
    if (result.success) {
      console.log('Postimages upload successful:', result.url);
      return result;
    }
    
    // Try FreeImageHost as last resort
    console.log('Trying FreeImageHost...');
    result = await this.uploadToFreeImageHost(base64Image);
    if (result.success) {
      console.log('FreeImageHost upload successful:', result.url);
      return result;
    }
    
    // If all fail, return default image
    console.log('All upload services failed, using default image');
    return {
      success: true,
      url: this.getDefaultImageUrl(),
      isDefault: true
    };
  }

  // Get default image if all uploads fail
  static getDefaultImageUrl() {
    const defaultImages = [
      'https://images.unsplash.com/photo-1492684228672-755b87908021?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1479222724629-152724b6e765?w=800&h=600&fit=crop'
    ];
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  }
}

module.exports = ImageUploadService;
