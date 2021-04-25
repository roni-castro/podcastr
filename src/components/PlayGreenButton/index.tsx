import styles from './styles.module.scss';

interface PlayGreenButtonProps {
  onClick: () => void;
}

export function PlayGreenButton({ onClick }: PlayGreenButtonProps) {
  return (
    <button className={styles.buttonCard} onClick={onClick}>
      <img
        style={{ width: '1.5rem', height: '1.5rem' }}
        src="/play-green.svg"
        alt="Ver detalhes"
      />
    </button>
  );
}
