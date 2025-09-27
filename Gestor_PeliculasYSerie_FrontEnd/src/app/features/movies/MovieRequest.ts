export interface MovieRequest {
  title: string;
  description?: string | null;
  releaseDate: string;     // 'yyyy-MM-dd'
  directorId: number;
  genreIds: number[];

  durationMinutes?: number | null;
  originalLanguage?: string | null;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  trailerUrl?: string | null;
  ageRating?: string | null;
}
