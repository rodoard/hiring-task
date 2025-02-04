import { Request, Response } from 'express';
import { UserEntity } from '../entities';

export const getUserUuid = (req: Request): string | null => {
  const userUuid = (req as { user?: Pick<UserEntity, 'uuid'> }).user?.uuid;
  return userUuid || null;
};

export const requireAuth = (req: Request, res: Response, next: () => void) => {
  const userUuid = getUserUuid(req);
  
  if (!userUuid) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  // Attach userUuid to the request for easy access in subsequent middleware/controllers
  (req as any).userUuid = userUuid;
  next();
};
