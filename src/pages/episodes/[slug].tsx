import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { api } from '../../api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './episode.module.scss';
import { convertDurationToTimeFormatted } from '../../utils/time';
import { EpisodeData } from '../../models/data/episode';
import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '../../hooks/PlayerContext';

interface EpisodeDetailVM {
  id: string;
  title: string;
  members: string;
  description: string;
  publishedAtFormatted: string;
  durationFormatted: string;
  duration: number;
  url: string;
  thumbnail: string;
}

export interface EpisodeProps {
  episode: EpisodeDetailVM;
}

export default function Episode({ episode }: EpisodeProps) {
  const { playItem } = usePlayer();
  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>
      <div className={styles.imageContainer}>
        <Link href="/">
          <button>
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={1312}
          height={320}
          src={episode.thumbnail}
          alt={episode.title}
          objectFit="cover"
        />
        <button onClick={() => playItem(episode)}>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>
      <div className={styles.content}>
        <h2>{episode.title}</h2>
        <div>
          <span>{episode.members}</span>
          <span>{episode.publishedAtFormatted}</span>
          <span>{episode.durationFormatted}</span>
        </div>
        <hr />
        <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get<EpisodeData[]>('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const paths = data.map(episode => ({
    params: { slug: episode.id }
  }));

  return {
    paths,
    fallback: 'blocking'
  };
};

function mapEpisodeDataToEpisodeDetailVM(episode: EpisodeData): EpisodeDetailVM {
  const publishedAtFormatted =
    format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR });
  const durationFormatted = convertDurationToTimeFormatted(episode.file.duration);
  return {
    id: episode.id,
    title: episode.title,
    members: episode.members,
    description: episode.description,
    thumbnail: episode.thumbnail,
    duration: episode.file.duration,
    url: episode.file.url,
    publishedAtFormatted,
    durationFormatted
  };
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug;

  const { data } = await api.get<EpisodeData>(`/episodes/${slug}`);
  const episode = mapEpisodeDataToEpisodeDetailVM(data);
  return {
    props: { episode },
    revalidate: 60 * 60 * 24 //24 hours
  };
};
