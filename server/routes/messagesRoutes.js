import express from "express";
import authUser from "../middleware/authUser.js";
import {
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

// //Route  - "/api/message/users"
//Des    - for getting all users execpt the one logged in
//Access - Public
//Method - GET
//Params - none
//Body   - none
messageRouter.get("/users", authUser, getUsersForSidebar);

// //Route  - "/api/message/:id"
//Des    - get messages for specific id
//Access - Public
//Method - GET
//Params - none
//Body   - none
messageRouter.get("/:id", authUser, getMessages);

// //Route  - "/api/message/mark/:id"
//Des    - mark messages as seen
//Access - Public
//Method - PUT
//Params - none
//Body   - none
messageRouter.put("/mark/:id", authUser, markMessageAsSeen);

// //Route  - "/api/message/send/:id"
//Des    - mark messages as seen
//Access - Public
//Method - PUT
//Params - none
//Body   - none
messageRouter.post("/send/:id", authUser, sendMessage);

export default messageRouter;
