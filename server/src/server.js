import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import todoRouter from "./routes/todo.routes.js";

dotenv.config();

const port = process.env.SERVER_PORT;

let app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/todo',todoRouter);


app.listen(port,(err)=>{
    if(!err){
        console.log(`Server listening to port ${port}`);
        return;
    }
    console.log(`Error in Launching Server:: ${err}`);
})