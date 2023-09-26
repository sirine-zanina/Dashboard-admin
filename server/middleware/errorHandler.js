import { logEvents } from "./logger.js";

export const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errorLog.log');
    console.log(err.stack);

    const status = res.statusCode ? res.statusCode : 500; // server error

    res.status(status);
    
    res.json({ message : err.message});

}

