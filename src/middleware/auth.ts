import * as jwt from 'jsonwebtoken';
import { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const SECRET_KEY = `${process.env.JWT_SECRET}`;

export interface CustomRequest extends Request {
 token: string | JwtPayload;
}
export const isAuthorized = (...role: string[])=> async (req: Request, res: Response, next: NextFunction) => {
 try {
   const token = req.header('Authorization')?.replace('Bearer ', '');
   if (!token) return res.status(401).json({message: "User is not Authenticated"});
   const decoded = jwt.verify(token, SECRET_KEY);
   (req as CustomRequest).token = decoded;
    if(role.length && role.includes((decoded as JwtPayload).role)){
    next();
   }else{
    res.status(401).json({message:'User is not Authorized'});
   }
 } catch (err) {
  console.log(err)
   res.status(401).json({message:'Unable To Complete Authentication'});
 }
};