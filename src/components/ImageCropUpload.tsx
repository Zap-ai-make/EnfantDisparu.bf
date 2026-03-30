"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Crop, Check, X, ZoomIn, ZoomOut, RotateCw, Move } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCropUploadProps {
  onImageCropped: (file: File) => void;
  error?: string;
}

export function ImageCropUpload({ onImageCropped, error }: ImageCropUploadProps) {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setCropMode(true);

        // Initialize crop area to center square
        const size = Math.min(img.width, img.height);
        setCropArea({
          x: (img.width - size) / 2,
          y: (img.height - size) / 2,
          width: size,
          height: size,
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = useCallback(async () => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to cropped area
    const targetSize = 800; // Max dimension
    const scale = Math.min(targetSize / cropArea.width, targetSize / cropArea.height);
    canvas.width = cropArea.width * scale;
    canvas.height = cropArea.height * scale;

    // Apply rotation
    if (rotation !== 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    // Draw cropped image with zoom
    ctx.drawImage(
      originalImage,
      cropArea.x / zoom,
      cropArea.y / zoom,
      cropArea.width / zoom,
      cropArea.height / zoom,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Apply image enhancements
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const enhanced = enhanceImage(imageData);
    ctx.putImageData(enhanced, 0, 0);

    // Convert to blob
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        // Create File from blob
        const file = new File([blob], "child-photo.jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        // Set preview
        setPreviewUrl(URL.createObjectURL(blob));
        setCropMode(false);

        // Callback
        onImageCropped(file);
      },
      "image/jpeg",
      0.92 // High quality JPEG
    );
  }, [originalImage, cropArea, zoom, rotation, onImageCropped]);

  // Image enhancement: increase contrast and sharpness
  const enhanceImage = (imageData: ImageData): ImageData => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    // Create a copy
    const enhanced = new ImageData(width, height);
    const enhancedData = enhanced.data;

    // Apply contrast enhancement
    const contrastFactor = 1.15; // 15% increase
    const intercept = 128 * (1 - contrastFactor);

    for (let i = 0; i < data.length; i += 4) {
      // Enhance contrast on RGB channels
      enhancedData[i] = Math.min(255, Math.max(0, data[i] * contrastFactor + intercept)); // R
      enhancedData[i + 1] = Math.min(255, Math.max(0, data[i + 1] * contrastFactor + intercept)); // G
      enhancedData[i + 2] = Math.min(255, Math.max(0, data[i + 2] * contrastFactor + intercept)); // B
      enhancedData[i + 3] = data[i + 3]; // A (alpha)
    }

    // Apply simple sharpening using unsharp mask
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;

        for (let c = 0; c < 3; c++) {
          // Get neighboring pixels
          const center = enhancedData[idx + c];
          const top = enhancedData[((y - 1) * width + x) * 4 + c];
          const bottom = enhancedData[((y + 1) * width + x) * 4 + c];
          const left = enhancedData[(y * width + (x - 1)) * 4 + c];
          const right = enhancedData[(y * width + (x + 1)) * 4 + c];

          // Sharpen kernel
          const sharpened = center * 5 - (top + bottom + left + right);
          enhancedData[idx + c] = Math.min(255, Math.max(0, sharpened));
        }
      }
    }

    return enhanced;
  };

  const handleZoomChange = (delta: number) => {
    setZoom((prev) => Math.min(2, Math.max(0.5, prev + delta)));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Drag handlers pour déplacer la zone de recadrage
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !originalImage || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Calculer le déplacement en pixels relatifs à l'image
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;

    // Convertir le déplacement écran en déplacement image
    const scaleX = originalImage.width / rect.width;
    const scaleY = originalImage.height / rect.height;

    setCropArea((prev) => {
      const newX = Math.max(0, Math.min(originalImage.width - prev.width, prev.x - deltaX * scaleX));
      const newY = Math.max(0, Math.min(originalImage.height - prev.height, prev.y - deltaY * scaleY));
      return { ...prev, x: newX, y: newY };
    });

    setDragStart({ x: clientX, y: clientY });
  }, [isDragging, dragStart, originalImage]);

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  }, [handleDragMove]);

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, []);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, []);

  // Effect pour gérer les événements globaux de drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  if (cropMode && originalImage) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Recadrez et ajustez la photo</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setCropMode(false);
                setOriginalImage(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Annuler"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={handleCrop}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Check className="w-5 h-5" />
              Valider
            </button>
          </div>
        </div>

        {/* Crop preview */}
        <div
          ref={containerRef}
          className={cn(
            "relative w-full aspect-square max-w-md mx-auto bg-gray-100 rounded-xl overflow-hidden",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <img
            ref={imageRef}
            src={originalImage.src}
            alt="Original"
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: "center",
            }}
          />
          <div
            className="absolute border-2 border-red-500 bg-red-500/10 pointer-events-none"
            style={{
              left: `${(cropArea.x / originalImage.width) * 100}%`,
              top: `${(cropArea.y / originalImage.height) * 100}%`,
              width: `${(cropArea.width / originalImage.width) * 100}%`,
              height: `${(cropArea.height / originalImage.height) * 100}%`,
            }}
          >
            <div className="absolute inset-0 border-2 border-white/50" />
            {/* Indicateur de déplacement */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 rounded-full p-2 shadow-lg">
                <Move className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
          {/* Instructions */}
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">
              Glissez pour déplacer la zone
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-center">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <button
              type="button"
              onClick={() => handleZoomChange(-0.1)}
              className="p-1 hover:bg-gray-200 rounded"
              title="Dézoomer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-gray-700 w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => handleZoomChange(0.1)}
              className="p-1 hover:bg-gray-200 rounded"
              title="Zoomer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleRotate}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            title="Rotation 90°"
          >
            <RotateCw className="w-4 h-4" />
            Rotation
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          La photo sera automatiquement optimisée pour une meilleure qualité
        </p>

        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  return (
    <div>
      <label className="cursor-pointer block">
        {previewUrl ? (
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-red-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Prévisualisation" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-xs">Changer</span>
            </div>
          </div>
        ) : (
          <div className={cn(
            "w-32 h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:border-red-400 transition-colors",
            error ? "border-red-500 bg-red-50" : "border-gray-300 text-gray-400"
          )}>
            <Upload className="w-6 h-6" />
            <span className="text-xs">Ajouter photo</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileSelect}
        />
      </label>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {previewUrl && !cropMode && (
        <button
          type="button"
          onClick={() => {
            if (originalImage) {
              setCropMode(true);
            } else {
              fileInputRef.current?.click();
            }
          }}
          className="mt-2 flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          <Crop className="w-4 h-4" />
          Recadrer à nouveau
        </button>
      )}
    </div>
  );
}
