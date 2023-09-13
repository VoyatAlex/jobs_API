const express = require('express');
const router = express.Router();
const { getJob, getAllJobs, createJob, changeJob, deleteJob } = require('../controllers/jobs.js');

router.route('/').get(getAllJobs).post(createJob)
router.route('/:id').get(getJob).patch(changeJob).delete(deleteJob);

module.exports = router;