'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Default placeholder images - Ganti dengan image actual Anda
const originalImage = '/example-original.jpg';
const enhancedImage = '/example-enhanced.jpg';

export const CompareSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number) => {
    const rect = document.getElementById('compare-container')?.getBoundingClientRect();
    if (rect) {
      let x = ((clientX - rect.left) / rect.width) * 100;
      x = Math.min(Math.max(x, 0), 100);
      setSliderPosition(x);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      id="compare-container"
      className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-ew-resize select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsDragging(false)}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* Enhanced Image (Full) */}
      <div className="absolute inset-0">
        <Image
          src={enhancedImage}
          alt="Enhanced - AI Upscaled Result"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-lg font-medium">
          ✨ AI Enhanced
        </div>
      </div>

      {/* Original Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="relative w-full h-full">
          <Image
            src={originalImage}
            alt="Original - Before Enhancement"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-lg font-medium">
            📷 Original
          </div>
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center cursor-ew-resize border-2 border-indigo-500/50">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
        </div>
      </div>

      {/* Instruction Tooltip */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full pointer-events-none">
        ← Drag to compare →
      </div>
    </div>
  );
};