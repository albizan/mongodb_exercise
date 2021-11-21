import Movie from "./Movie";

export default class Actor {
    id: string;
    name: string;
    birthYear?: number;
    deathYear?: number;
    roles: string[];
    movies: Movie[];

    constructor(id: string, name: string, birthYear: string, deathYear: string, roles: string) {
        this.id = id;
        this.name = name;
        this.birthYear = this.parseNumber(birthYear);
        this.deathYear = this.parseNumber(deathYear);
        this.roles = roles ? roles.split(",") : [];
        this.movies = [];
    }

    addMovie(movie: Movie) {
        this.movies.push(movie);
    }

    parseNumber(value: string): number | undefined {
        const parsed = parseInt(value, 10);
        if (isNaN(parsed)) {
            return;
        }
        return parsed;
    }
}
