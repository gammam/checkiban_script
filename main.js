
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

myCheckiban.fromCsvToCsv(inputFile,2,100,outputFile)

for (let step = 1; step < 3; step++) {
    // Runs 5 times, with values of step 0 through 4.
    var firstStep = (step)*100+1;
    var lastStep = firstStep+99;
    
    setTimeout(myCheckiban.fromCsvToCsv,5000*step,inputFile,firstStep,lastStep,outputFile)


  }

