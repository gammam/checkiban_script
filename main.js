
import  CheckibanClient from "./checkiban.js";
import path from 'node:path';
import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url';









const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.NODE_ENV='uat'
dotenv.config({ path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`)})

 


const outputFile = './out/saved_from_fetch.csv'
const inputFile = './in/pda_iban.csv'
const max_rows = 1000;
const max_concurrent_requests = 100;
const delay_ms = 5000;


const myCheckiban = new CheckibanClient(process.env);

myCheckiban.fromCsvToCsv(inputFile,2,100,outputFile)

for (let step = 1; step < max_rows/max_concurrent_requests; step++) {
    // Runs 5 times, with values of step 0 through 4.
    var firstStep = (step)*max_concurrent_requests+1;
    var lastStep = firstStep+max_concurrent_requests-1;
    
    setTimeout(myCheckiban.fromCsvToCsv,delay_ms*step,inputFile,firstStep,lastStep,outputFile)

  }

