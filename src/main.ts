import "./env";

import ActorReader from "./ActorReader";
import MovieReader from "./MovieReader";
import { resolve } from "path";
import { InsertManyResult, MongoClient, MongoClientOptions } from "mongodb";
import Actor from "./Actor";
import Movie from "./Movie";

async function start() {
    const client = new MongoClient(process.env.DB_CONN_STRING as string);
    await client.connect();
    console.log("Connected to MongoDB");
    const actorsCollection = client.db("imdb").collection("actors");
    const moviesCollection = client.db("imdb").collection("movies");

    const movieReader = new MovieReader(resolve(__dirname, "../files/movies.tsv"));
    await movieReader.read();

    const actorReader = new ActorReader(resolve(__dirname, "../files/names.tsv"), movieReader.movieMap);
    await actorReader.read();

    console.log("Total movies found:", movieReader.movieMap.size);
    console.log("Total actors found:", actorReader.actorMap.size);

    // Once we have actors and movies, start inserting them on DB
    let actorsBuffer: Actor[] = [];
    let actorsBufferSize = 0;
    let actorsPromises: Promise<InsertManyResult>;
    let moviesBuffer: Movie[] = [];
    let moviesBufferSize = 0;

    actorReader.actorMap.forEach((actor: Actor) => {
        actorsBuffer.push(actor);
        actorsBufferSize++;
        if (actorsBufferSize % 1000 === 0) {
            // Do not await
            let promise = actorsCollection.insertMany(actorsBuffer);
            console.log("1000 actors inserted");
            actorsBuffer = [];
            actorsBufferSize = 0;
        }
    });
}

start();
