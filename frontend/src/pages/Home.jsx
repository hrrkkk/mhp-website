import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CinematicHero from '../components/home/CinematicHero';
import SignatureDishesSection from '../components/home/SignatureDishesSection';
import TodayAtMhpSection from '../components/home/TodayAtMhpSection';
import { FALLBACK_FOOD_ITEMS } from '../data/fallbackMenu';

/**
 * Home — Ultra-Streamlined MHP Home Page Component
 * Structure (Focused exclusively on Understanding, Discovering, and Ordering Food):
 * 1. Hero Section (Brand identity, ordering status & primary order CTAs)
 * 2. Today at MHP (Live campus timings & today's quick-order specials grid)
 * 3. Signature Dishes (Interactive sleeve showcase with direct Add to Cart buttons)
 */
const Home = () => {
  const [homeContent, setHomeContent] = useState(null);
  const [orderingSlot, setOrderingSlot] = useState(null);
  const [featuredItems, setFeaturedItems] = useState(FALLBACK_FOOD_ITEMS.slice(0, 4));
  const [foodItems, setFoodItems] = useState(FALLBACK_FOOD_ITEMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [homeRes, slotRes, menuRes] = await Promise.all([
        api.get('/home-content').catch(() => null),
        api.get('/ordering-slot').catch(() => null),
        api.get('/future-menu/items').catch(() => null)
      ]);

      if (homeRes?.data) setHomeContent(homeRes.data);
      if (slotRes?.data) setOrderingSlot(slotRes.data);
      
      if (menuRes?.data && Array.isArray(menuRes.data) && menuRes.data.length > 0) {
        setFoodItems(menuRes.data);
        const popular = menuRes.data.filter(item => item.popular).slice(0, 4);
        setFeaturedItems(popular.length >= 2 ? popular : menuRes.data.slice(0, 4));
      } else {
        setFeaturedItems(FALLBACK_FOOD_ITEMS.slice(0, 4));
      }
    } catch (err) {
      console.error('Failed to load home data:', err);
      setFeaturedItems(FALLBACK_FOOD_ITEMS.slice(0, 4));
    } finally {
      setLoading(false);
    }
  };

  const heroData = homeContent?.hero || {
    heading: "MORE THAN FOOD.",
    subtitle: "The heartbeat of VFSTR.",
    description: "Good Food • Great Vibes • Best Memories",
    primaryBtnText: "ORDER NOW",
    primaryBtnLink: "/menu?mode=delivery",
    secondaryBtnText: "EXPLORE MENU",
    secondaryBtnLink: "/menu"
  };

  const sectionVisibility = homeContent?.sectionVisibility || {
    hero: true,
    diningDelivery: true,
    signatureDishes: true,
    campusExperience: true,
    synergy: true
  };

  return (
    <div className="space-y-0 bg-[#FFF7E8] text-[#202522] overflow-x-hidden font-sans preserve-3d">
      
      {/* 1. HERO SECTION */}
      {sectionVisibility.hero !== false && (
        <CinematicHero heroData={heroData} orderingSlot={orderingSlot} />
      )}

      {/* 2. TODAY AT MHP SECTION (Live Dashboard & Quick Order Specials) */}
      <TodayAtMhpSection featuredItems={featuredItems} orderingSlot={orderingSlot} />

      {/* 3. SIGNATURE DISHES SHOWCASE */}
      {sectionVisibility.signatureDishes !== false && (
        <SignatureDishesSection featuredItems={featuredItems} />
      )}

    </div>
  );
};

export default Home;
