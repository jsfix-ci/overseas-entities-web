jest.mock("ioredis");
jest.mock('../../src/middleware/authentication.middleware');
jest.mock('../../src/utils/application.data');

import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { NextFunction, Request, Response } from "express";
import request from "supertest";

import app from "../../src/app";
import { authentication } from "../../src/middleware/authentication.middleware";
import {
  BENEFICIAL_OWNER_INDIVIDUAL_PAGE,
  BENEFICIAL_OWNER_INDIVIDUAL_URL,
  BENEFICIAL_OWNER_TYPE_URL,
  REMOVE
} from "../../src/config";
import { getFromApplicationData, prepareData, removeFromApplicationData, setApplicationData } from '../../src/utils/application.data';
import {
  ANY_MESSAGE_ERROR,
  BENEFICIAL_OWNER_INDIVIDUAL_PAGE_HEADING,
  ERROR_LIST,
  SERVICE_UNAVAILABLE
} from '../__mocks__/text.mock';
import { BENEFICIAL_OWNER_INDIVIDUAL_OBJECT_MOCK, BO_IND_ID, BO_IND_ID_URL, REQ_BODY_BENEFICIAL_OWNER_INDIVIDUAL_EMPTY } from '../__mocks__/session.mock';
import { BeneficialOwnerIndividual, BeneficialOwnerIndividualKey } from '../../src/model/beneficial.owner.individual.model';
import { IsOnSanctionsListKey, HasSameResidentialAddressKey } from '../../src/model/data.types.model';
import {
  BENEFICIAL_OWNER_INDIVIDUAL_WITH_INVALID_CHARS_MOCK,
  BENEFICIAL_OWNER_INDIVIDUAL_WITH_INVALID_CHARS_SERVICE_ADDRESS_MOCK,
  BENEFICIAL_OWNER_INDIVIDUAL_WITH_MAX_LENGTH_FIELDS_MOCK
} from '../__mocks__/validation.mock';
import { ErrorMessages } from '../../src/validation/error.messages';

const mockAuthenticationMiddleware = authentication as jest.Mock;
mockAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next() );

const mockGetFromApplicationData = getFromApplicationData as jest.Mock;
const mockSetApplicationData = setApplicationData as jest.Mock;
const mockPrepareData = prepareData as jest.Mock;
const mockRemoveFromApplicationData = removeFromApplicationData as unknown as jest.Mock;


describe("BENEFICIAL OWNER INDIVIDUAL controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetApplicationData.mockReset();
  });

  describe("GET tests", () => {

    test(`renders the ${BENEFICIAL_OWNER_INDIVIDUAL_PAGE} page`, async () => {
      const resp = await request(app).get(BENEFICIAL_OWNER_INDIVIDUAL_URL);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(BENEFICIAL_OWNER_INDIVIDUAL_PAGE_HEADING);
    });
  });

  describe("GET BY ID tests", () => {

    test("renders the beneficial owner individual page", async () => {
      mockGetFromApplicationData.mockReturnValueOnce(BENEFICIAL_OWNER_INDIVIDUAL_OBJECT_MOCK);
      const resp = await request(app).get(BENEFICIAL_OWNER_INDIVIDUAL_URL + BO_IND_ID_URL);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(BENEFICIAL_OWNER_INDIVIDUAL_PAGE_HEADING);
      expect(resp.text).toContain("Ivan");
      expect(resp.text).toContain("Drago");
      expect(resp.text).toContain("Russian");
    });

    test("catch error when rendering the page", async () => {
      mockGetFromApplicationData.mockImplementationOnce( () => { throw new Error(ANY_MESSAGE_ERROR); });
      const resp = await request(app).get(BENEFICIAL_OWNER_INDIVIDUAL_URL + BO_IND_ID_URL);

      expect(resp.status).toEqual(500);
      expect(resp.text).toContain(SERVICE_UNAVAILABLE);
    });
  });

  describe("POST tests", () => {
    test(`redirects to ${BENEFICIAL_OWNER_TYPE_URL} page`, async () => {
      mockPrepareData.mockImplementationOnce( () => BENEFICIAL_OWNER_INDIVIDUAL_OBJECT_MOCK );

      const resp = await request(app).post(BENEFICIAL_OWNER_INDIVIDUAL_URL);

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(BENEFICIAL_OWNER_TYPE_URL);
    });

    test(`POST only radio buttons choices and redirect to ${BENEFICIAL_OWNER_TYPE_URL} page`, async () => {
      mockPrepareData.mockImplementationOnce( () =>  { return { [IsOnSanctionsListKey]: "1", [HasSameResidentialAddressKey]: "0" }; } );

      const resp = await request(app).post(BENEFICIAL_OWNER_INDIVIDUAL_URL);

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(BENEFICIAL_OWNER_TYPE_URL);
    });

    test(`POST empty object and redirect to ${BENEFICIAL_OWNER_TYPE_URL} page`, async () => {
      mockPrepareData.mockImplementationOnce( () => REQ_BODY_BENEFICIAL_OWNER_INDIVIDUAL_EMPTY );

      const resp = await request(app).post(BENEFICIAL_OWNER_INDIVIDUAL_URL);

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(BENEFICIAL_OWNER_TYPE_URL);
    });

    test(`adds data to the session and redirects to the ${BENEFICIAL_OWNER_TYPE_URL} page`, async () => {
      mockPrepareData.mockImplementationOnce( () => BENEFICIAL_OWNER_INDIVIDUAL_OBJECT_MOCK );

      const resp = await request(app).post(BENEFICIAL_OWNER_INDIVIDUAL_URL);

      const beneficialOwnerIndividual = mockSetApplicationData.mock.calls[0][1];

      expect(beneficialOwnerIndividual).toEqual(BENEFICIAL_OWNER_INDIVIDUAL_OBJECT_MOCK);
      expect(mockSetApplicationData.mock.calls[0][2]).toEqual(BeneficialOwnerIndividualKey);
      expect(resp.status).toEqual(302);

      expect(resp.header.location).toEqual(BENEFICIAL_OWNER_TYPE_URL);
    });

    test("catch error when posting data", async () => {
      mockPrepareData.mockImplementationOnce( () => { throw new Error(ANY_MESSAGE_ERROR); });
      const resp = await request(app).post(BENEFICIAL_OWNER_INDIVIDUAL_URL);

      expect(resp.status).toEqual(500);
      expect(resp.text).toContain(SERVICE_UNAVAILABLE);
    });

    test(`renders the ${BENEFICIAL_OWNER_INDIVIDUAL_PAGE} page with MAX error messages`, async () => {
      const resp = await request(app)
        .post(BENEFICIAL_OWNER_INDIVIDUAL_URL)
        .send(BENEFICIAL_OWNER_INDIVIDUAL_WITH_MAX_LENGTH_FIELDS_MOCK);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(BENEFICIAL_OWNER_INDIVIDUAL_PAGE_HEADING);
      expect(resp.text).toContain(ERROR_LIST);
      expect(resp.text).toContain(ErrorMessages.MAX_FIRST_NAME_LENGTH);
      expect(resp.text).toContain(ErrorMessages.MAX_LAST_NAME_LENGTH);
      expect(resp.text).toContain(ErrorMessages.MAX_PROPERTY_NAME_OR_NUMBER_LENGTH);
      expect(resp.text).toContain(ErrorMessages.MAX_ADDRESS_LINE1_LENGTH);
      expect(resp.text).toContain(ErrorMessages.MAX_ADDRESS_LINE2_LENGTH);
      expect(resp.text).toContain(ErrorMessages.MAX_CITY_OR_TOWN_LENGTH);
      expect(resp.text).toContain(ErrorMessages.MAX_COUNTY_LENGTH);
      expect(resp.text).toContain(ErrorMessages.MAX_POSTCODE_LENGTH);
    });

    test("renders the current page with INVALID_CHARACTERS error message", async () => {
      const resp = await request(app)
        .post(BENEFICIAL_OWNER_INDIVIDUAL_URL)
        .send(BENEFICIAL_OWNER_INDIVIDUAL_WITH_INVALID_CHARS_MOCK);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(BENEFICIAL_OWNER_INDIVIDUAL_PAGE_HEADING);
      expect(resp.text).toContain(ERROR_LIST);
      expect(resp.text).toContain(ErrorMessages.FIRST_NAME_PREFIX + ErrorMessages.INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.LAST_NAME_PREFIX + ErrorMessages.INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.NATIONALITY_PREFIX + ErrorMessages.INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.PROPERTY_NAME_OR_NUMBER_PREFIX + ErrorMessages.INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.ADDRESS_LINE_1_PREFIX + ErrorMessages.INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.ADDRESS_LINE_2_PREFIX + ErrorMessages.INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.CITY_OR_TOWN_PREFIX + ErrorMessages.INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.COUNTY_STATE_PROVINCE_REGION_PREFIX + ErrorMessages.INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.POSTCODE_ZIPCODE_PREFIX + ErrorMessages.INVALID_CHARACTERS);
    });

    test("renders the current page with INVALID_CHARACTERS service address error message", async () => {
      const resp = await request(app)
        .post(BENEFICIAL_OWNER_INDIVIDUAL_URL)
        .send(BENEFICIAL_OWNER_INDIVIDUAL_WITH_INVALID_CHARS_SERVICE_ADDRESS_MOCK);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(BENEFICIAL_OWNER_INDIVIDUAL_PAGE_HEADING);
      expect(resp.text).toContain(ERROR_LIST);

      expect(resp.text).toContain( ErrorMessages.PROPERTY_NAME_OR_NUMBER_PREFIX + ErrorMessages.INVALID_CHARACTERS);
      expect(resp.text).toContain( ErrorMessages.ADDRESS_LINE_1_PREFIX + ErrorMessages.INVALID_CHARACTERS);
      expect(resp.text).toContain( ErrorMessages.ADDRESS_LINE_2_PREFIX + ErrorMessages.INVALID_CHARACTERS);
      expect(resp.text).toContain( ErrorMessages.CITY_OR_TOWN_PREFIX + ErrorMessages.INVALID_CHARACTERS);
      expect(resp.text).toContain( ErrorMessages.COUNTY_STATE_PROVINCE_REGION_PREFIX + ErrorMessages.INVALID_CHARACTERS);
      expect(resp.text).toContain( ErrorMessages.POSTCODE_ZIPCODE_PREFIX + ErrorMessages.INVALID_CHARACTERS);
    });
  });

  describe("UPDATE tests", () => {
    test(`redirects to the ${BENEFICIAL_OWNER_TYPE_URL} page`, async () => {
      mockPrepareData.mockReturnValueOnce(BENEFICIAL_OWNER_INDIVIDUAL_OBJECT_MOCK);
      const resp = await request(app).post(BENEFICIAL_OWNER_INDIVIDUAL_URL + BO_IND_ID_URL);

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(BENEFICIAL_OWNER_TYPE_URL);
    });

    test("catch error when updating data", async () => {
      mockSetApplicationData.mockImplementationOnce( () => { throw new Error(ANY_MESSAGE_ERROR); });
      const resp = await request(app).post(BENEFICIAL_OWNER_INDIVIDUAL_URL + BO_IND_ID_URL);

      expect(resp.status).toEqual(500);
      expect(resp.text).toContain(SERVICE_UNAVAILABLE);
    });

    test(`replaces existing object on submit`, async () => {
      const newIndData: BeneficialOwnerIndividual = { id: BO_IND_ID, first_name: "new name" };
      mockPrepareData.mockReturnValueOnce(newIndData);
      const resp = await request(app).post(BENEFICIAL_OWNER_INDIVIDUAL_URL + BO_IND_ID_URL);

      expect(mockRemoveFromApplicationData.mock.calls[0][1]).toEqual(BeneficialOwnerIndividualKey);
      expect(mockRemoveFromApplicationData.mock.calls[0][2]).toEqual(BO_IND_ID);

      expect(mockSetApplicationData.mock.calls[0][1].id).toEqual(BO_IND_ID);
      expect(mockSetApplicationData.mock.calls[0][2]).toEqual(BeneficialOwnerIndividualKey);

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(BENEFICIAL_OWNER_TYPE_URL);
    });
  });

  describe("REMOVE tests", () => {
    test(`redirects to the ${BENEFICIAL_OWNER_TYPE_URL} page`, async () => {
      mockPrepareData.mockReturnValueOnce(BENEFICIAL_OWNER_INDIVIDUAL_OBJECT_MOCK);
      const resp = await request(app).get(BENEFICIAL_OWNER_INDIVIDUAL_URL + REMOVE + BO_IND_ID_URL);

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(BENEFICIAL_OWNER_TYPE_URL);
    });

    test("catch error when removing data", async () => {
      mockRemoveFromApplicationData.mockImplementationOnce( () => { throw new Error(ANY_MESSAGE_ERROR); });
      const resp = await request(app).get(BENEFICIAL_OWNER_INDIVIDUAL_URL + REMOVE + BO_IND_ID_URL);

      expect(resp.status).toEqual(500);
      expect(resp.text).toContain(SERVICE_UNAVAILABLE);
    });

    test(`removes the object from session`, async () => {
      const resp = await request(app).get(BENEFICIAL_OWNER_INDIVIDUAL_URL + REMOVE + BO_IND_ID_URL);

      expect(mockRemoveFromApplicationData.mock.calls[0][1]).toEqual(BeneficialOwnerIndividualKey);
      expect(mockRemoveFromApplicationData.mock.calls[0][2]).toEqual(BO_IND_ID);

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(BENEFICIAL_OWNER_TYPE_URL);
    });
  });
});
