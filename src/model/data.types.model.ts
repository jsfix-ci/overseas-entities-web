export interface Address {
    propertyNameNumber?: string
    addressLine1?: string
    addressLine2?: string
    town?: string
    county?: string
    country?: string
    postcode?: string
}

export enum yesNoResponse {
    No = 0,
    Yes = 1
}

export enum BeneficialOwnerTypeChoice {
    individual = "individual",
    otherLegal = "otherLegal",
    none = "none"
}

export interface InputDate {
    day: number
    month: number
    year: number
}

export enum natureOfControl {
    over25upTo50Percent = "25",
    over50under75Percent = "50",
    atLeast75Percent = "75"
}

export enum statementCondition {
    statement1 = "statement1",
    statement2 = "statement2"
}
