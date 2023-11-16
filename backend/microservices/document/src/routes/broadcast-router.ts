import { Extension, onAuthenticatePayload, onChangePayload, onDisconnectPayload, onStatelessPayload, onStoreDocumentPayload } from "@hocuspocus/server";
import * as BroadcastController from "@/controllers/broadcast-controller";

class BroadcastRouter implements Extension {
  async onAuthenticate(data: onAuthenticatePayload) {
    console.log("THIS IS THE AUTH PATH");
    console.log("REQUEST HEADERS", data.requestHeaders);
    console.log("REQUEST PARAMS", data.requestParameters);
    await BroadcastController.checkAuthForUser(data)
  }

  /**
   * Calls to store the attempt at debounced. 
   * This mimics an "auto-save" feature. 
   * @param data contains the data of the document to save iteratively.
   */
  async onStoreDocument(data: onStoreDocumentPayload) {
    await BroadcastController.saveAttempt(data)
  }

  async onStateless(data: onStatelessPayload) {
    await BroadcastController.handleStatelessMessage(data);
  }

  async onDisconnect(data: onDisconnectPayload) {
    await BroadcastController.handleDisconnect(data);
  }
}

const broadcastRouter = new BroadcastRouter()

export default broadcastRouter;