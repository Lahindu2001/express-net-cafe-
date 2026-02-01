'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Upload, X, Check } from 'lucide-react';

interface ImageUploadProps {
  onUpload?: (imageUrl: string) => void;
  onChange?: (imageUrl: string) => void;
  value?: string;
  folder?: string;
  currentImage?: string;
  label?: string;
  className?: string;
}

export function ImageUpload({ 
  onUpload,
  onChange,
  value,
  folder = 'general', 
  currentImage,
  label = 'Upload Image',
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value || currentImage || '');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - support all common image formats
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, WebP, GIF)');
      return;
    }

    // Validate file size (max 10MB for business images)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (result.url) {
        setPreviewUrl(result.url);
        if (onUpload) onUpload(result.url);
        if (onChange) onChange(result.url);
        setUploadProgress(100);
        
        // Success feedback
        setTimeout(() => setUploadProgress(0), 2000);
      } else {
        console.error('Upload failed:', result.error);
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreviewUrl('');
    onUpload('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:font-medium"
          />
        </div>
        {previewUrl && (
          <Button 
            type="button"
            variant="ghost" 
            size="sm"
            onClick={clearImage}
            disabled={uploading}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Upload Status */}
      {uploading && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <div className="flex-1">
                <div className="text-sm text-blue-800 font-medium">Uploading to Cloudinary...</div>
                <div className="text-xs text-blue-600">Optimizing image for web</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Status */}
      {uploadProgress === 100 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-green-600" />
              <div className="text-sm text-green-800 font-medium">
                ✅ Image uploaded successfully!
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Image Preview */}
      {previewUrl && (
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Preview:</div>
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-w-xs h-32 object-cover rounded-lg border shadow-sm"
              />
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                Professional CDN
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              📦 Stored in Cloudinary • 💾 URL saved to Neon database
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Helper Text */}
      <div className="text-xs text-gray-400">
        💡 Supports: JPEG, PNG, WebP, GIF • Max: 10MB • Auto-optimized for web
      </div>
    </div>
  );
}