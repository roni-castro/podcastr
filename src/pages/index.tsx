import React from 'react';
import Image from 'next/image';
import { api } from '../api';
import { EpisodeData } from '../models/data/episode';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { parseISO } from 'date-fns';
import { convertDurationToTimeFormatted } from '../utils/time';
import styles from './home.module.scss';

interface EpisodeVM {
  id: string;
  title: string;
  members: string;
  publishedAtFormatted: string;
  durationFormatted: string;
  thumbnail: string;
}

export interface HomeProps {
  latestEpisodes: EpisodeVM[];
  allEpisodes: EpisodeVM[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {

  return (
    <div className={styles.homePageContainer}>
      <section className={styles.latestEpisodes}>
        <h2 >Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(latestEpisode => (
            <li key={latestEpisode.id}>
              <Image width={288} height={288} src={latestEpisode.thumbnail} alt={latestEpisode.title} objectFit="cover" />
              <div className={styles.episodeDetails}>
                <a href="">{latestEpisode.title}</a>
                <p>{latestEpisode.members}</p>
                <div>
                  <span>{latestEpisode.publishedAtFormatted}</span>
                  <span>{latestEpisode.durationFormatted}</span>
                </div>
              </div>
              <button>
                <img src="/play-green.svg" alt="Ver detalhes" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div >
  );
}

function mapEpisodesDataToHomeProps(episodesData: EpisodeData[]): HomeProps {
  const allEpisodes: EpisodeVM[] = episodesData.map(episodeData => {
    const publishedAtFormatted =
      format(parseISO(episodeData.published_at), 'd MMM yy', { locale: ptBR });
    const durationFormatted =
      convertDurationToTimeFormatted(episodeData.file.duration);
    return {
      id: episodeData.id,
      title: episodeData.title,
      members: episodeData.members,
      thumbnail: episodeData.thumbnail,
      publishedAtFormatted,
      durationFormatted
    };
  });
  const latestEpisodes = allEpisodes.slice(0, 2);
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
