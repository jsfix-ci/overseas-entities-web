import { Request, Response, NextFunction } from 'express';

import { logger } from '../utils/logger';
import { PRESENTER_URL } from '../config';

import {
  checkUserSignedIn,
  getLoggedInUserEmail
} from "../utils/session";

export const authentication = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!checkUserSignedIn(req.session)) {
      logger.info('User not authenticated, status_code=401, redirecting to sign in page');
      return res.redirect(`/signin?return_to=${PRESENTER_URL}`);
    }

    logger.info(`User (${getLoggedInUserEmail(req.session)}) is signed in`);
    next();

  } catch (err) {
    logger.error(err);
    next(err);
  }
};