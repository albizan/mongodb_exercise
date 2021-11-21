import Actor from "./Actor";

export default class Movie {
    id: string;
    title: string;
    startYear?: number;
    endYear?: number;
    length?: number;
    genres: string[];
    actors: Actor[];

    constructor(id: string, title: string, startYear: string, endYear: string, length: string, genres: string) {
        this.id = id;
        this.title = title;
        this.startYear = this.parseNumber(startYear);
        this.endYear = this.parseNumber(endYear);
        this.length = this.parseNumber(length);
        this.genres = genres.split(",");
        this.actors = [];
    }

    parseNumber(value: string): number | undefined {
        const parsed = parseInt(value, 10);
        if (isNaN(parsed)) {
            return;
        }
        return parsed;
    }
}
