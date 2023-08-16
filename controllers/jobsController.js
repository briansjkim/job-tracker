import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { checkPermissions } from "../utils/checkPermissions.js";
import mongoose from "mongoose";
import moment from "moment";

const createJob = async (req, res) => {
  const { position, company } = req.body;

  // we only want to check if the position and company are in the req.body because all of the other fields have a default
  if (!position || !company) {
    throw new BadRequestError("Please Provide All Values");
  }
  // req.user is assigned in the auth middleware
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (req, res) => {
  const { search, status, workEnv, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  // if status is 'all', then we want to return everything in the jobs collection
  // because 'all' isn't an option in the model, we want to specify this
  if (status && status !== "all") {
    queryObject.status = status;
  }

  // same reasoning as status
  if (workEnv && workEnv !== "all") {
    queryObject.workEnv = workEnv;
  }

  // search will just be added conditionally
  // using $regex, we won't be going for the exact match. Instead, we'll just be pattern matching
  // so, if search is 'e', we'll get all results where the position has the letter 'e'
  // 'i' in options means case insensitivity
  if (search) {
    queryObject.company = { $regex: search, $options: "i" };
  }

  // no AWAit because we want to chain the sort conditions
  // by not using AWAIT, we want to delay the results so that we can modify what we receive
  let result = Job.find(queryObject);

  // This is why we don't want to use await when we're first finding the jobs.
  // Because we're sorting before the result is set
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError("Please Provide All Values");
  }

  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    return new NotFoundError(`No job with id ${jobId}`);
  }

  // ** check permissions
  // users, besides admin, should not be able to see other users' jobs
  checkPermissions(req.user, job.createdBy);

  // ** req.body is going to be the fields that have been updated
  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  // ** only for testing
  res.status(StatusCodes.OK).json({ updatedJob });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    return new NotFoundError(`No job with id ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  // built-in model method
  await job.deleteOne({ _id: jobId });

  res.status(StatusCodes.OK).json({ msg: "Successfully removed job" });
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    // stage 1: filter jobs by ones created by specific user
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    // stage 2: group filtered jobs by status and calculate the total quantity per status
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  // stats is currently an array, but we want to return it as an object and then each status value will equal to to the acc
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  // in the case that a status has no applications, we want to send back 0 so that the f/e doesn't get undefined
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        // grouping by the job id
        _id: {
          year: {
            // groups jobs based on when they were created in a specific year
            $year: "$createdAt",
          },
          month: {
            // groups jobs based on when they were created in a specific month
            $month: "$createdAt",
          },
        },
        count: { $sum: 1 },
      },
    },
    // sorts by the most recent jobs first
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    // limits jobs from the last 6 months
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = moment()
        // moment counts the months from 0-11 while mongodb counts from 1-12
        .month(month - 1)
        .year(year)
        .format("MMM Y");

      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
