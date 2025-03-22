import { useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';

export default function BackgroundMusic() {
  const { backgroundMusic, isMusicPlaying } = useApp();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (backgroundMusic) {
      audioRef.current.src = backgroundMusic;
      audioRef.current.loop = true;
      
      if (isMusicPlaying) {
        audioRef.current.play().catch(() => {
          // Handle autoplay restrictions
          console.log('Autoplay prevented. Please interact with the page first.');
        });
      } else {
        audioRef.current.pause();
      }
    } else {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [backgroundMusic, isMusicPlaying]);

  return null;
} 