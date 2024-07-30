import {req} from "./test-helpers";
import {SETTINGS} from "../src/settings";

describe('delete all data', () => {
    it('should be delete all data and get status 204', async () => {
        const res = await req
            .delete(SETTINGS.PATH.TESTING_ALL_DATA)
            .expect(204)

        console.log(res.status)
        console.log(res.body)
    })
})