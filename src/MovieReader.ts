import Movie from "./Movie";
import readLine from "readline";
import { once } from "events";
import { createReadStream } from "fs";

class MovieReader {
    filePath: string;
    movieMap: Map<string, Movie> = new Map();
    lines: number;

    constructor(filePath: string) {
        this.filePath = filePath;
        this.lines = 0;
    }

    async read() {
        console.log("Reading movies...");
        console.time("read-movie");
        const rl = readLine.createInterface({
            input: createReadStream(this.filePath),
        });

        rl.on("line", (line) => {
            this.parseLine(line);
            this.lines++;
        });

        // Stop process till a close event is fired on rl stream emitter
        await once(rl, "close");
        console.timeEnd("read-movie");
    }

    parseLine(line: string) {
        const data = line.split("\t");
        const movie = new Movie(data[0], data[2], data[5], data[6], data[7], data[8]);
        this.movieMap.set(movie.id, movie);
    }
}

export default MovieReader;
