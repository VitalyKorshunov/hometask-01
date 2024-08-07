import {req} from './test-helpers'
// import {setDB} from '../src/db/db'
// import {dataset1} from './datasets'
import {SETTINGS} from '../src/settings'
import {setDB} from "../src/db/db";
import {Resolutions} from "../src/input-output-types/video-types";

describe('/videos', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
        setDB()
    })

    it('should get empty array', async () => {
        // setDB() // очистка базы данных если нужно

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200) // проверяем наличие эндпоинта

        expect(res.body.length).toBe(0) // проверяем ответ эндпоинта
    })

    let video1: any;
    it('should create new video with status 201', async () => {
        video1 = {
            title: 'Video1',
            author: 'Vitaly',
            availableResolutions: [Resolutions.P360]
        }

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(video1)
            .expect(201)

        video1 = res.body
    })

    let video2: any;
    it('shouldn\'t create new video with status 400', async () => {
        video2 = {
            title: 111,
            author: 'Vitaly',
            availableResolution: ['P360']
        }

        await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(video2)
            .expect(400)
    })

    it('should get not empty array', async () => {
        // setDB(dataset1) // заполнение базы данных начальными данными если нужно

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200)

        console.log(res.body)

        expect(res.body.length).toBe(1)
        // expect(res.body[0]).toEqual(dataset1.videos[0])
    })

    let video3: any;
    it('should create new video3 with status 201', async () => {
        video3 = {
            title: 'Video3',
            author: 'Ivan',
            availableResolutions: [Resolutions.P360]
        }

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(video3)
            .expect(201)

        video3 = res.body
    })

    it('should get 2 videos array', async () => {
        // setDB(dataset1) // заполнение базы данных начальными данными если нужно

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200)

        expect(res.body.length).toBe(2)
        // expect(res.body[0]).toEqual(dataset1.videos[0])
    })

    it('should be find video3 in db witch correct data', async () => {
        const res = await req
            .get(`${SETTINGS.PATH.VIDEOS}/${video3.id}`)
            .expect(200)

        expect(res.body).toEqual(video3)
    })

    it('should\t be find video1 in db with incorrect data', async () => {
    await req
            .get(`${SETTINGS.PATH.VIDEOS}/1`)
            .expect(404)
    })

    it('should be delete video3 in db witch correct data', async () => {
    await req
            .delete(`${SETTINGS.PATH.VIDEOS}/${video3.id}`)
            .expect(204)

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200)

        expect(res.body.length).toBe(1)
    })

    it('shouldn\'t be delete video in db witch incorrect data', async () => {
        await req
            .delete(`${SETTINGS.PATH.VIDEOS}/0`)
            .expect(404)

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200)

        console.log(res.body)

        expect(res.body.length).toBe(1)
    })

    it('should update video1 with correct data', async () => {

        const newData = {
            title: "string",
            author: "string",
            availableResolutions: [
                "P144"
            ],
            canBeDownloaded: true,
            minAgeRestriction: 18,
            publicationDate: '2024-08-03T21:13:05.387Z'
        }

        const changedVideo = Object.assign({}, video1, newData)

        await req
            .put(`${SETTINGS.PATH.VIDEOS}/${video1.id}`)
            .send(newData)
            .expect(204)

        const res = await req
            .get(`${SETTINGS.PATH.VIDEOS}/${video1.id}`)
            .expect(200)

        expect(res.body).toEqual(changedVideo)
    })

    it('shouldn\'t update video1 with incorrect data', async () => {

        const newData = {
            title: '123',
            author: "",
            lll: 22,
            availableResolutions: [
                "P144"
            ],
            canBeDownloaded: true,
            minAgeRestriction: 18,
            publicationDate: '2024-08-04T24:21:33.000Z'
        }

        const changedVideo = Object.assign({}, video1, newData)

        await req
            .put(`${SETTINGS.PATH.VIDEOS}/${video1.id}`)
            .send(newData)
            .expect(400)

        const res = await req
            .get(`${SETTINGS.PATH.VIDEOS}/${video1.id}`)

        expect(res).not.toEqual(changedVideo)
    })
})