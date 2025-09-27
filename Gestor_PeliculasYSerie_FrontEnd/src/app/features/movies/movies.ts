import { Director } from "../directores/director";
import { Generos } from "../generos/generos";

export class Movies{

  id!: number;
  title!: string;
  description?: string;
  releaseDate?: string;
  director?: { id: number; name: string };
  genres: { id: number; name: string }[] = [];

  // nuevos (opcionales)
  durationMinutes?: number;
  originalLanguage?: string;
  posterUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  ageRating?: string;
  averageRating?: number;
}