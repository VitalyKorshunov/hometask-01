import {Request, Response} from 'express'
import {db} from '../db/db'
import {InputParamsVideoType, Resolutions} from "../input-output-types/video-types";
import {OutputErrorsType} from "../input-output-types/output-errors-type";

const inputValidation = (query: InputParamsVideoType) => {
    const errors: OutputErrorsType = {
        errorsMessages: []
    }

    const validFields: string[] = ['title', 'author', 'availableResolutions', 'canBeDownloaded', 'minAgeRestriction', 'publicationDate']

    const invalidFields = [];

    for (const key in query) {
        if (!validFields.includes(key)) {
            invalidFields.push(key)
        }
    }

    if (invalidFields.length) {
        errors.errorsMessages.push({
            message: 'Invalid field(s)',
            field: `${invalidFields}`
        })

    }

    if (query.title.length >= 40 || query.title.length < 1) {
        errors.errorsMessages.push({
            message: 'field length must be in the range 1-40',
            field: 'title'
        })
    }

    if ((query.author.length >= 20 || query.author.length < 1)) {
        errors.errorsMessages.push({
            message: 'field length must be in the range 1-20',
            field: 'author'
        })
    }

    if (!Array.isArray(query.availableResolutions)
        || query.availableResolutions.find(p => !Resolutions[p])
    ) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'availableResolution'
        })
    }

    if (typeof query.canBeDownloaded !== 'boolean') {
        errors.errorsMessages.push({
            message: 'field must be boolean type',
            field: 'canBeDownloaded'
        })
    }

    if (typeof query.minAgeRestriction !== 'number'
        || query.minAgeRestriction > 18
        || query.minAgeRestriction < 1) {
        errors.errorsMessages.push({
            message: 'field must be number type and in the range 1-18',
            field: 'minAgeRestriction'
        })
    }

    return errors;
}

export const changeVideoController = (req: Request<any>, res: Response<OutputErrorsType>) => {
    const body: any = req.body

    const errors = inputValidation(body)

    if (errors.errorsMessages.length) {
        res.status(400).json(errors)
        return;
    }

    const video = db.videos.find(video => video.id === +req.params.id) // получаем видео из базы данных

    if (!video) {
        res.sendStatus(404);
        return;
    }

    for (let key in body) {
        video[key] = body[key]
    }

    db.videos = db.videos.map((e) => (e.id === video.id) ? video : e)

    res
        .sendStatus(204)
}

