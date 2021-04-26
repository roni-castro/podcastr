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
  addToPlayList: (episode: Episode) => void,
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
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const addToPlayList = useCallback((episodeToPlay: Episode) => {
    const episodeFound: Episode | undefined = playList.find(episode => episode.id === episodeToPlay.id);

    if (!episodeFound) {
      setPlaylist(currentEpisodes => [...currentEpisodes, episodeToPlay]);
    }
    setCurrentEpisode(episodeToPlay);
    setIsPlaying(true);
  }, [playList]);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const value = useMemo(() => ({
    isPlaying,
    currentEpisode,
    addToPlayList,
    play,
    pause,
  }), [isPlaying, currentEpisode, addToPlayList, play, pause]);

  return <PlayerContext.Provider
    value={value}
    {...props}
  />;
}
