import { Header } from '../components/Header';
import React from 'react';
import '../styles/global.css';
import styles from '../styles/app.module.scss';
import { Player } from '../components/Player';
import { PlayerProvider } from '../hooks/PlayerContext';

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wrapper}>
      <PlayerProvider>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </PlayerProvider>
    </div>
  );
}

export default MyApp;
