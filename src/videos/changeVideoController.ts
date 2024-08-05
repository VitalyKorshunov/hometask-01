import {Request, Response} from 'express'
import {db} from '../db/db'
import {InputParamsVideoType, Resolutions, validFields} from "../input-output-types/video-types";
import {OutputErrorsType} from "../input-output-types/output-errors-type";

const inputValidation = (changedVideo: InputParamsVideoType) => {

    function isValidISODate(dateString: string) {
        try {
            const date = new Date(`${dateString}`);
            return date.toISOString() === dateString;
        } catch (error) {
            if (error instanceof RangeError) {
                return false;
            }

            throw error;
        }
    }

    const errors: OutputErrorsType = {
        errorsMessages: []
    }

    const invalidFields = [];

    for (const key in changedVideo) {
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

    if (typeof changedVideo.title !== 'string'
        || changedVideo.title.length >= 40
        || changedVideo.title.length < 1) {
        errors.errorsMessages.push({
            message: 'field length must be in the range 1-40',
            field: 'title'
        })
    }

    if (typeof changedVideo.author !== 'string'
        || changedVideo.author.length >= 20
        || changedVideo.author.length < 1) {
        errors.errorsMessages.push({
            message: 'field length must be in the range 1-20',
            field: 'author'
        })
    }

    if (!Array.isArray(changedVideo.availableResolutions)
        || changedVideo.availableResolutions.find(p => !Resolutions[p])
    ) {
        errors.errorsMessages.push({
            message: 'error!!!!', field: 'availableResolution'
        })
    }

    if (typeof changedVideo.canBeDownloaded !== 'boolean') {
        errors.errorsMessages.push({
            message: 'field must be boolean type',
            field: 'canBeDownloaded'
        })
    }

    if (typeof changedVideo.minAgeRestriction !== 'number'
        || changedVideo.minAgeRestriction > 18
        || changedVideo.minAgeRestriction < 1) {
        errors.errorsMessages.push({
            message: 'field must be number type and in the range 1-18',
            field: 'minAgeRestriction'
        })
    }

    if (!isValidISODate(changedVideo.publicationDate)) {
        errors.errorsMessages.push({
            message: 'must be a valid date',
            field: 'publicationDate'
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

