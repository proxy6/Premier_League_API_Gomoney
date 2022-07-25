import * as jwt from 'jsonwebtoken';
import { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const SECRET_KEY: Secret = 'JWT_Secret';

export interface CustomRequest extends Request {
 token: string | JwtPayload;
}
export const isAuthorized = (...role: string[])=> async (req: Request, res: Response, next: NextFunction) => {
 try {
   const token = req.header('Authorization')?.replace('Bearer ', '');
   if (!token) return res.status(401).json({message: "User is not Authenticated"});
   const decoded = jwt.verify(token, SECRET_KEY);
   (req as CustomRequest).token = decoded;
    if(role.length && role.includes((decoded as JwtPayload).data.role)){
    next();
   }else{
    res.status(401).json({message:'User is not Authorized'});
   }
 } catch (err) {
  console.log(err)
   res.status(401).send('Unable To Complete Authentication');
 }
};