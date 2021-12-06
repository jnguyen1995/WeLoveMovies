const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reviews.service");

async function destroy(req, res, next) {
  await service.delete(res.locals.review.review_id);
  res.sendStatus(204);
}

async function reviewExists(req, res, next) {
  const review = await service.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

async function update(req, res, next) {
  const { reviewId } = req.params;
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  await service.update(updatedReview);
  const reformattedData = await service.reformatReview(
    res.locals.review.review_id
  );
  res.json({ data: reformattedData });
}

module.exports = {
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
};
