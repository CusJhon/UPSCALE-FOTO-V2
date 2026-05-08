'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  UploadCloud, Image as ImageIcon, Loader2, Download, AlertCircle, 
  RefreshCw, ArrowRight, Wand2, Zap, Sparkles, ChevronRight, 
  Github, Twitter, Linkedin, Menu, X, CheckCircle, Star, 
  Shield, Clock, Users, Camera, Music, Video, Layers, 
  Eye, Zap as ZapIcon, Cpu, Cloud, Lock
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import { CompareSlider } from './components/CompareSlider';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const features = [
  { icon: Camera, title: "Face Restoration", description: "Revive facial details with AI precision", color: "from-pink-500 to-rose-500" },
  { icon: Music, title: "Anime Upscale", description: "Perfect for illustrations and manga", color: "from-purple-500 to-indigo-500" },
  { icon: Layers, title: "Noise Reduction", description: "Remove grain and artifacts", color: "from-blue-500 to-cyan-500" },
  { icon: ZapIcon, title: "4K Export", description: "Crystal clear output quality", color: "from-yellow-500 to-orange-500" },
  { icon: Cloud, title: "Batch Processing", description: "Upscale multiple images at once", color: "from-emerald-500 to-teal-500" },
  { icon: Cpu, title: "AI Texture Recovery", description: "Restore lost details intelligently", color: "from-violet-500 to-purple-500" },
];

const faqs = [
  { q: "What image formats are supported?", a: "We support JPEG, PNG, WEBP, and HEIC formats up to 20MB per image." },
  { q: "Is my data private and secure?", a: "Yes, all images are processed securely and deleted immediately after processing." },
  { q: "How long does processing take?", a: "Typically 5-15 seconds depending on image size and server load." },
  { q: "What's the maximum resolution output?", a: "We support upscaling to 4K resolution (3840x2160)." },
  { q: "Do you offer API access?", a: "Yes, contact our sales team for enterprise API access." },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [showResultStats, setShowResultStats] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const processingMessages = [
    "Enhancing details...",
    "Restoring textures...",
    "Upscaling to 4K...",
    "Optimizing clarity...",
    "Finalizing output...",
  ];

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProcessingStage(prev => (prev + 1) % processingMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isProcessing, processingMessages.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processSelectedFile(file);
  };

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file. (JPEG, PNG, WEBP)');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setResultImage(null);
    setShowResultStats(false);
    const objectUrl = URL.createObjectURL(file);
    setOriginalPreview(objectUrl);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processSelectedFile(file);
  }, []);

  const handleUpscale = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/upscale', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong during upscaling.');
      if (data.url) setResultImage(data.url);
      else if (data.image) setResultImage(data.image);
      else throw new Error('No valid image returned from the API.');
      setShowResultStats(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    setOriginalPreview(null);
    setResultImage(null);
    setError(null);
    setShowResultStats(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = async () => {
    if (!resultImage) return;
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clarityhd_upscaled_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to download image", e);
      window.open(resultImage, '_blank');
    }
  };

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-navbar rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-lg opacity-50" />
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              ClarityHD
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {['Features', 'Technology', 'Pricing', 'Docs'].map((item) => (
              <a key={item} href="#" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                {item}
              </a>
            ))}
            <button
              onClick={() => setView('app')}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              Start Free
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-[72px] left-4 right-4 glass-navbar rounded-2xl p-4"
          >
            <div className="flex flex-col space-y-3">
              {['Features', 'Technology', 'Pricing', 'Docs'].map((item) => (
                <a key={item} href="#" className="text-gray-300 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-white/5">
                  {item}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setView('app');
                }}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium"
              >
                Start Free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  if (view === 'app') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <Navbar />
        
        <main className="pt-24 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-gray-300">AI Enhancement Studio</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
                Enhance Image Quality
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Upload your image and let our AI transform it into stunning high-definition
              </p>
            </motion.div>

            <div className="glass-panel rounded-3xl overflow-hidden">
              {!originalPreview ? (
                <div className="p-8 sm:p-12 lg:p-16">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/webp"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div
                      className={`relative border-2 border-dashed rounded-3xl flex flex-col items-center justify-center py-16 sm:py-20 transition-all duration-300 ${
                        isDragOver
                          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
                          : 'border-gray-700 hover:border-indigo-500/50 hover:bg-white/5'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse" />
                        <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-full mb-6">
                          <UploadCloud className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Drop your image here</h3>
                      <p className="text-sm text-gray-400">Supports JPG, PNG, WEBP up to 20MB</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Original</span>
                        <span className="text-xs text-gray-500">{selectedFile && `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`}</span>
                      </div>
                      <div className="relative aspect-square bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
                        <Image
                          src={originalPreview}
                          alt="Original Preview"
                          fill
                          className="object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-indigo-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          AI Enhanced
                        </span>
                        {resultImage && <span className="text-xs text-green-400">Ready</span>}
                      </div>
                      <div className={`relative aspect-square rounded-2xl overflow-hidden border transition-all duration-500 ${resultImage ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/20' : 'border-gray-800 bg-gray-900/50'}`}>
                        {resultImage ? (
                          <Image
                            src={resultImage}
                            alt="Upscaled Result"
                            fill
                            className="object-contain"
                            referrerPolicy="no-referrer"
                            unoptimized={resultImage.startsWith('data:')}
                          />
                        ) : isProcessing ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90">
                            <div className="relative">
                              <div className="w-16 h-16 border-4 border-gray-700 rounded-full" />
                              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
                            </div>
                            <p className="text-indigo-400 mt-4 font-medium">{processingMessages[processingStage]}</p>
                            <div className="w-48 h-1 bg-gray-800 rounded-full mt-4 overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                                animate={{ width: ["0%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-sm text-red-400">Failed to process image</h5>
                          <p className="text-sm text-red-300/90 mt-0.5">{error}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {showResultStats && resultImage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 p-4 bg-white/5 rounded-2xl"
                    >
                      {[
                        { label: "Resolution", value: "4K UHD" },
                        { label: "Quality Score", value: "98%" },
                        { label: "Processing", value: "< 10s" },
                        { label: "Enhancement", value: "4x" },
                      ].map((stat, i) => (
                        <div key={i} className="text-center">
                          <div className="text-white font-semibold">{stat.value}</div>
                          <div className="text-xs text-gray-400">{stat.label}</div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={resetState}
                      disabled={isProcessing}
                      className="px-6 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white font-medium hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Another
                    </button>
                    {!resultImage ? (
                      <button
                        onClick={handleUpscale}
                        disabled={isProcessing}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            Upscale to HD
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleDownload}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Result
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="w-full text-center py-6 mt-auto border-t border-white/10">
          <p className="text-sm text-gray-500 font-medium tracking-wide">
            SYSTEM DEVELOPED BY <span className="text-indigo-500 font-bold ml-1">SANN404 FORUM</span>
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero overflow-x-hidden">
      <Navbar />

      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] animate-float-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-[120px] animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[150px] animate-pulse-glow" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="text-center"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-gray-200">Powered by Advanced AI Enhancement</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight"
            >
              <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent">
                Transform Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Images to 4K Magic
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mt-6"
            >
              Experience the future of image enhancement. Our AI instantly upscales low-resolution photos into stunning high-definition masterpieces.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            >
              <button
                onClick={() => setView('app')}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Creating
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-2xl glass-panel text-white font-semibold text-lg hover:bg-white/10 transition-all">
                Watch Demo
              </button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-white/10"
            >
              {[
                { value: "100K+", label: "Images Enhanced" },
                { value: "4K", label: "Max Resolution" },
                { value: "98%", label: "Quality Score" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-scroll" />
          </div>
        </div>
      </section>

      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-gray-300">Powerful Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-4">
              Advanced AI technology packed with professional-grade features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-6 rounded-2xl glass-card hover:glow-card transition-all duration-500"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-2.5 mb-4`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-gray-300">See The Difference</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Before & After
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel rounded-3xl p-4 sm:p-6"
          >
            <CompareSlider />
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-gray-300">Trusted Worldwide</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Loved by 100,000+ Creators
              </h2>
              <p className="text-gray-400 mb-6">
                Join thousands of photographers, designers, and artists who trust ClarityHD for their image enhancement needs.
              </p>
              <div className="flex items-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
                <span className="text-white ml-2">4.9/5</span>
                <span className="text-gray-400">(2,500+ reviews)</span>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-300">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-300">GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-300">5s Avg Processing</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: "100K+", label: "Images Enhanced" },
                { value: "4.9/5", label: "User Rating" },
                { value: "98%", label: "Accuracy" },
                { value: "180+", label: "Countries" },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-6 text-center rounded-2xl">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400">
              Everything you need to know about ClarityHD
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer p-5 list-none">
                    <span className="font-semibold text-white">{faq.q}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-5 pb-5 pt-0 text-gray-400 border-t border-white/10 mt-2 pt-4">
                    {faq.a}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ClarityHD</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transform blurry images into ultra HD using advanced AI technology.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 ClarityHD. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}