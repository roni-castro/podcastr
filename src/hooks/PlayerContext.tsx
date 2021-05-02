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
  canShuffle: boolean,
  isShuffling: boolean,
  isLooping: boolean,
  hasNextEpisode: boolean,
  hasPreviousEpisode: boolean,
  currentEpisode?: Episode;
  playTheList: (newEpisodes: Episode[], episodeToPlayIndex: number) => void,
  playItem: (episode: Episode) => void,
  play: () => void,
  next: () => void,
  previous: () => void,
  shuffle: () => void,
  loop: () => void,
  pause: () => void,
  clearPlaylist: () => void,
}

const PlayerContext = createContext<PlayerContextData | null>(null);

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
  const [isShuffling, setIsShuffling] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  const canShuffle = playList.length > 1;
  const currentEpisode: Episode | undefined = playList[currentEpisodeIndex];
  const hasNextEpisode = isShuffling || Boolean(playList[currentEpisodeIndex + 1]);
  console.log(hasNextEpisode);
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
    if (!hasNextEpisode) {
      return;
    }
    const nextIndex = isShuffling ? getRandomEpisodeIndex() : currentEpisodeIndex + 1;
    setCurrentEpisodeIndex(nextIndex);
    setIsPlaying(true);
  };

  const previous = () => {
    if (!hasPreviousEpisode) {
      return;
    }
    const previousIndex = currentEpisodeIndex - 1;
    setCurrentEpisodeIndex(previousIndex);
    setIsPlaying(true);
  };

  const getRandomEpisodeIndex = () => {
    const newIndex = Math.floor(Math.random() * playList.length);
    if (newIndex === currentEpisodeIndex) {
      return getRandomEpisodeIndex();
    } else {
      return newIndex;
    }
  };

  const shuffle = () => {
    if (!canShuffle) {
      setIsShuffling(false);
      return;
    }
    setIsShuffling(currentShuffleState => !currentShuffleState);
  };

  const loop = () => {
    setIsLooping(currentIsLopping => !currentIsLopping);
  };

  const play = () => {
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const clearPlaylist = () => {
    setPlaylist([]);
    setCurrentEpisodeIndex(-1);
  };

  const value = {
    isPlaying,
    isLooping,
    isShuffling,
    canShuffle,
    currentEpisode,
    playTheList,
    playItem,
    hasNextEpisode,
    hasPreviousEpisode,
    next,
    previous,
    shuffle,
    loop,
    play,
    pause,
    clearPlaylist,
  };

  return <PlayerContext.Provider
    value={value}
    {...props}
  />;
}
