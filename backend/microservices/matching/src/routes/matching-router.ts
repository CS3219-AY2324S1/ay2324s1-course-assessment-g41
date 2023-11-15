import { Router } from "express";
import * as MatchingController from "@/controllers/matching-controller";
import { authJWT } from "../../../../shared/middleware/auth-middleware";

const matchingRouter = Router();
matchingRouter.use(authJWT);

matchingRouter.get("/request/status", MatchingController.getMatchingStatus);
matchingRouter.post("/request", MatchingController.pushMatchRequestToQueue);
matchingRouter.delete("/pair", MatchingController.removeMatchingPair);

export default matchingRouter;
