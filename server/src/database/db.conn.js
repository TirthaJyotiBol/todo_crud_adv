import mysql from "mysql2/promise";
import { db_credentials } from "./db.config.js";


export const createDbConnection = async ()=>{
    try{
        let conn = mysql.createConnection(db_credentials);
        console.log(`Database ${db_credentials.database} connected successfully!!!!!`);
        return conn;
    }
    catch(err){
        console.log(`Error in db connection`);
        return null;
    }
}