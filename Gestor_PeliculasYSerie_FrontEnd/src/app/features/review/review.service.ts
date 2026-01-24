import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ReviewDTO {
  id: number;
  movieId: number;
  userId: number;
  rating: number;
  comment?: string;
  containsSpoilers: boolean;
  status: 'VISIBLE' | 'HIDDEN';
  edited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MovieStatsDTO {
  averageRating: number | null; // tu back puede devolver null si no hay reviews
  count: number;
}

export interface CreateReviewRequest {
  movieId: number;
  rating: number;               // 1..10
  comment?: string | null;
  containsSpoilers: boolean;
}

export interface UpdateReviewRequest {
  rating?: number | null;
  comment?: string | null;
  containsSpoilers?: boolean | null;
  status?: 'VISIBLE' | 'HIDDEN' | null;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private baseUrl = 'http://localhost:9090/reviews';

  constructor(private http: HttpClient) {}

  listByMovie(movieId: number): Observable<ReviewDTO[]> {
    return this.http.get<ReviewDTO[]>(`${this.baseUrl}/movie/${movieId}`);
  }

  stats(movieId: number): Observable<MovieStatsDTO> {
    return this.http.get<MovieStatsDTO>(`${this.baseUrl}/movie/${movieId}/stats`);
  }

  myReviews(): Observable<ReviewDTO[]> {
    return this.http.get<ReviewDTO[]>(`${this.baseUrl}/me`);
  }

  create(dto: CreateReviewRequest): Observable<ReviewDTO> {
    return this.http.post<ReviewDTO>(`${this.baseUrl}`, dto);
  }

  update(reviewId: number, dto: UpdateReviewRequest): Observable<ReviewDTO> {
    return this.http.patch<ReviewDTO>(`${this.baseUrl}/${reviewId}`, dto);
  }

  delete(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${reviewId}`);
  }
}
