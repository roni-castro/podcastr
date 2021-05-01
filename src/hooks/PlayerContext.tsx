import { createContext, useCallback, useContext, useMemo, useState } from 'react';

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
  currentEpisode: Episode;
  playTheList: (newEpisodes: Episode[], episodeToPlayIndex: number) => void,
  playItem: (episode: Episode) => void,
  play: () => void,
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

  const playTheList = useCallback((episodes: Episode[], episodeToPlayIndex: number) => {
    setPlaylist(episodes);
    setCurrentEpisodeIndex(episodeToPlayIndex);
    setIsPlaying(true);
  }, []);

  const playItem = useCallback((episodeToPlay: Episode) => {
    setPlaylist([episodeToPlay]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const value = useMemo(() => ({
    isPlaying,
    currentEpisode,
    playTheList,
    play,
    pause,
  }), [isPlaying, currentEpisode, playTheList, playItem, play, pause]);

  return <PlayerContext.Provider
    value={value}
    {...props}
  />;
}
