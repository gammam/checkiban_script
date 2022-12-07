
import fetch from 'node-fetch';
import { createReadStream ,createWriteStream, exists} from "fs";
import { parse } from "csv-parse";
import { resolve } from 'path/posix';
import  { stringify } from 'csv-stringify';
import dotenv from 'dotenv'

let checkIbanUrl
let secret_api_key

class CheckibanClient {
    constructor(options) {
         checkIbanUrl = options.CHECKIBAN_BASEPATH + options.CHECKIBAN_PATH;
         secret_api_key =  options.CHECKIBAN_API_KEY; 
    }
    fromCsvToCsv(inputFilename,firstElement,lastElement,outputFilename) {
        return checkibanFromCsv(inputFilename,firstElement,lastElement,outputFilename) 
    }
}


const results = []


const filename = "./saved_from_fetch.csv";


const columns = [
  "requestId",
  "status",
  "account",
  "taxCode",
  "validationStatus",
  "errorCode",
  "errorDescription"
];

const stringifier = stringify({ header: true, columns: columns });



async function processData(row) {
     // console.log("processing :", row)
const response =  await fetch(checkIbanUrl,{
        method: 'POST', 
        body: JSON.stringify(row),
        headers :{ 'Api-Key': secret_api_key ,
        'Auth-Schema' : 'S2S', 'Content-Type': 'application/json'} 
    })
// console.log(response)
        //console.log("response headers:",JSON.Stringify(response.headers))
        // const x_request_id = response.headers.get('x-request-id')
const responseHeaders =  response.headers.get('x-request-id')        
const responseData = await response.json()
// ('header:', responseHeaders) 
// console.log('body',responseData )                        

            // console.log('response: ',responseData)
 
            const resultData = {
                'requestId': responseHeaders,
                'status' : responseData.status,
                'account': responseData.payload.account ? responseData.payload.account.value : '-',
                'taxCode': responseData.payload.accountHolder ? responseData.payload.accountHolder.taxCode : '-' ,
                'validationStatus' : responseData.payload ? responseData.payload.validationStatus : '-',
                'errorCode':  responseData.errors[0] ? responseData.errors[0].code : '-',
                'errorDescription' : responseData.errors[0] ? responseData.errors[0].description : '-'
            }
            stringifier.write(resultData)
            // results.push(resultData)
            return resultData
            
}








   const checkibanFromCsv = (inputFilename,firstElement,lastElement,outputFilename ) => {
    console.log('CheckIbanUrl : ', checkIbanUrl) 
    console.log(new Date(),"- Started processing ",inputFilename," from ", firstElement ," to ", lastElement ," rows");
    var writableStream = createWriteStream(outputFilename,{flags:'w'});
    new Promise((resolve, reject) => {  
    const promises = [];
    createReadStream(inputFilename)
    .pipe(parse({delimiter:";",from_line:firstElement, to_line:lastElement}))
    .on("data",function(row){
        // console.log(row);
        const requestItem= {
            requestCode : String(row[0]).concat(row[1]),
            account : {
                value : row[1],
                valueType : "IBAN"
            },
            accountHolder : {
                type : "PERSON_LEGAL",
                taxCode : row[0]
            }
        }
        promises.push(processData(requestItem))
        
        // checkIbanRequest.list.push(requestItem)
    })
    .on("end",async () => {
        await Promise.all(promises);
        resolve();
        // console.log("results:",stringifier)
        stringifier.pipe(writableStream);
        
        console.log(new Date(), "- Finished writing data on ",outputFilename);
    })
    })
}





export default CheckibanClient;