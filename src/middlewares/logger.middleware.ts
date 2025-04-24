import { NextFunction, Request, Response } from 'express';

export function loggerGlobal(req: Request, res: Response, next: NextFunction) {
  const currentDate = new Date().toISOString();
  res.on('finish', () => {
    console.log(
      `Method/${req.method} Route(${req.url}) Date/${currentDate} Status/${res.statusCode}`,
    );
  });

  next();
}
