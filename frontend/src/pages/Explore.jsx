import React, { useRef, useState, useEffect } from 'react';
import { Instagram, Film, Heart, Share2, Play, Pause, Volume2, VolumeX, Camera, ArrowUpRight, Sparkles, Compass } from 'lucide-react';
import ThreeDLogoEmblem from '../components/common/ThreeDLogoEmblem';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import api from '../services/api';

const Explore = () => {
  const [playingState, setPlayingState] = useState({});
  const [mutedState, setMutedState] = useState({});
  const [exploreContent, setExploreContent] = useState(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    try {
      const local = localStorage.getItem('mhp_explore_content');
      if (local) {
        setExploreContent(JSON.parse(local));
      }
    } catch (e) {}

    api.get('/explore-content')
      .then(res => {
        if (res.data) setExploreContent(res.data);
      })
      .catch(() => {});
  }, []);

  // Gallery items default schema (for 5-6 editorial placeholder spaces)
  const defaultGalleryItems = [
    {
      id: 1,
      title: "The Heartbeat Near N Block",
      category: "Quadrangle Dining & Atmosphere",
      sub: "MHP Central Plaza",
      aspect: "landscape-large",
      image: ""
    },
    {
      id: 2,
      title: "Chef's Special Counters",
      category: "Signature Prep",
      sub: "Fresh Daily",
      aspect: "portrait-tall",
      image: ""
    },
    {
      id: 3,
      title: "Student Gatherings",
      category: "Campus Break",
      sub: "Afternoon Chai & Snack",
      aspect: "square-medium",
      image: ""
    },
    {
      id: 4,
      title: "Authentic Campus Moments",
      category: "Editorial Portrait",
      sub: "VFSTR Life",
      aspect: "portrait-tall",
      image: ""
    },
    {
      id: 5,
      title: "Flavors & Good Vibes",
      category: "Refreshed Daily",
      sub: "Specialty Cuisine",
      aspect: "landscape-wide",
      image: ""
    }
  ];

  // Vertical Reels default schema (4-5 vertical 9:16 videos)
  const defaultVideos = [
    {
      id: 1,
      title: "Campus Evening Vibes",
      tag: "DAILY MOMENTS",
      src: "/videos/mhp_hero_video.mp4",
      featured: true
    },
    {
      id: 2,
      title: "Biryani & Conversations",
      tag: "SIGNATURE DISHES",
      src: "/videos/WhatsApp%20Video%202026-08-27%20at%209.02.26%20PM.mp4",
      featured: false
    },
    {
      id: 3,
      title: "Synergy Open Mic Night",
      tag: "STUDENT STAGE",
      src: "/videos/mhp_hero_video.mp4",
      featured: false
    },
    {
      id: 4,
      title: "Mahotsav Prep & Fest Stalls",
      tag: "CAMPUS FESTIVAL",
      src: "/videos/WhatsApp%20Video%202026-08-27%20at%209.02.26%20PM.mp4",
      featured: false
    }
  ];

  const galleryHeader = exploreContent?.gallery || {};
  const galleryItems = exploreContent?.gallery?.items && exploreContent.gallery.items.length > 0 
    ? exploreContent.gallery.items 
    : defaultGalleryItems;

  const reelsHeader = exploreContent?.reels || {};
  const videoList = exploreContent?.reels?.videos && exploreContent.reels.videos.length > 0 
    ? exploreContent.reels.videos 
    : defaultVideos;

  const brandHeading = exploreContent?.brandStatement?.heading || "EAT. MEET. REMEMBER. THAT'S MHP.";
  const brandTagline = exploreContent?.brandStatement?.tagline || "More than a place to eat. A part of campus life.";

  const togglePlay = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPlayingState(prev => ({ ...prev, [index]: true }));
    } else {
      video.pause();
      setPlayingState(prev => ({ ...prev, [index]: false }));
    }
  };

  const toggleMute = (index, e) => {
    e.stopPropagation();
    const video = videoRefs.current[index];
    if (!video) return;
    video.muted = !video.muted;
    setMutedState(prev => ({ ...prev, [index]: video.muted }));
  };

  return (
    <div className="bg-[#FFF7E8] text-[#202522] min-h-screen selection:bg-[#F47B20] selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. GALLERY SECTION — "INSIDE MHP" */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-20 space-y-12">
        
        {/* Section Header */}
        <div className="text-left space-y-3 border-b border-[#7D967E]/20 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#183A2A]/5 border border-[#183A2A]/10 text-[#183A2A] text-xs font-extrabold tracking-widest uppercase">
            <Compass className="w-3.5 h-3.5 text-[#F47B20]" />
            <span>{galleryHeader.eyebrow || "INSIDE MHP"}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-[#183A2A] tracking-tight">
                {galleryHeader.heading || "GALLERY"}
              </h1>
              <p className="text-sm sm:text-base text-[#7D967E] font-medium max-w-2xl pt-2">
                {galleryHeader.subtitle || "A glimpse into the food, people and moments that make MHP special."}
              </p>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#183A2A]/70 bg-[#FFFFFF] px-4 py-2 rounded-2xl border border-[#7D967E]/30 shadow-xs">
              <Camera className="w-4 h-4 text-[#F47B20]" />
              <span>Editorial Visual Story</span>
            </div>
          </div>
        </div>

        {/* Editorial Asymmetric Composition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* SLOT 1: Large Featured Landscape Visual (Col-Span 8) */}
          <div className="md:col-span-8 bg-[#FFFFFF] rounded-3xl border border-[#7D967E]/30 overflow-hidden shadow-md group relative min-h-[22rem] sm:min-h-[28rem] flex flex-col justify-end p-6 sm:p-8 transition-all duration-500 hover:shadow-xl hover:border-[#183A2A]/40">
            {galleryItems[0]?.image ? (
              <img
                src={getImageUrl(galleryItems[0].image, 'dining')}
                alt={galleryItems[0].title}
                onError={(e) => handleImageError(e, 'dining')}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              /* Polished Architectural Placeholder Texture */
              <div className="absolute inset-0 bg-gradient-to-br from-[#183A2A]/8 via-[#7D967E]/12 to-[#183A2A]/15 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#183A2A_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="w-20 h-20 rounded-full border border-[#183A2A]/20 flex items-center justify-center bg-[#FFFFFF]/40 backdrop-blur-md">
                  <Camera className="w-8 h-8 text-[#183A2A]/40" />
                </div>
              </div>
            )}

            {/* Subtle Gradient Readability Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#183A2A]/90 via-[#183A2A]/20 to-transparent pointer-events-none" />

            {/* Tag Badge */}
            <div className="absolute top-5 left-5 bg-[#183A2A] text-[#FFF7E8] text-[10px] font-extrabold tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-xs border border-[#FFF7E8]/20 z-10">
              {galleryItems[0]?.sub || "MHP Central Plaza"}
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 space-y-1.5 text-white">
              <span className="text-xs font-bold text-[#F47B20] uppercase tracking-wider block">
                {galleryItems[0]?.category || "Quadrangle Dining & Atmosphere"}
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#FFF7E8] tracking-tight">
                {galleryItems[0]?.title || "The Heartbeat Near N Block"}
              </h2>
            </div>
          </div>

          {/* SLOT 2: Tall Portrait Visual (Col-Span 4) */}
          <div className="md:col-span-4 bg-[#FFFFFF] rounded-3xl border border-[#7D967E]/30 overflow-hidden shadow-md group relative min-h-[22rem] sm:min-h-[28rem] flex flex-col justify-end p-6 transition-all duration-500 hover:shadow-xl hover:border-[#183A2A]/40">
            {galleryItems[1]?.image ? (
              <img
                src={getImageUrl(galleryItems[1].image, 'starter')}
                alt={galleryItems[1].title}
                onError={(e) => handleImageError(e, 'starter')}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F47B20]/10 via-[#FFF7E8] to-[#183A2A]/10 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F47B20_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="w-16 h-16 rounded-full border border-[#F47B20]/30 flex items-center justify-center bg-[#FFFFFF]/40 backdrop-blur-md">
                  <Sparkles className="w-6 h-6 text-[#F47B20]/50" />
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#183A2A]/90 via-[#183A2A]/20 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-1 text-white">
              <span className="text-[11px] font-bold text-[#F47B20] uppercase tracking-wider block">
                {galleryItems[1]?.category || "Signature Prep"}
              </span>
              <h3 className="font-display font-extrabold text-xl text-[#FFF7E8]">
                {galleryItems[1]?.title || "Chef's Special Counters"}
              </h3>
            </div>
          </div>

          {/* LOWER ROW: Dedicated Instagram Slot + Supporting Visuals */}

          {/* SLOT 3: RESERVED INSTAGRAM POST SLOT (Col-Span 4) */}
          <div className="md:col-span-4 bg-[#FFFFFF] rounded-3xl border-2 border-[#F47B20]/40 overflow-hidden shadow-lg p-6 flex flex-col justify-between relative group hover:border-[#F47B20] transition-all duration-500 min-h-[22rem]">
            {/* Header branding */}
            <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#F47B20] via-rose-500 to-purple-600 p-0.5 flex items-center justify-center text-white shadow-xs">
                  <div className="w-full h-full bg-[#FFFFFF] rounded-full p-0.5 flex items-center justify-center">
                    <Instagram className="w-4 h-4 text-[#F47B20]" />
                  </div>
                </div>
                <div>
                  <span className="text-xs font-extrabold text-[#183A2A] block leading-tight">
                    {galleryHeader.instagramHandle || "@mhp_vfstr"}
                  </span>
                  <span className="text-[10px] text-[#7D967E] font-bold block">
                    {galleryHeader.instagramSub || "Official Campus Handle"}
                  </span>
                </div>
              </div>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#FFF7E8] text-[#F47B20] hover:bg-[#F47B20] hover:text-white transition-colors border border-[#F47B20]/30"
                aria-label="Visit Instagram"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Instagram Media Container Space */}
            <div className="my-4 py-8 rounded-2xl bg-[#FFF7E8] border border-[#7D967E]/20 text-center flex flex-col items-center justify-center space-y-2 relative overflow-hidden group-hover:bg-[#FFF7E8]/80 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-[#F47B20] border border-[#F47B20]/20">
                <Instagram className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold text-[#183A2A] px-4">
                Official Instagram Post
              </span>
              <p className="text-[10px] text-[#7D967E] max-w-xs px-6 font-medium leading-relaxed">
                Reserved space for official campus Instagram embed.
              </p>
            </div>

            {/* Footer metadata */}
            <div className="flex items-center justify-between text-xs text-[#7D967E] pt-3 border-t border-[#7D967E]/20 font-bold">
              <div className="flex items-center gap-1.5 text-[#F47B20]">
                <Heart className="w-3.5 h-3.5 fill-[#F47B20]" />
                <span>Featured Memory</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5 text-[#7D967E]" />
                <span className="text-[10px]">VFSTR Campus</span>
              </div>
            </div>
          </div>

          {/* SLOT 4: Editorial Square Visual Slot (Col-Span 4) */}
          <div className="md:col-span-4 bg-[#FFFFFF] rounded-3xl border border-[#7D967E]/30 overflow-hidden shadow-md group relative min-h-[22rem] flex flex-col justify-end p-6 transition-all duration-500 hover:shadow-xl hover:border-[#183A2A]/40">
            {galleryItems[2]?.image ? (
              <img
                src={getImageUrl(galleryItems[2].image, 'breakfast')}
                alt={galleryItems[2].title}
                onError={(e) => handleImageError(e, 'breakfast')}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tl from-[#183A2A]/15 via-[#7D967E]/10 to-[#F47B20]/5 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#183A2A_1px,transparent_1px)] [background-size:18px_18px]" />
                <div className="w-16 h-16 rounded-full border border-[#183A2A]/30 flex items-center justify-center bg-[#FFFFFF]/40 backdrop-blur-md">
                  <Camera className="w-6 h-6 text-[#183A2A]/40" />
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#183A2A]/90 via-[#183A2A]/20 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-1 text-white">
              <span className="text-[11px] font-bold text-[#F47B20] uppercase tracking-wider block">
                {galleryItems[2]?.category || "Campus Break"}
              </span>
              <h3 className="font-display font-extrabold text-xl text-[#FFF7E8]">
                {galleryItems[2]?.title || "Student Gatherings"}
              </h3>
            </div>
          </div>

          {/* SLOT 5: Editorial Visual Slot (Col-Span 4) */}
          <div className="md:col-span-4 bg-[#FFFFFF] rounded-3xl border border-[#7D967E]/30 overflow-hidden shadow-md group relative min-h-[22rem] flex flex-col justify-end p-6 transition-all duration-500 hover:shadow-xl hover:border-[#183A2A]/40">
            {galleryItems[3]?.image ? (
              <img
                src={getImageUrl(galleryItems[3].image, 'burger')}
                alt={galleryItems[3].title}
                onError={(e) => handleImageError(e, 'burger')}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-[#183A2A]/5 via-[#7D967E]/15 to-[#183A2A]/20 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#7D967E_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="w-16 h-16 rounded-full border border-[#7D967E]/40 flex items-center justify-center bg-[#FFFFFF]/40 backdrop-blur-md">
                  <Sparkles className="w-6 h-6 text-[#7D967E]/60" />
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#183A2A]/90 via-[#183A2A]/20 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-1 text-white">
              <span className="text-[11px] font-bold text-[#F47B20] uppercase tracking-wider block">
                {galleryItems[3]?.category || "Editorial Portrait"}
              </span>
              <h3 className="font-display font-extrabold text-xl text-[#FFF7E8]">
                {galleryItems[3]?.title || "Authentic Campus Moments"}
              </h3>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. EVENTS & MEMORIES — VERTICAL REELS SECTION */}
      {/* ========================================================================= */}
      <section className="bg-[#183A2A] text-[#FFF7E8] py-20 sm:py-28 relative overflow-hidden">
        
        {/* Soft Ambient Background Lighting */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#204935] via-[#183A2A] to-[#0F261B] opacity-95" />
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#FFF7E8] to-transparent opacity-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7E8]/10 border border-[#7D967E]/30 text-[#F47B20] text-xs font-extrabold tracking-widest uppercase backdrop-blur-md">
              <Film className="w-3.5 h-3.5" />
              <span>{reelsHeader.eyebrow || "THE MOMENTS WE KEEP"}</span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#FFF7E8] tracking-tight">
              {reelsHeader.heading || "Events & Memories"}
            </h2>

            <p className="text-sm sm:text-base text-[#FFF7E8]/80 font-sans font-medium leading-relaxed max-w-2xl mx-auto">
              {reelsHeader.subtitle || "From celebrations and campus events to everyday moments, these are the memories that make MHP more than a place to eat."}
            </p>
          </div>

          {/* Vertical Reel Video Display (Editorial 9:16 Layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {videoList
              .filter(v => v.visible !== false)
              .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
              .map((v, index) => {
              const isFeatured = index === 0 || v.featured;
              const posterUrl = v.thumbnail ? getImageUrl(v.thumbnail) : '';
              return (
                <div 
                  key={v.id || index}
                  onClick={() => togglePlay(index)}
                  className={`group relative rounded-3xl bg-[#0F261B] border border-[#7D967E]/40 overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-[#F47B20] cursor-pointer flex flex-col justify-between aspect-[9/16] ${
                    isFeatured ? 'lg:scale-[1.03] lg:border-[#F47B20]/80 shadow-orange-950/40' : ''
                  }`}
                >
                  {/* Video Player or Reel Link Slot */}
                  {v.src && (v.src.endsWith('.mp4') || v.src.startsWith('/videos')) ? (
                    <>
                      <video
                        ref={el => videoRefs.current[index] = el}
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={posterUrl || undefined}
                        aria-label={v.title}
                        className="w-full h-full object-cover absolute inset-0 pointer-events-none"
                      >
                        <source src={v.src} type="video/mp4" />
                        {v.fallback && <source src={v.fallback} type="video/mp4" />}
                      </video>
                      {posterUrl && (
                        <img
                          src={posterUrl}
                          alt={v.title}
                          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 pointer-events-none z-0 ${
                            playingState[index] ? 'opacity-0' : 'opacity-100'
                          }`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                    </>
                  ) : v.src && v.src.includes('instagram.com') ? (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#204935] via-[#183A2A] to-[#0F261B] flex flex-col items-center justify-center p-6 text-center z-10">
                      {posterUrl && (
                        <img
                          src={posterUrl}
                          alt={v.title}
                          className="w-full h-full object-cover absolute inset-0 opacity-40 z-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F47B20] via-rose-500 to-purple-600 p-0.5 mb-3 flex items-center justify-center shadow-md relative z-10">
                        <div className="w-full h-full bg-[#183A2A] rounded-full flex items-center justify-center text-white">
                          <Instagram className="w-5 h-5 text-[#F47B20]" />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#FFF7E8] max-w-[12rem] line-clamp-2 relative z-10">{v.title}</span>
                      <a
                        href={v.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-4 px-3.5 py-1.5 rounded-xl bg-[#F47B20] text-white text-[11px] font-extrabold inline-flex items-center gap-1 hover:bg-[#FF882E] transition-all shadow-md relative z-10"
                      >
                        <span>Watch Reel on Instagram</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#204935] via-[#183A2A] to-[#0F261B] flex flex-col items-center justify-center p-6 text-center">
                      {posterUrl && (
                        <img
                          src={posterUrl}
                          alt={v.title}
                          className="w-full h-full object-cover absolute inset-0 opacity-40 z-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="w-14 h-14 rounded-full bg-[#183A2A] border border-[#7D967E]/40 flex items-center justify-center text-[#F47B20] mb-3 relative z-10">
                        <Film className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-[#FFF7E8]/70 relative z-10">Campus Reel Slot</span>
                    </div>
                  )}

                  {/* Soft Gradient Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F261B] via-black/20 to-black/50 opacity-90 group-hover:opacity-80 transition-opacity" />

                  {/* Top Tag & Audio Control Overlay */}
                  <div className="relative z-20 p-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#183A2A]/90 text-[#F47B20] text-[9px] font-black uppercase tracking-wider border border-[#F47B20]/40 backdrop-blur-md">
                      {v.tag || "REEL MEMORY"}
                    </span>
                    
                    {/* Audio Toggle Button */}
                    <button
                      onClick={(e) => toggleMute(index, e)}
                      className="p-2 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-[#F47B20] transition-colors"
                      title={mutedState[index] ? "Unmute" : "Mute"}
                    >
                      {mutedState[index] ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Center Interactive Play Indicator */}
                  <div className="relative z-20 mx-auto w-12 h-12 rounded-full bg-black/50 text-white border border-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300">
                    {playingState[index] === false ? <Play className="w-5 h-5 ml-0.5" /> : <Pause className="w-5 h-5" />}
                  </div>

                  {/* Bottom Caption Overlay */}
                  <div className="relative z-20 p-5 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#F47B20] font-extrabold uppercase tracking-wider">
                      <Film className="w-3 h-3" />
                      <span>{isFeatured ? "Featured Story" : "Campus Reel"}</span>
                    </div>
                    <h3 className="font-display font-extrabold text-base sm:text-lg text-[#FFF7E8] group-hover:text-[#F47B20] transition-colors leading-snug">
                      {v.title}
                    </h3>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FINAL BRAND STATEMENT — "EAT. MEET. REMEMBER. THAT'S MHP." */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center space-y-8">
        
        {/* Brand Emblem */}
        <div className="flex justify-center">
          <ThreeDLogoEmblem size="large" className="w-16 h-16 sm:w-20 sm:h-20" />
        </div>

        {/* Visual Climax Typography */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#183A2A] tracking-tight leading-[1.08] uppercase">
            {brandHeading}
          </h2>
          
          <p className="text-base sm:text-xl font-sans font-bold text-[#7D967E] tracking-wide pt-2">
            {brandTagline}
          </p>
        </div>

        {/* Subtle Decorative Brand Divider */}
        <div className="w-24 h-1 bg-[#F47B20] mx-auto rounded-full mt-8" />
      </section>

    </div>
  );
};

export default Explore;

