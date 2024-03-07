// importing packages
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet  from 'helmet';

import mongoSanitize from 'express-mongo-sanitize';

// Swagger API packages for API documentation
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from 'swagger-jsdoc';

// importing files
import connectDb from './config/db.js';

// importing routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import JobRoutes from './routes/JobRoutes.js';
import errroMiddelware from './middelwares/error-middelware.js';

// config dotenv
dotenv.config();

// Swagger API config
const options={
    definition:{
        openAPI: "3.0",
        info:{
            title:"Job portal web-application",
            description:"Node js and express js based full stack project",
        },
        servers:[
            {
                url: "http://localhost:5000"
            },
        ],
    },
    apis:["./routes/*.js"],
}

const spec= swaggerDoc(options);

// creating server
const server=express();

// connection with db.js (mongodb connection)
connectDb();

// middelwares
server.use(helmet());
server.use(mongoSanitize());
server.use(express.json());
server.use(cors()); 



server.use("/auth",authRoutes);
server.use('/user',userRoutes);
server.use('/job',JobRoutes);

// documentation route
server.use("/api-doc",swaggerUi.serve, swaggerUi.setup(spec));


server.use(errroMiddelware);

server.listen(5000,()=>{
    console.log("listning on port 5000");
});

