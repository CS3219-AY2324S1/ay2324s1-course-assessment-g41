import MongoClient from "@/clients/mongo-mongoose";

const AttemptSchema = new MongoClient.Schema({
  attemptId: Number,
  questionId: String,
  text: String,
  roomName: String,
  language: {
    label: String,
    value: String,
  },
}, {
    timestamps: true,
});

const AttemptModel = MongoClient.model("Attempt", AttemptSchema);

export default AttemptModel;
