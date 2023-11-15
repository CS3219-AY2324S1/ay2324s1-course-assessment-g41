import { Router } from 'express'
import * as RoomController from '../controllers/room-controller'
import { authJWT } from "../../../../shared/middleware/auth-middleware"

const roomRouter = Router()

// TODO: add verifier for microservice to call createRoom, otherwise reject request
// endpoints for other services
roomRouter.post('/', RoomController.createRoom)
roomRouter.get('/:roomName/status', RoomController.isRoomOpen)
roomRouter.get('/:userId', RoomController.getRoomsWithUser)

// indempotency
// auth JWT endpoints, for client
roomRouter.get('/:roomName/access', authJWT, RoomController.checkUserInRoom)
roomRouter.put('/:roomName/status/close', authJWT, RoomController.closeRoom)
roomRouter.put('/:roomName/status/open', authJWT, RoomController.openRoom)



export default roomRouter