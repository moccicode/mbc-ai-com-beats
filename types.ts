
export interface Song {
  title: string;
  artist: string;
  isKorean: boolean;
  reason: string;
  genre: string;
}

export interface RecommendationResponse {
  songs: Song[];
  themeDescription: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
