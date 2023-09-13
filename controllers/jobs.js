const JobSchema = require('../models/Job.js');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors/index.js');

const getJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;
  const job = await JobSchema.findOne({ createdBy: userId, _id: jobId })
    .sort('-createdAt')
    .select('status company position createdAt');

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
}

const getAllJobs = async (req, res) => {
  const jobs = await JobSchema.find({ createdBy: req.user.userId })
    .sort('-createdAt')
    .select('status company position createdAt');
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
}

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await JobSchema.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
};

const changeJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
    body: { position, company }
  } = req;

  if (!position.trim() || !position.trim()) {
    throw new BadRequestError('Please provide a new position.');
  }

  const job = await JobSchema.findOneAndUpdate(
    { createdBy: userId, _id: jobId },
    { position, company },
    { returnDocument: 'after', runValidators: true }
  ).select('status company position createdAt');

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;
  const job = await JobSchema.findOneAndDelete({ createdBy: userId, _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = { getJob, getAllJobs, createJob, changeJob, deleteJob };