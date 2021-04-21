import styles from './styles.module.scss';

export function Player() {

  return (
    <div className={styles.playerContainer}>
      <header className={styles.header}>
        <img src="./playing.svg" alt="headphone" />
        <strong>Tocando agora</strong>
      </header>

      <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
      </div>

      <footer className={styles.empty}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            <div className={styles.emptySlider} />
          </div>
          <span>00:00</span>
        </div>

        <div className={styles.controlButtons}>
          <button>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button>
            <img src="/play-previous.svg" alt="Anterior" />
          </button>
          <button className={styles.playButton}>
            <img src="/play.svg" alt="Tocar" />
          </button>
          <button>
            <img src="/play-next.svg" alt="Próxima" />
          </button>
          <button>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
