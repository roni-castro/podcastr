import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { usePlayer } from '../../hooks/PlayerContext';
import styles from './styles.module.scss';
import { convertDurationToTimeFormatted } from '../../utils/time';

export function Player() {
  const {
    isPlaying,
    isLooping,
    isShuffling,
    canShuffle,
    currentEpisode,
    hasNextEpisode,
    hasPreviousEpisode,
    shuffle,
    previous,
    next,
    play,
    loop,
    pause,
    clearPlaylist,
  } = usePlayer();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play();

    const handleTimeUpdate = () => {
      setProgress(Math.floor(audioRef.current?.currentTime || 0));
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentEpisode]);

  const handleSliderChange = (newValue: number) => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.currentTime = newValue;
    setProgress(newValue);
  };

  const handleEpisodeEnded = () => {
    if (hasNextEpisode) {
      next();
    } else {
      setProgress(0);
      clearPlaylist();
    }
  };

  return (
    <div className={styles.playerContainer}>
      <header className={styles.header}>
        <img src="/playing.svg" alt="headphone" />
        <strong>Tocando agora</strong>
      </header>

      {currentEpisode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={currentEpisode.thumbnail}
            priority={true}
            objectFit="cover"
          />
          <strong>{currentEpisode.title}</strong>
          <span>{currentEpisode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      {currentEpisode && (
        <audio
          loop={isLooping}
          ref={audioRef}
          src={currentEpisode.url}
          onPlay={play}
          onPause={pause}
          onEnded={handleEpisodeEnded}
        />
      )}

      <footer className={currentEpisode ? '' : styles.empty} >
        <div className={styles.progress}>
          <span>{convertDurationToTimeFormatted(progress)}</span>
          <div className={styles.slider}>
            {currentEpisode ? (
              <Slider
                max={currentEpisode.duration}
                value={progress}
                onChange={handleSliderChange}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeFormatted(currentEpisode?.duration ?? 0)}</span>
        </div>

        <div className={styles.controlButtons}>
          <button
            className={isShuffling ? styles.isActive : ''}
            disabled={!canShuffle}
            onClick={shuffle}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button disabled={!hasPreviousEpisode} onClick={previous}>
            <img src="/play-previous.svg" alt="Anterior" />
          </button>
          {isPlaying ? (
            <button disabled={!currentEpisode} className={styles.playButton} onClick={pause}>
              <img src={"/pause.svg"} alt={"Pausar"} />
            </button>
          ) : (
            <button disabled={!currentEpisode} className={styles.playButton} onClick={play}>
              <img src={"/play.svg"} alt={"Tocar"} />
            </button>
          )}
          <button disabled={!hasNextEpisode} onClick={next}>
            <img src="/play-next.svg" alt="Próxima" />
          </button>
          <button
            className={isLooping ? styles.isActive : ''}
            disabled={!currentEpisode}
            onClick={loop}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div >
  );
};
