

import process from "process";
import express, {Express,Request,Response} from "express";
import bodyParser  from "body-parser";
import axios ,{AxiosResponse} from "axios";



type EAInput = {
    id:number | string;
    data :{
        number:number|string;
        infoType:string;
    }
}

type EAOutput = {
    jobRunId: string | number;
    statusCode:number;
    data:{
        result_?:any
    }
    error?:string
}

const PORT = process.env.PORT || 8050

const app: Express=  express();

app.use(bodyParser.json())

app.get("/",(req:Request,res:Response) => {
    res.send("External Adapters says aaaaaaaaaaaaaaaaaaaaaaaaaaaassssuuuu");
});

// app.post("/", (req:Request,res:Response)=> {
//     const eaInputData:EAInput =req.body ;
//     console.log("Resquest data recived:",eaInputData);
// });


app.post("/",async (req:Request,res:Response)=> {
    const eaInputData:EAInput =req.body ;

    console.log(" Request data received: ", eaInputData);
    // Built the API request to look something like http://numbersapi.com/random/trivia


    console.log("eaResponse  "); 
    const url = `http://numbersapi.com/${eaInputData.data.number}/${eaInputData.data.infoType}`;

    // Build EA's response
    let eaResponse: EAOutput = {
    data: {},
    jobRunId: eaInputData.id,
    statusCode: 0,
    };

    console.log("try  "); 
try {
    const apiResponse:AxiosResponse =  await axios.get(url);

    eaResponse.data = {result_: apiResponse.data};
    eaResponse.statusCode = apiResponse.status;

    console.log("try 2 "); 
    console.log("RETURNED API RESPONSE  ", eaResponse); 

    res.json(eaResponse);

    console.log("try 3 "); 


}catch (error: any){
    console.log("API Response error: ", error);
    eaResponse.error = error.message;
    eaResponse.statusCode =  error. response.status;


    res.json(eaResponse);
}



});

app.listen(PORT,() => {
    console.log(`Listening on port on port ${PORT}.`);
});
