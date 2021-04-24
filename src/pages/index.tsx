import React from 'react';
import { api } from '../api';
import { EpisodeData } from '../models/data/episode';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { parseISO } from 'date-fns';
import { convertDurationToTimeFormatted } from '../utils/time';

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

  return <>
    <div>{JSON.stringify(latestEpisodes)}</div>
    <div>{JSON.stringify(allEpisodes)}</div>
  </>;
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
