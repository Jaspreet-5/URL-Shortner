const users = new Map();

function rateLimiter(options = {}) {
    const {
        bucketSize = 30,
        windowMS = 4000,
        tokensToAdd = 1,
        refillRate = tokensToAdd / windowMS
    } = options;

    return function (req, res, next) {
        const ip = req.ip;
        const now = Date.now();

        if (!users.has(ip)) {
            users.set(ip, {
                tokens: bucketSize,
                lastRefill: now
            });
        }

        const bucket = users.get(ip);

        const timePassed = now - bucket.lastRefill;
        const tokensToAdd = timePassed * refillRate;

        bucket.tokens = Math.min(bucketSize, bucket.tokens + tokensToAdd);
        bucket.lastRefill = now;

        if (bucket.tokens < 1) {
            return res.status(429).json({
                message: "Too many requests! Please try later"
            });
        }

        bucket.tokens -= 1;

        if(bucket.tokens >= bucketSize && timePassed>60000){
            users.delete(ip);
        }

        next();
    };
}

module.exports = rateLimiter;