import express from 'express'
import cors from 'cors'
import schedule from 'node-schedule'
import bootstrap from './src/bootstrap.js'
import { User } from './db/indexImportFilesDB.js'
import { status } from './src/utlis/constant/user_status.js'
const port = 3000

const app = express()
// Delete every user not verified in the system after a month from creating account.
schedule.scheduleJob('1 1 1 * * *', async function(){
    const users = await User.find({status: status.PENDING, createdAt: {$lte: Date.now() - 1 * 30 *24 *60* 60*1000}}).lean()
    const usersIds = users.map((user) => {return user._id})
    await User.deleteMany({_id: {$in: usersIds}})
})
bootstrap(app, express, cors)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))