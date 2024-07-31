import {Request, Response} from 'express'
import {db} from '../db/db'
import {OutputVideoType} from "../input-output-types/video-types";

export const findVideoController = (req: Request<{id: number}>, res: Response<OutputVideoType[]>) => {
    const videos = db.videos[req.params.id] // получаем видео из базы данных

    if (!videos) {
        res.sendStatus(404)
        return
    }

    res
        .status(200)
        .json(videos) // отдаём видео в качестве ответа
}

// не забудьте добавить эндпоинт в апп