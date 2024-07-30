import {setDB} from "../db/db";
import {Request, Response} from "express";

export const deleteAllDataController = (req: Request, res: Response<any>) => {
    setDB();
    res.sendStatus(204)
};