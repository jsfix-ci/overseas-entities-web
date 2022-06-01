import { Router } from "express";

import * as config from "../config";
import {
  beneficialOwnerGov,
  beneficialOwnerIndividual,
  beneficialOwnerOther,
  beneficialOwnerStatements,
  beneficialOwnerType,
  cannotUse,
  checkYourAnswers,
  confirmation,
  entity,
  healthcheck,
  interruptCard,
  landing,
  managingOfficerIndividual,
  managingOfficerCorporate,
  presenter,
  payment,
  soldLandFilter,
  secureRegisterFilter,
  usePaper
} from "../controllers";

import { serviceAvailabilityMiddleware } from "../middleware/service.availability.middleware";
import { authentication } from "../middleware/authentication.middleware";

import { checkValidations } from "../middleware/validation.middleware";
import { validator } from "../validation";

const router = Router();

router.use(serviceAvailabilityMiddleware);

router.get(config.HEALTHCHECK_URL, healthcheck.get);

router.get(config.LANDING_URL, landing.get);

router.get(config.INTERRUPT_CARD_URL, interruptCard.get);

router.get(config.SOLD_LAND_FILTER_URL, soldLandFilter.get);
router.post(config.SOLD_LAND_FILTER_URL, ...validator.soldLandFilter, checkValidations, soldLandFilter.post);

router.get(config.CANNOT_USE_URL, cannotUse.get);

router.get(config.SECURE_REGISTER_FILTER_URL, secureRegisterFilter.get);
router.post(config.SECURE_REGISTER_FILTER_URL, ...validator.secureRegisterFilter, checkValidations, secureRegisterFilter.post);

router.get(config.USE_PAPER_URL, usePaper.get);

router.get(config.PRESENTER_URL, authentication, presenter.get);
router.post(config.PRESENTER_URL, authentication, ...validator.presenter, checkValidations, presenter.post);

router.get(config.ENTITY_URL, authentication, entity.get);
router.post(config.ENTITY_URL, authentication, ...validator.entity, checkValidations, entity.post);

router.get(config.BENEFICIAL_OWNER_STATEMENTS_URL, authentication, beneficialOwnerStatements.get);
router.post(config.BENEFICIAL_OWNER_STATEMENTS_URL, authentication, ...validator.beneficialOwnersStatement, checkValidations, beneficialOwnerStatements.post);

router.get(config.BENEFICIAL_OWNER_TYPE_URL, authentication, beneficialOwnerType.get);
router.post(config.BENEFICIAL_OWNER_TYPE_URL, authentication, ...validator.beneficialOwnersType, checkValidations, beneficialOwnerType.post);

router.get(config.BENEFICIAL_OWNER_INDIVIDUAL_URL, authentication, beneficialOwnerIndividual.get);
router.post(config.BENEFICIAL_OWNER_INDIVIDUAL_URL, authentication, ...validator.beneficialOwnerIndividual, checkValidations, beneficialOwnerIndividual.post);
router.get(config.BENEFICIAL_OWNER_INDIVIDUAL_URL + "/:id", authentication, beneficialOwnerIndividual.get);
router.get(config.BENEFICIAL_OWNER_INDIVIDUAL_URL + "/remove/:id", authentication, beneficialOwnerIndividual.remove);

router.get(config.BENEFICIAL_OWNER_OTHER_URL, authentication, beneficialOwnerOther.get);
router.post(config.BENEFICIAL_OWNER_OTHER_URL, authentication, ...validator.beneficialOwnerOther, checkValidations, beneficialOwnerOther.post);
router.get(config.BENEFICIAL_OWNER_OTHER_URL + "/:id", authentication, beneficialOwnerOther.get);
router.get(config.BENEFICIAL_OWNER_OTHER_URL + "/remove/:id", authentication, beneficialOwnerOther.remove);

router.get(config.BENEFICIAL_OWNER_GOV_URL, authentication, beneficialOwnerGov.get);
router.post(config.BENEFICIAL_OWNER_GOV_URL, authentication, ...validator.beneficialOwnerGov, checkValidations, beneficialOwnerGov.post);
router.get(config.BENEFICIAL_OWNER_GOV_URL + "/:id", authentication, beneficialOwnerGov.get);
router.get(config.BENEFICIAL_OWNER_GOV_URL + "/remove/:id", authentication, beneficialOwnerGov.remove);

router.get(config.MANAGING_OFFICER_URL, authentication, managingOfficerIndividual.get);
router.post(config.MANAGING_OFFICER_URL, authentication, ...validator.managingOfficerIndividual, checkValidations, managingOfficerIndividual.post);
router.get(config.MANAGING_OFFICER_URL + "/:id", authentication, managingOfficerIndividual.get);
router.get(config.MANAGING_OFFICER_URL + "/remove/:id", authentication, managingOfficerIndividual.remove);

router.get(config.MANAGING_OFFICER_CORPORATE_URL, authentication, managingOfficerCorporate.get);
router.post(config.MANAGING_OFFICER_CORPORATE_URL, authentication, ...validator.managingOfficerCorporate, checkValidations, managingOfficerCorporate.post);
router.get(config.MANAGING_OFFICER_CORPORATE_URL + "/:id", authentication, managingOfficerCorporate.get);
router.get(config.MANAGING_OFFICER_CORPORATE_URL + "/remove/:id", authentication, managingOfficerCorporate.remove);

router.get(config.CHECK_YOUR_ANSWERS_URL, authentication, checkYourAnswers.get);
router.post(config.CHECK_YOUR_ANSWERS_URL, authentication, checkYourAnswers.post);

router.get(config.PAYMENT_WITH_TRANSACTION_URL, authentication, payment.get);

router.get(config.CONFIRMATION_URL, authentication, confirmation.get);

export default router;
