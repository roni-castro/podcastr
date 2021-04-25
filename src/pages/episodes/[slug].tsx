import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './episode.module.scss';
import { convertDurationToTimeFormatted } from '../../utils/time';
import { EpisodeData } from '../../models/data/episode';
import Image from 'next/image';

interface EpisodeDetailVM {
  id: string;
  title: string;
  members: string;
  description: string;
  publishedAtFormatted: string;
  durationFormatted: string;
  thumbnail: string;
}

export interface EpisodeProps {
  episode: EpisodeDetailVM;
}

export default function Episode({ episode }: EpisodeProps) {
  return (
    <div className={styles.episode}>
      <div className={styles.headerImage}>
        <Image
          width={1312}
          height={320}
          src={episode.thumbnail}
          alt={episode.title}
          objectFit="cover"
        />
        <button onClick={() => console.log('back')}>
          <img src="/arrow-left.svg" alt="Voltar" />
        </button>
        <button onClick={() => console.log('play')}>
          <img src="/play-green.svg" alt="Próximo" />
        </button>
      </div>
      <div className={styles.content}>
        <h2>Como começar na programação em 2021 do jeito certo</h2>
        <div>
          <span>{episode.members}</span>
          <span>{episode.publishedAtFormatted}</span>
          <span>{episode.durationFormatted}</span>
        </div>
        <hr />
        <p>
          <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} /></p>
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get<EpisodeData>(`/episodes/${slug}`);

  const publishedAtFormatted =
    format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR });
  const durationFormatted = convertDurationToTimeFormatted(data.file.duration);
  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    description: data.description,
    thumbnail: data.thumbnail,
    publishedAtFormatted,
    durationFormatted
  };
  return {
    props: { episode },
    revalidate: 60 * 60 * 24 //24 hours
  };
};
