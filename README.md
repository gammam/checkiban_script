# checkiban_script

This simple script read a csv file structured as 

``` codiceFiscale;iban;;;;;; ```

for each row, call validateAccountHolder service (as PERSON_LEGAL) and collect all response in a csv file structured as 

``` requestId,status,account,taxCode,validationStatus,errorCode,errorDescription ```


To start process your file add your secrets 
``` .env.<environment> ```

then execute

``` npm update ```
``` node main.js ```



