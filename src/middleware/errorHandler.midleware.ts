import { NextFunction, Request, Response } from "express";


class customError extends Error{
    public statusCode: number;
    constructor(message:string, statusCode:number){
        super(message);
        this.statusCode = statusCode
    }
};

export const newError = (message:string, statusCode:number) =>{
    return new customError(message, statusCode)
};

export const handleCustomError = (error:Error, req:Request, res:Response, next:NextFunction) =>{
    if (error instanceof customError){
        res.status(error.statusCode).json({
            success:false,
            payload:error.message
        })
    }else {
      console.log(error)
        res.status(500).json({
            success:false,
            payload:"Something went wrong"
        })
    }
}