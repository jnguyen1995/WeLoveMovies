const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  const is_showing = req.query.is_showing;
  if (is_showing) {
    const data = await service.listMoviesInTheaters();
    res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data });
  }
}

function read(req, res) {
  const { movie: data } = res.locals;
  res.json({ data });
}

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

async function listTheaterShowingMovie(req, res, next) {
  const id = res.locals.movie.movie_id;
  res.json({ data: await service.listTheaterShowingMovie(id) });
}

async function listReviewsForMovie(req, res, next) {
  const id = res.locals.movie.movie_id;
  res.json({ data: await service.listReviewsForMovie(id) });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  findTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listTheaterShowingMovie),
  ],
  findReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listReviewsForMovie),
  ],
};
