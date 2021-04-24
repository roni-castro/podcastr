export interface FileData {
  url: string;
  type: string;
  duration: number;
}

export interface EpisodeData {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  file: FileData;
}

export interface EpisodesData {
  episodes: EpisodeData[];
}
