import {Router} from "express";
import {deleteAllDataController} from "./deleteAllDataController";
import {SETTINGS} from "../settings";

export const testingRouter = Router();

testingRouter.delete('/', deleteAllDataController)