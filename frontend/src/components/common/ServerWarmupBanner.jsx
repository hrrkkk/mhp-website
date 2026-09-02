import React, { useEffect, useState } from 'react';
import { Wifi, RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function ServerWarmupBanner() {
  const [status, setStatus] = useState('checking'); // 'checking' | 'waking' | 'connected' | 'error'
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let timer = null;

    const checkServerHealth = async () => {
      try {
        const res = await api.get('/health', { timeout: 15000 });
        if (isMounted && res.data && res.data.status === 'OK') {
          setStatus('connected');
        }
      } catch (err) {
        if (isMounted) {
          setStatus('waking');
          setAttemptCount((prev) => prev + 1);
          // Retry every 3 seconds while waking up
          timer = setTimeout(checkServerHealth, 3000);
        }
      }
    };

    checkServerHealth();

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (status === 'connected' || status === 'checking') {
    return null;
  }

  return (
    <div className="bg-[#183A2A] text-[#FFF7E8] px-4 py-2 text-xs flex items-center justify-between shadow-md border-b border-[#F47B20]/30 transition-all animate-pulse">
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-[#F47B20] animate-spin" />
          <span className="font-medium">
            Connecting to MHP Campus Server (Attempt {attemptCount})... Please wait a moment while server warms up.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#F47B20] bg-white/10 px-2 py-0.5 rounded-full">
          <Wifi className="w-3 h-3" />
          <span>Warming Up</span>
        </div>
      </div>
    </div>
  );
}
