import {req} from './test-helpers'
// import {setDB} from '../src/db/db'
// import {dataset1} from './datasets'
import {SETTINGS} from '../src/settings'
import {setDB} from "../src/db/db";
import {dataset1} from "./datasets";
import {InputVideoType, Resolutions} from "../src/input-output-types/video-types";

describe('/videos', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
        setDB()
    })

    it('should get empty array', async () => {
        // setDB() // очистка базы данных если нужно

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200, []) // проверяем наличие эндпоинта

        console.log(res.status) // можно посмотреть ответ эндпоинта
        console.log(res.body) // можно посмотреть ответ эндпоинта

        // expect(res.body.length).toBe(0) // проверяем ответ эндпоинта
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

        console.log(res.status) // можно посмотреть ответ эндпоинта
        console.log(res.body) // можно посмотреть ответ эндпоинта
        video1 = res.body
    })

    let video2: any;
    it('shouldn\'t create new video with status 400', async () => {
        video2 = {
            title: 111,
            author: 'Vitaly',
            availableResolution: ['P360']
        }

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(video2)
            .expect(400)

        console.log(res.status) // можно посмотреть ответ эндпоинта
        console.log(res.body) // можно посмотреть ответ эндпоинта
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

        console.log(res.status) // можно посмотреть ответ эндпоинта
        console.log(res.body) // можно посмотреть ответ эндпоинта
        video3 = res.body
    })

    it('should get 2 videos array', async () => {
        // setDB(dataset1) // заполнение базы данных начальными данными если нужно

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200)

        console.log(res.body)

        expect(res.body.length).toBe(2)
        // expect(res.body[0]).toEqual(dataset1.videos[0])
    })

    it('should be find video3 in db witch correct data', async () => {
        const res = await req
            .get(`${SETTINGS.PATH.VIDEOS}/${video3.id}`)
            .expect(200)
        expect(res.body).toEqual(video3)

        console.log(res.status)
        console.log(res.body)

    })

    it('should\t be find video1 in db with incorrect data', async () => {
        const res = await req
            .get(`${SETTINGS.PATH.VIDEOS}/1`)
            .expect(404)

        console.log(res.status)
        console.log(res.body)

    })

    it('should be delete video3 in db witch correct data', async () => {
        const res = await req
            .delete(`${SETTINGS.PATH.VIDEOS}/${video3.id}`)
            .expect(204)

        console.log(res.status)
        console.log(res.body)

        const res2 = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200)

        console.log(res2.body)

        expect(res2.body.length).toBe(1)
    })

    it('shouldn\'t be delete video in db witch incorrect data', async () => {
        const res = await req
            .delete(`${SETTINGS.PATH.VIDEOS}/0`)
            .expect(404)

        console.log(res.status)
        console.log(res.body)

        const res2 = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200)

        console.log(res2.body)

        expect(res2.body.length).toBe(1)
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
            publicationDate: new Date().toISOString()
        }

        const changedVideo1 = Object.assign({}, video1, newData)

        const res = await req
            .put(`${SETTINGS.PATH.VIDEOS}/${video1.id}`)
            .send(newData)
            .expect(204)

        const res2 = await req
            .get(`${SETTINGS.PATH.VIDEOS}/${video1.id}`)
            .expect(200)

        expect(res2.body).toEqual(changedVideo1)
        console.log(res2.status)
        console.log(res2.body)
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
            publicationDate: new Date().toISOString()
        }

        const changedVideo1 = Object.assign({}, video1, newData)

        const res = await req
            .put(`${SETTINGS.PATH.VIDEOS}/${video1.id}`)
            .send(newData)
            .expect(400)

        console.log(res.body)

        // const res2 = await req
        //     .get(`${SETTINGS.PATH.VIDEOS}/${video1.id}`)
        //     .expect(200)
        //
        // expect(res2.body).toEqual(changedVideo1)
        // console.log(res2.status)
        // console.log(res2.body)
    })


    // it('should create', async () => {
    //     setDB()
    //     const newVideo: any /*InputVideoType*/ = {
    //         title: 't1',
    //         author: 'a1',
    //         availableResolution: ['P144' /*Resolutions.P144*/]
    //         // ...
    //     }
    //
    //     const res = await req
    //         .post(SETTINGS.PATH.VIDEOS)
    //         .send(newVideo) // отправка данных
    //         .expect(201)
    //
    //     console.log(res.body)
    //
    //     expect(res.body.availableResolution).toEqual(newVideo.availableResolution)
    // })

    // it('shouldn\'t find', async () => {
    //     setDB(dataset1)
    //
    //     const res = await req
    //         .get(SETTINGS.PATH.VIDEOS + '/1')
    //         .expect(404) // проверка на ошибку
    //
    //     console.log(res.body)
    // })
})