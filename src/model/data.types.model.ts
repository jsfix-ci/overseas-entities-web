export interface Address {
  property_name_number?: string;
  line_1?: string;
  line_2?: string;
  town?: string;
  county?: string;
  country?: string;
  postcode?: string;
}

export enum yesNoResponse {
  No = 0,
  Yes = 1
}
export interface InputDate {
  day: string;
  month: string;
  year: string;
}

export enum NatureOfControlType {
  over_25_percent_of_shares = "over_25_percent_of_shares",
  over_25_percent_of_voting_rights = "over_25_percent_of_voting_rights",
  appoint_or_remove_majority_board_directors = "appoint_or_remove_majority_board_directors",
  significant_influence_or_control = "significant_influence_or_control"
}

// To be removed
export enum natureOfControl {
  over25upTo50Percent = "25",
  over50under75Percent = "50",
  atLeast75Percent = "75"
}

export enum corpNatureOfControl {
  shares = "shares",
  voting = "voting",
  appoint = "appoint",
  influence = "influence"
}

export enum statementCondition {
  statement1 = "statement1",
  statement2 = "statement2"
}

/*
  Address and InputDate key fields - Position is important for the mapping of sub-fields Address Objects!
*/
export const AddressKeys: string[] = [
  "property_name_number",
  "line_1",
  "line_2",
  "town",
  "county",
  "country",
  "postcode"
];

export const InputDateKeys: string[] = [
  "day",
  "month",
  "year"
];

// Boolean fields need to parsed from string to number
export const HasSameResidentialAddressKey = "is_service_address_same_as_usual_residential_address";
export const HasSamePrincipalAddressKey = "is_service_address_same_as_principal_address";
export const IsOnSanctionsListKey = "is_on_sanctions_list";
export const IsOnRegisterInCountryFormedInKey = "is_on_register_in_country_formed_in";

// Array NOC fields
export const BeneficialOwnerNoc = "beneficial_owner_nature_of_control_types";
export const TrusteesNoc = "trustees_nature_of_control_types";
export const NonLegalFirmNoc = "non_legal_firm_members_nature_of_control_types";
