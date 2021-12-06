const { where } = require("../db/connection");
const knex = require("../db/connection");

const list = () => {
  return knex("movies").select("*");
};

const listMoviesInTheaters = () => {
  return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .distinct("m.*")
    .where({ "mt.is_showing": true })
    .orderBy("m.movie_id");
};

const read = (movieId) => {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
};

const listTheaterShowingMovie = (movieId) => {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .select("*")
    .where({ "mt.movie_id": movieId });
};

const listReviewsForMovie = (movieId) => {
  return knex("movies as m")
    .join("reviews as r", "r.movie_id", "m.movie_id")
    .select("*")
    .where({ "r.movie_id": movieId });
};

module.exports = {
  list,
  listMoviesInTheaters,
  read,
  listTheaterShowingMovie,
  listReviewsForMovie,
};
