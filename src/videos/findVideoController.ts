import {Request, Response} from 'express'
import {db} from '../db/db'
import {OutputVideoType, VideoIdType} from "../input-output-types/video-types";


export const findVideoController = (req: Request<VideoIdType>, res: Response<OutputVideoType[]>) => {
    const video = db.videos.find(video => video.id === +req.params.id) // получаем видео из базы данных

    if (!video) {
        res.sendStatus(404);
        return;
    }

    res
        .status(200)
        .json(video) // отдаём видео в качестве ответа
}

