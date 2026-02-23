import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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

export interface ReviewViewDTO {
  id: number;
  movieId: number;
  userId: number;
  displayName: string;
  rating: number;
  comment?: string;
  containsSpoilers: boolean;
  edited: boolean;
  createdAt: string;   // ISO
  updatedAt: string;
}



export interface MovieStatsDTO {
  averageUserRating: number | null;
  voteCount: number;
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
  private baseUrl = `${environment.apiBaseUrl}/reviews`;

  constructor(private http: HttpClient) {}

  

  myReviews(): Observable<ReviewDTO[]> {
    return this.http.get<ReviewDTO[]>(`${this.baseUrl}/me`);
  }

  update(reviewId: number, dto: UpdateReviewRequest): Observable<ReviewDTO> {
    return this.http.patch<ReviewDTO>(`${this.baseUrl}/${reviewId}`, dto);
  }

  delete(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${reviewId}`);
  }

  listByMovie(movieId: number) {
  return this.http.get<ReviewViewDTO[]>(`${this.baseUrl}/movie/${movieId}/view`);
}


  stats(movieId: number): Observable<MovieStatsDTO> {
    return this.http.get<MovieStatsDTO>(`${this.baseUrl}/movie/${movieId}/stats`);
  }

  // ✅ para saber si ya tengo review de esa peli
  myReviewForMovie(movieId: number): Observable<ReviewViewDTO> {
    return this.http.get<ReviewViewDTO>(`${this.baseUrl}/me/movie/${movieId}`);
  }

  create(body: { movieId: number; rating: number; comment?: string; containsSpoilers: boolean }) {
    return this.http.post(`${this.baseUrl}`, body);
  }
}
