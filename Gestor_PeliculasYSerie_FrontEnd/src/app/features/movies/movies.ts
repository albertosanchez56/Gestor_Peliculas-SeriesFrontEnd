import { Director } from "../directores/director";
import { Generos } from "../generos/generos";

export class Movies{

    id:number;
    title:string;
    description:string;
    releaseDate:string;
    director:Director;
    genres: Generos[];
}