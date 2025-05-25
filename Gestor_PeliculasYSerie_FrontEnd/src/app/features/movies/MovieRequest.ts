export interface MovieRequest {
    title: string;
    description: string;
    releaseDate: string;
    director: { id: number } | null;
    genres: { id: number }[];
}
