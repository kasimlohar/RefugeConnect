const jobService = require('../services/jobService');

test('getPaginatedJobs should return paginated jobs', async () => {
    const jobs = await jobService.getPaginatedJobs(1, 5);
    expect(jobs).toHaveLength(5);
});
