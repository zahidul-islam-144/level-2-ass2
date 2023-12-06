import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import userRouter from './app/modules/User/userRoutes';
import { errorHandler } from './app/middlewares/errorHandlerMiddlware';
const app: Application = express();

//added middlewares
app.use(helmet());
app.use(express.json());
app.use(cors<Request>());
app.use(express.urlencoded({ extended: false }));




// registered all application routes
app.use('/api/users', userRouter);

app.get('/', (req: Request, res: Response) => {
    // const customResponse = new CustomResponse(res);
    // customResponse.sendResponse({
    //   statusCode: 200,
    //   success: true,
    //   message: 'Welcome to the Assignment-2 server.',
    //   data: null,
    // });
    res.sendFile('/app/utils/welcome.html', {root: __dirname})
  });

  
// handled invalid routes
// app.all('*', (req,res)=>{
//     const sendResponse = new ResponseTemplate(false, 400, 'Invalid request. Check your url carefully.');
//     res.send(sendResponse);
// })

//global error middleware
app.use(errorHandler);

export default app;
