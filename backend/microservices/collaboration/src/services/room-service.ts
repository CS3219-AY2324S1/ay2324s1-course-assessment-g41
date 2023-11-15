import { Room } from "../models/room"
import { generateSlug } from "random-word-slugs";
import { knexPgClient } from "@/clients/pg-knex";
import { RoomUser } from "@/models/room-user";

export class RoomService {
  static async openRoom(roomName: string, userId: string) {
    if (!(await RoomService.doesUserHaveAccessToRoom(userId, roomName))) {
      throw new Error(`This user does not have access to the room.`)
    }
    const updatedRoom = await knexPgClient("Room").where("name", roomName).update({
      isOpen: true
    }, ["id", "isOpen", "name"])
    console.log("updated room", updatedRoom)
  }

  static async closeRoom(roomName: string, userId: string) {
    if (!(await RoomService.doesUserHaveAccessToRoom(userId, roomName))) {
      throw new Error(`This user does not have access to the room.`)
    }

    console.log('closing room', roomName)
    
    // set isOpen to false
    const updatedRoom = await knexPgClient("Room").where("name", roomName).update({
      isOpen: false
    }, ["id", "isOpen", "name"])

    console.log("closed room", updatedRoom)
    // TODO: @didy send attempt to attempt service via MQ 
  }

  static async createRoom(userId1: string, userId2: string) {
    const { roomName } = await RoomService.generateRoomName();
    console.log('write into db', userId1, userId2)
    const room: Room[] = await knexPgClient("Room").insert({
      name: roomName,
      isOpen: true, // let room be open on creation
    }, ["id", "name", "isOpen"])

    const toInsert = [{ roomName, userId: userId1 }, { roomName, userId: userId2 }];
    console.log("BEFORE INSERT DATA", JSON.stringify(toInsert));
    await knexPgClient("RoomUser").insert(toInsert);
    console.log('complete db insertion', room[0])
    return { room: room[0] }
  }

  static async isRoomOpen(roomName: string) {
    const record: Room[] = await knexPgClient.from("Room").select("*").where("name", roomName);
    if (record.length === 0) {
      return false;
    }

    const { isOpen } = record[0];
    return isOpen;
  }

  static async doesUserHaveAccessToRoom(userId: string, roomName: string) {
    if (!userId || !roomName) {
      console.log("missing arguments", userId, roomName)
      return false;
    }
    console.log("checking does user have access to room");
    const record: RoomUser[] = await knexPgClient.from("RoomUser").select("*").where({roomName}).where({userId});
    console.log('getting resut if user has access to room', record)
    return record.length > 0;
  }

  private static async generateRoomName() {
    console.log('generating room name')
    let slug = "";
    while (true) {
      slug = generateSlug()
      const rooms: Room[] = await knexPgClient.from("Room").select("*").where("name", slug)
      console.log('retrieved room', rooms)
      if (!rooms || rooms.length === 0) {
        console.log('generated room name', slug)
        break
      }
    }

    return { roomName: slug }
  }

  static async getRoomsWithUser(userId: string) {
    const record: RoomUser[] = await knexPgClient.from("RoomUser").select("*").where({ userId });
    console.log(`found ${record} rooms with ${userId}`);
    return record.map(rec => rec.roomName);
  }
}