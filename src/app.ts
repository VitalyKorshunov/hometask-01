import express from 'express'
import cors from 'cors'
import {SETTINGS} from "./settings";
import {getVideosController} from "./videos/getVideosController";
import {videosRouter} from "./videos";
import {testingRouter} from "./testing";

export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
app.use(cors()) // разрешить любым фронтам делать запросы на наш бэк

app.get('/', (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({version: '1.04'})
})

// app.get(SETTINGS.PATH.VIDEOS, getVideosController)
app.use(SETTINGS.PATH.TESTING_ALL_DATA, testingRouter)

app.use(SETTINGS.PATH.VIDEOS, videosRouter)
