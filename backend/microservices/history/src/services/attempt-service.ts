import AttemptMessageData from "@/models/attempt-message-data";
import AttemptModel from "@/models/attempt";

const upsertAttempt = async (attemptData: AttemptMessageData) => {
  const options = {
    upsert: true
  }

  const query = {
    attemptId: attemptData.attemptId,
  }
  console.log('attempting to upsert', query, attemptData);
  const doc = await AttemptModel.findOneAndUpdate(query, attemptData, options)
  console.log("Upserted into attempt collection", doc?.attemptId, doc?.roomName, doc?.text, doc?.language?.label)
  return doc;
}

const findAttemptFromDatabase = async (attemptId: number, roomName: string) => {
  const query = { attemptId, roomName }
  try {
    const doc = await AttemptModel.findOne(query)
    console.log("Found doc from attempt collection", doc);
    return doc;
  } catch (err) {
    console.error(err);
    return null;
  }
}

const findAllAttemptsFrom = async (roomName: string) => {
  const query = { roomName };
  const doc = await AttemptModel.find(query).sort('attemptId');
  console.log("Found all attempts from room", doc);
  return doc;
}

export {
  upsertAttempt,
  findAttemptFromDatabase,
  findAllAttemptsFrom
};
