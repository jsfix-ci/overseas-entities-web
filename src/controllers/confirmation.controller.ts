import { Request, Response } from "express";

import { logger } from "../utils/logger";
import { CONFIRMATION_PAGE } from "../config";
import { getLoggedInUserEmail } from "../utils/session";
import { deleteApplicationData, getApplicationData } from "../utils/application.data";
import { ApplicationData } from "../model/application.model";
import { Transactionkey } from "../model/data.types.model";
import { WhoIsRegisteringType } from "../model/who.is.making.filing.model";

export const get = (req: Request, res: Response) => {
  logger.debugRequest(req, `GET ${CONFIRMATION_PAGE}`);

  const appData: ApplicationData = getApplicationData(req.session);
  const referenceNumber = appData[Transactionkey];

  deleteApplicationData(req.session);

  return res.render(CONFIRMATION_PAGE, {
    isAgentRegistering: appData.who_is_registering === WhoIsRegisteringType.AGENT,
    referenceNumber,
    entityEmail: appData.entity?.email,
    userEmail: getLoggedInUserEmail(req.session),
    verificationCheckDays: 14,
    templateName: CONFIRMATION_PAGE
  });
};
