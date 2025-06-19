import express from "express"

import path from "path"

import cors from "cors"

import { fileURLToPath } from "url"

import sqlite3 from "sqlite3"

import {open} from "sqlite"

const app = express()
app.use(cors())
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, "server.db")
let db
const initializeDBAndServer = async()=>{
    try{
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    })

    app.listen(3000, ()=>{
    console.log("server started running at localhost:3000")
    })
    }catch(e){
        console.log(e.message)
        process.exit(1)
    }
}

initializeDBAndServer()


//get all tasks
app.get("/tasks/", async(request, response)=>{
    const dbQuery = `
        SELECT * FROM task ORDER BY id;
    `
    const tasksList = await db.all(dbQuery)
    response.send(tasksList)
})

//create a task
app.post("/tasks/", async(request, response)=>{
    const body = request.body
    const {title, status, created_at, updated_at} = body

    const dbQuery = `
        INSERT INTO task(title, status, created_at, updated_at)
        VALUES("${title}", "${status}", "${created_at}", "${updated_at}");
    `
    const dbResponse = await db.run(dbQuery)
    // console.log(dbResponse)
    const {lastID} = dbResponse
    response.send(`task with id-${lastID} created`)
})

//update a task
app.put("/tasks/:id/", async(request, response)=>{
    const {id} = request.params
    console.log(id)
    const body = request.body
    const {title, status, updated_at} = body
    const dbQuery = `
        UPDATE task SET title = "${title}", status = "${status}", updated_at = "${updated_at}"
        WHERE id = ${id};
    `
    await db.run(dbQuery)
    // console.log(dbResponse)
    response.send(`task with id-${id} updated successfully`)
})

//delete a task
app.delete("/tasks/:id/", async(request, response)=>{
    const {id} = request.params
    const deleteQuery = `delete from task WHERE id = ${id};`
    await db.run(deleteQuery)
    response.send(`task with id-${id} deleted successfully`)
})