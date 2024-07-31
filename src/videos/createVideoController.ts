import {Response, Request} from 'express'
import {OutputErrorsType} from '../input-output-types/output-errors-type'
import {db} from '../db/db'
import {InputVideoType, Resolutions} from '../input-output-types/video-types'
import {VideoDBType} from "../db/video-db-type";

const inputValidation = (video: InputVideoType) => {
    const errors: OutputErrorsType = { // объект для сбора ошибок
        errorsMessages: []
    }
// ...
    if (!Array.isArray(video.availableResolution)
        || video.availableResolution.find(p => !Resolutions[p])
    ) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'availableResolution'
        })
    }

    if (typeof video.title !== 'string') {
        errors.errorsMessages.push({
            message: `Field title should be a 'string'. Current: '${typeof video.title}'`,
            field: 'title'
        })
    }

    if (typeof video.author !== 'string') {
        errors.errorsMessages.push({
            message: `Field author should be a 'string'. Current: '${typeof video.author}'`,
            field: 'author'
        })
    }
        return errors
}

export const createVideoController = (req: Request<any, any, InputVideoType>, res: Response<any /*OutputVideoType*/ | OutputErrorsType>) => {
    const errors = inputValidation(req.body)
    if (errors.errorsMessages.length) { // если есть ошибки - отправляем ошибки
        res
            .status(400)
            .json(errors)
        return
    }

    const dateNow = Date.now();
    const createdAtISO = new Date(dateNow).toISOString();
    const publicationDate = (new Date(dateNow));
    publicationDate.setDate(publicationDate.getDate() + 1)
    const publicationDateISO = publicationDate.toISOString()

    // если всё ок - добавляем видео
    const newVideo: VideoDBType = {
        ...req.body,
        id: dateNow + Math.random(),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAtISO,
        publicationDate: publicationDateISO,
    }
    db.videos = [...db.videos, newVideo]

    res
        .status(201)
        .json(newVideo)
}