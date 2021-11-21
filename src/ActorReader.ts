import Movie from "./Movie";
import Actor from "./Actor";
import readLine from "readline";
import { once } from "events";
import { createReadStream } from "fs";

class ActorReader {
    filePath: string;
    actorMap: Map<string, Actor>;
    lines: number;
    movieMap: Map<string, Movie>;

    constructor(filePath: string, movieMap: Map<string, Movie>) {
        this.filePath = filePath;
        this.actorMap = new Map();
        this.movieMap = movieMap;
        this.lines = 0;
    }

    async read() {
        console.log("Reading actors...");
        console.time("read-actor");
        const rl = readLine.createInterface({
            input: createReadStream(this.filePath),
        });

        rl.on("line", (line) => {
            this.parseLine(line);
            this.lines++;
        });

        // Stop process till a close event is fired on rl stream emitter
        await once(rl, "close");
        console.timeEnd("read-actor");
    }

    parseLine(line: string) {
        const data = line.split("\t");

        // Check if person has an actor role
        if (["actor", "actress"].includes(data[4])) {
            const actor = new Actor(data[0], data[1], data[2], data[3], data[4]);

            // Get movie object from movies map and add it to the actor
            const movieIds = data[5].split(",");
            movieIds.forEach((id: string) => {
                // console.log(id);
                const movie = this.movieMap.get(id);
                if (movie) {
                    // Aggiungo il film all'attore ma posso anche aggiungere l'attore nel film
                    actor.addMovie(movie);

                    // Update movie
                    movie.actors.push(actor);
                    this.movieMap.set(movie.id, movie);
                }
            });

            this.actorMap.set(actor.id, actor);
        }
    }
}

export default ActorReader;
