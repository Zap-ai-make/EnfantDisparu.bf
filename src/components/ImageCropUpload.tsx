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
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Position de l'image (en %)
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setCropMode(true);
        setZoom(1);
        setRotation(0);
        setPosition({ x: 50, y: 50 }); // Centré par défaut
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Calculer le zoom minimum pour couvrir le carré
  const getMinZoom = useCallback(() => {
    if (!originalImage) return 1;
    const aspectRatio = originalImage.width / originalImage.height;
    // Le zoom minimum doit faire en sorte que l'image couvre tout le carré
    if (aspectRatio > 1) {
      // Image paysage : la hauteur doit couvrir le carré
      return 1;
    } else {
      // Image portrait : la largeur doit couvrir le carré
      return 1 / aspectRatio;
    }
  }, [originalImage]);

  const handleCrop = useCallback(async () => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Taille de sortie
    const outputSize = 800;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Calculer les dimensions de l'image zoomée
    const aspectRatio = originalImage.width / originalImage.height;
    let imgWidth: number, imgHeight: number;

    if (aspectRatio > 1) {
      // Image paysage
      imgHeight = outputSize * zoom;
      imgWidth = imgHeight * aspectRatio;
    } else {
      // Image portrait
      imgWidth = outputSize * zoom;
      imgHeight = imgWidth / aspectRatio;
    }

    // Position de l'image basée sur le pourcentage
    const maxOffsetX = (imgWidth - outputSize) / 2;
    const maxOffsetY = (imgHeight - outputSize) / 2;
    const offsetX = ((position.x - 50) / 50) * maxOffsetX;
    const offsetY = ((position.y - 50) / 50) * maxOffsetY;

    // Position pour centrer puis décaler
    const drawX = (outputSize - imgWidth) / 2 - offsetX;
    const drawY = (outputSize - imgHeight) / 2 - offsetY;

    // Appliquer la rotation si nécessaire
    if (rotation !== 0) {
      ctx.translate(outputSize / 2, outputSize / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-outputSize / 2, -outputSize / 2);
    }

    // Dessiner l'image
    ctx.drawImage(originalImage, drawX, drawY, imgWidth, imgHeight);

    // Réinitialiser la transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Amélioration de l'image
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const enhanced = enhanceImage(imageData);
    ctx.putImageData(enhanced, 0, 0);

    // Convertir en blob
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File([blob], "child-photo.jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        setPreviewUrl(URL.createObjectURL(blob));
        setCropMode(false);
        onImageCropped(file);
      },
      "image/jpeg",
      0.92
    );
  }, [originalImage, zoom, rotation, position, onImageCropped]);

  // Amélioration d'image
  const enhanceImage = (imageData: ImageData): ImageData => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    const enhanced = new ImageData(width, height);
    const enhancedData = enhanced.data;

    const contrastFactor = 1.15;
    const intercept = 128 * (1 - contrastFactor);

    for (let i = 0; i < data.length; i += 4) {
      enhancedData[i] = Math.min(255, Math.max(0, data[i] * contrastFactor + intercept));
      enhancedData[i + 1] = Math.min(255, Math.max(0, data[i + 1] * contrastFactor + intercept));
      enhancedData[i + 2] = Math.min(255, Math.max(0, data[i + 2] * contrastFactor + intercept));
      enhancedData[i + 3] = data[i + 3];
    }

    return enhanced;
  };

  const handleZoomChange = (delta: number) => {
    const minZoom = getMinZoom();
    setZoom((prev) => Math.min(3, Math.max(minZoom, prev + delta)));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Drag pour déplacer l'image
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;

    // Sensibilité du déplacement (plus de zoom = moins de mouvement nécessaire)
    const sensitivity = 100 / zoom;

    setPosition((prev) => ({
      x: Math.max(0, Math.min(100, prev.x - (deltaX / rect.width) * sensitivity)),
      y: Math.max(0, Math.min(100, prev.y - (deltaY / rect.height) * sensitivity)),
    }));

    setDragStart({ x: clientX, y: clientY });
  }, [isDragging, dragStart, zoom]);

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

  // Effect pour les événements globaux
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

  // Ajuster le zoom minimum quand l'image change
  useEffect(() => {
    if (originalImage) {
      const minZoom = getMinZoom();
      if (zoom < minZoom) {
        setZoom(minZoom);
      }
    }
  }, [originalImage, getMinZoom, zoom]);

  // Calculer le style de l'image pour l'affichage
  const getImageStyle = useCallback(() => {
    if (!originalImage) return {};

    const aspectRatio = originalImage.width / originalImage.height;

    // Calculer la taille pour couvrir le conteneur
    let width: string, height: string;
    if (aspectRatio > 1) {
      // Image paysage : hauteur = 100%, largeur proportionnelle
      height = `${zoom * 100}%`;
      width = `${zoom * 100 * aspectRatio}%`;
    } else {
      // Image portrait : largeur = 100%, hauteur proportionnelle
      width = `${zoom * 100}%`;
      height = `${zoom * 100 / aspectRatio}%`;
    }

    // Position basée sur le pourcentage
    const left = `${50 - position.x}%`;
    const top = `${50 - position.y}%`;

    return {
      width,
      height,
      left,
      top,
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
    };
  }, [originalImage, zoom, position, rotation]);

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

        {/* Zone de recadrage fixe avec image mobile */}
        <div
          ref={containerRef}
          className={cn(
            "relative w-full aspect-square max-w-md mx-auto bg-black rounded-xl overflow-hidden",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Image déplaçable */}
          <img
            src={originalImage.src}
            alt="Original"
            className="absolute pointer-events-none select-none"
            draggable={false}
            style={getImageStyle()}
          />

          {/* Overlay avec zone de crop visible */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Bordure de la zone de crop */}
            <div className="absolute inset-4 border-2 border-white/70 rounded-lg shadow-lg" />

            {/* Grille de composition (règle des tiers) */}
            <div className="absolute inset-4 grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-white/30" />
              <div className="border-r border-b border-white/30" />
              <div className="border-b border-white/30" />
              <div className="border-r border-b border-white/30" />
              <div className="border-r border-b border-white/30" />
              <div className="border-b border-white/30" />
              <div className="border-r border-white/30" />
              <div className="border-r border-white/30" />
              <div />
            </div>
          </div>

          {/* Indicateur de déplacement */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/80 rounded-full p-2 shadow-lg">
              <Move className="w-5 h-5 text-red-600" />
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
            <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">
              Glissez pour repositionner
            </span>
          </div>
        </div>

        {/* Contrôles */}
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
          Zoomez et déplacez l&apos;image pour cadrer le visage
        </p>

        {/* Canvas caché pour le traitement */}
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
