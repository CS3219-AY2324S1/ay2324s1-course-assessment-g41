import Redis from "ioredis";

const complexityMatchingRequestCacheUrl =
  process.env.MATCHING_REQUEST_REDIS_URL;

if (!complexityMatchingRequestCacheUrl) {
  console.log("Missing env variable complexityMatchingRequestCacheUrl");
  process.exit();
}

const complexityMatchingRequestCache = new Redis(
  complexityMatchingRequestCacheUrl
);

export default complexityMatchingRequestCache;
