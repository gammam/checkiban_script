
import  CheckibanClient from "./checkiban.js";
import path from 'node:path';
import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.NODE_ENV='uat'
dotenv.config({ path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`)})



const firstElement = 2
const lastElement = 2
const outputFile = './out/saved_from_fetch.csv'
const inputFile = './in/pda_iban.csv'




const myCheckiban = new CheckibanClient(process.env);
myCheckiban.fromCsvToCsv(inputFile,firstElement,lastElement,outputFile)