import React from 'react';
import { createContext, useContext, useState } from 'react';

interface Episode {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

interface PlayerContextData {
  isPlaying: boolean,
  hasNextEpisode: boolean,
  hasPreviousEpisode: boolean,
  currentEpisode: Episode;
  playTheList: (newEpisodes: Episode[], episodeToPlayIndex: number) => void,
  playItem: (episode: Episode) => void,
  play: () => void,
  next: () => void,
  previous: () => void,
  pause: () => void,
}

const PlayerContext = createContext<PlayerContextData>(null);

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used inside a component wrapped by PlayerProvider');
  }
  return context;
}

export function PlayerProvider(props) {
  const [playList, setPlaylist] = useState<Episode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentEpisode: Episode | null = playList[currentEpisodeIndex] || null;
  const hasNextEpisode = Boolean(playList[currentEpisodeIndex + 1]);
  const hasPreviousEpisode = Boolean(playList[currentEpisodeIndex - 1]);

  const playTheList = (episodes: Episode[], episodeToPlayIndex: number) => {
    if (episodeToPlayIndex === currentEpisodeIndex) {
      return;
    }
    setPlaylist(episodes);
    setCurrentEpisodeIndex(episodeToPlayIndex);
    setIsPlaying(true);
  };

  const playItem = (episodeToPlay: Episode) => {
    setPlaylist([episodeToPlay]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  };

  const next = () => {
    if (hasNextEpisode) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      setIsPlaying(true);
    }
  };

  const previous = () => {
    if (hasPreviousEpisode) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
      setIsPlaying(true);
    }
  };

  const play = () => {
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const value = {
    isPlaying,
    currentEpisode,
    playTheList,
    playItem,
    hasNextEpisode,
    hasPreviousEpisode,
    next,
    previous,
    play,
    pause,
  };

  return <PlayerContext.Provider
    value={value}
    {...props}
  />;
}
