import { body } from "express-validator";

import { ErrorMessages } from "./error.messages";
import { VALID_CHARACTERS } from "./regex/regex.validation";
import { principal_address_validations, principal_service_address_validations } from "./fields/address.validation";
import { public_register_validations } from "./fields/public-register.validation";
import { checkAtLeastOneFieldHasValue } from "./custom.validation";
import { start_date_validations } from "./fields/date.validation";

export const beneficialOwnerOther = [
  body("name")
    .not().isEmpty({ ignore_whitespace: true }).withMessage(ErrorMessages.BENEFICIAL_OWNER_OTHER_NAME)
    .isLength({ max: 160 }).withMessage(ErrorMessages.MAX_NAME_LENGTH)
    .matches(VALID_CHARACTERS).withMessage(ErrorMessages.NAME_INVALID_CHARACTERS),

  ...principal_address_validations,

  body("is_service_address_same_as_principal_address")
    .not().isEmpty().withMessage(ErrorMessages.SELECT_IF_BENEFICIAL_OWNER_OTHER_SERVICE_ADDRESS_SAME_AS_PRINCIPAL_ADDRESS),

  ...principal_service_address_validations,

  body("legal_form")
    .not().isEmpty({ ignore_whitespace: true }).withMessage(ErrorMessages.LEGAL_FORM)
    .isLength({ max: 4000 }).withMessage(ErrorMessages.MAX_LEGAL_FORM_LENGTH)
    .matches(VALID_CHARACTERS).withMessage(ErrorMessages.LEGAL_FORM_INVALID_CHARACTERS),

  body("law_governed")
    .not().isEmpty({ ignore_whitespace: true }).withMessage(ErrorMessages.LAW_GOVERNED)
    .isLength({ max: 4000 }).withMessage(ErrorMessages.MAX_LAW_GOVERNED_LENGTH)
    .matches(VALID_CHARACTERS).withMessage(ErrorMessages.LAW_GOVERNED_INVALID_CHARACTERS),

  body("is_on_register_in_country_formed_in")
    .not().isEmpty().withMessage(ErrorMessages.SELECT_IF_BENEFICIAL_OWNER_OTHER_REGISTER_IN_COUNTRY_FORMED_IN),

  ...public_register_validations,

  body("beneficial_owner_nature_of_control_types").custom((value, { req }) => {
    checkAtLeastOneFieldHasValue("Select the other legal entity’s nature of control", req.body.beneficial_owner_nature_of_control_types, req.body.trustees_nature_of_control_types, req.body.non_legal_firm_members_nature_of_control_types);
  }),

  ...start_date_validations
];
