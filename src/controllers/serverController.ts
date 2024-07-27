/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express";
import taskService from "../services/taskService.js";

export const apiRouter = express.Router();

apiRouter.get("/tasks", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.json(taskService.getTasks());
});
