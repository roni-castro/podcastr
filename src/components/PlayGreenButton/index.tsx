import styles from './styles.module.scss';

interface PlayGreenButtonProps {
  containerSize: string;
  iconSize: string;
  onClick: () => void;
}

export function PlayGreenButton({ onClick, containerSize, iconSize }: PlayGreenButtonProps) {
  return (
    <button
      style={{ width: containerSize, height: containerSize }}
      className={styles.buttonCard}
      onClick={onClick}
    >
      <img
        style={{ width: iconSize, height: iconSize }}
        src="/play-green.svg"
        alt="Ver detalhes"
      />
    </button>
  );
}
