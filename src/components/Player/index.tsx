import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { usePlayer } from '../../hooks/PlayerContext';
import styles from './styles.module.scss';

export function Player() {
  const { isPlaying, currentEpisode, play, pause } = usePlayer();
  const audioRef = useRef(null);

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
            height={692}
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
          autoPlay
          ref={audioRef}
          src={currentEpisode.url}
          onPlay={play}
          onPause={pause}
        />
      )}

      <footer className={currentEpisode ? '' : styles.empty} >
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            {currentEpisode ? (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>
        </div>

        <div className={styles.controlButtons}>
          <button disabled={!currentEpisode}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button disabled={!currentEpisode}>
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
          <button disabled={!currentEpisode}>
            <img src="/play-next.svg" alt="Próxima" />
          </button>
          <button disabled={!currentEpisode}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div >
  );
}
