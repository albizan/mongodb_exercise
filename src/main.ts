import "./env";

import ActorReader from "./ActorReader";
import MovieReader from "./MovieReader";
import { resolve } from "path";
import { InsertManyResult, MongoClient } from "mongodb";
import Actor from "./Actor";
import Movie from "./Movie";

async function start() {
  const client = new MongoClient(process.env.DB_CONN_STRING as string);
  await client.connect();
  console.log("Connected to MongoDB");
  const actorsCollection = client.db("imdb").collection("actors");
  const moviesCollection = client.db("imdb").collection("movies");

  const movieReader = new MovieReader(resolve(__dirname, "../files/films.tsv"));
  await movieReader.read();

  const actorReader = new ActorReader(
    resolve(__dirname, "../files/actors.tsv"),
    movieReader.movieMap
  );
  await actorReader.read();

  console.log("Total movies found:", movieReader.movieMap.size);
  console.log("Total actors found:", actorReader.actorMap.size);

  // Once we have actors and movies, start inserting them on DB
  let actorsBuffer: Actor[] = [];
  let actorsBufferSize = 0;
  let actorsPromises: Promise<InsertManyResult>;
  let moviesBuffer: Movie[] = [];
  let moviesBufferSize = 0;

  console.log("Inserting movies");
  const allMovies = Array.from(movieReader.movieMap.values());
  for (let movie of allMovies) {
    moviesBuffer.push(movie);
    moviesBufferSize++;
    if (moviesBufferSize % 500 === 0) {
      await moviesCollection.insertMany(moviesBuffer);
      moviesBuffer = [];
      moviesBufferSize = 0;
    }
  }

  console.log("Inserting actors");
  const allActors = Array.from(actorReader.actorMap.values());
  for (let actor of allActors) {
    actorsBuffer.push(actor);
    actorsBufferSize++;
    if (actorsBufferSize % 500 === 0) {
      await actorsCollection.insertMany(actorsBuffer);
      actorsBuffer = [];
      actorsBufferSize = 0;
    }
  }
}

start();
