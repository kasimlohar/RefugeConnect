const Job = require('../models/Job');

module.exports = {
    getPaginatedJobs: async (page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return await Job.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    },
};
