import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../api';
import { EpisodeData } from '../models/data/episode';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { parseISO } from 'date-fns';
import { convertDurationToTimeFormatted } from '../utils/time';
import styles from './home.module.scss';
import { PlayGreenButton } from '../components/PlayGreenButton';
import { usePlayer } from '../hooks/PlayerContext';

interface EpisodeVM {
  id: string;
  title: string;
  members: string;
  publishedAtFormatted: string;
  durationFormatted: string;
  thumbnail: string;
  duration: number;
  url: string;
}

export interface HomeProps {
  latestEpisodes: EpisodeVM[];
  allEpisodes: EpisodeVM[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playTheList } = usePlayer();

  const episodeList = [...allEpisodes, ...latestEpisodes];

  return (
    <div className={styles.homePageContainer}>
      <section className={styles.latestEpisodes}>
        <h2 >Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => (
            <li key={episode.id}>
              <Image
                className={styles.thumbnail}
                src={episode.thumbnail}
                alt={episode.title}
                width={192}
                height={192}
                objectFit="cover"
              />
              <div className={styles.episodeDetails}>
                <Link href={`/episodes/${episode.id}`}>
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <div>
                  <span>{episode.publishedAtFormatted}</span>
                  <span>{episode.durationFormatted}</span>
                </div>
              </div>
              <div className={styles.button}>
                <PlayGreenButton
                  containerSize="2.5rem"
                  iconSize="1.5rem"
                  onClick={() => playTheList(episodeList, index)}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2 >Todos os episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th colSpan={2}>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th colSpan={2}>Duração</th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => (
              <tr key={episode.id}>
                <td style={{ width: 72 }}>
                  <Image
                    className={styles.thumbnail}
                    src={episode.thumbnail}
                    alt={episode.title}
                    width={192}
                    height={192}
                    objectFit="cover"
                  />
                </td>
                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td style={{ width: 100 }}>{episode.publishedAtFormatted}</td>
                <td>{episode.durationFormatted}</td>
                <td>
                  <PlayGreenButton
                    containerSize="2rem"
                    iconSize="1rem"
                    onClick={() => playTheList(episodeList, index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div >
  );
}

function mapEpisodesDataToHomeProps(episodesData: EpisodeData[]): HomeProps {
  const episodes: EpisodeVM[] = episodesData.map(episodeData => {
    const publishedAtFormatted =
      format(parseISO(episodeData.published_at), 'd MMM yy', { locale: ptBR });
    const durationFormatted =
      convertDurationToTimeFormatted(episodeData.file.duration);
    return {
      id: episodeData.id,
      title: episodeData.title,
      members: episodeData.members,
      thumbnail: episodeData.thumbnail,
      duration: episodeData.file.duration,
      url: episodeData.file.url,
      publishedAtFormatted,
      durationFormatted
    };
  });
  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
  return { latestEpisodes, allEpisodes };
}

export async function getStaticProps() {
  try {
    const response = await api.get<EpisodeData[]>('episodes', {
      params: {
        _limit: 12,
        _sort: 'published_at',
        _order: 'desc'
      }
    });
    const episodesData = await response.data;
    return {
      props: { ...mapEpisodesDataToHomeProps(episodesData) },
      revalidate: 60 * 60 * 8
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
