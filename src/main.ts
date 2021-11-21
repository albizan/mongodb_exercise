import ActorReader from "./ActorReader";
import MovieReader from "./MovieReader";

async function start() {
    const movieReader = new MovieReader(__dirname + "/../files/movies.tsv");
    await movieReader.read();

    const actorReader = new ActorReader(__dirname + "/../files/names.tsv", movieReader.movieMap);
    await actorReader.read();

    console.log("Total movies found:", movieReader.movieMap.size);
    console.log("Total actors found:", actorReader.actorMap.size);

    actorReader.actorMap.forEach((value) => {
        console.log(value);
    });
}

start();
