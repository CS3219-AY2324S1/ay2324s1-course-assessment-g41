import Redis from "ioredis";
import JSONCache from "redis-json";

const complexityMatchingPairCacheUrl = process.env.MATCHING_PAIR_REDIS_URL;

if (!complexityMatchingPairCacheUrl) {
  console.log("Missing env variable complexityMatchingPairCacheUrl");
  process.exit();
}

const redis = new Redis(complexityMatchingPairCacheUrl);

const complexityMatchingPairCache = new JSONCache(redis);

export default complexityMatchingPairCache;
