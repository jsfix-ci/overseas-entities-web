jest.mock("ioredis");
jest.mock('../../src/middleware/authentication.middleware');
jest.mock("../../src/utils/application.data");
jest.mock('../../src/middleware/navigation/has.beneficial.owners.or.managing.officers.middleware');

import { NextFunction, Request, Response } from "express";
import request from "supertest";
import app from "../../src/app";
import { authentication } from "../../src/middleware/authentication.middleware";
import { ANY_MESSAGE_ERROR, PAGE_TITLE_ERROR, SERVICE_UNAVAILABLE, TRUST_INFO_PAGE_TITLE } from "../__mocks__/text.mock";
import { APPLICATION_DATA_MOCK, APPLICATION_DATA_NO_TRUST_NAME_MOCK, APPLICATION_DATA_NO_TRUST_DATE_MOCK, APPLICATION_DATA_PARTIAL_TRUST_DATE_MOCK, BENEFICIAL_OWNER_INDIVIDUAL_OBJECT_MOCK, BENEFICIAL_OWNER_OTHER_OBJECT_MOCK, ERROR, TRUSTS_SUBMIT, TRUSTS_SUBMIT_NO_NAME, TRUSTS_SUBMIT_NO_CREATION_DATE, TRUSTS_SUBMIT_PARTIAL_CREATION_DATE, TRUSTS_ADD_MORE, TRUSTS_EMPTY_TRUST_DATA, TRUSTS_EMPTY_CHECKBOX } from '../__mocks__/session.mock';
import * as config from "../../src/config";
import { ErrorMessages } from '../../src/validation/error.messages';
import { getApplicationData, prepareData, getFromApplicationData } from "../../src/utils/application.data";
import { hasBOsOrMOs } from "../../src/middleware/navigation/has.beneficial.owners.or.managing.officers.middleware";
import { TRUSTS_SUBMIT_CORPORATE_RO_ADDRESS_PREMISES_TOO_LONG, TRUSTS_SUBMIT_CORPORATE_SA_ADDRESS_PREMISES_TOO_LONG, TRUSTS_SUBMIT_INDIVIDUAL_AND_CORPORATE_NO_ADDRESS_PREMISES, TRUSTS_SUBMIT_INDIVIDUAL_SA_ADDRESS_PREMISES_TOO_LONG, TRUSTS_SUBMIT_INDIVIDUAL_URA_ADDRESS_PREMISES_TOO_LONG } from "../__mocks__/validation.mock";

const mockHasBOsOrMOsMiddleware = hasBOsOrMOs as jest.Mock;
mockHasBOsOrMOsMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next() );

const mockAuthenticationMiddleware = authentication as jest.Mock;
mockAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next() );

const mockGetApplicationData = getApplicationData as jest.Mock;
const mockGetFromApplicationData = getFromApplicationData as jest.Mock;
const mockPrepareData = prepareData as jest.Mock;

describe("TRUST INFORMATION controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET tests", () => {
    test(`renders the ${config.TRUST_INFO_PAGE} page`, async () => {
      mockGetApplicationData.mockReturnValueOnce(APPLICATION_DATA_MOCK);
      const resp = await request(app).get(config.TRUST_INFO_URL);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(TRUST_INFO_PAGE_TITLE);
      expect(resp.text).not.toContain(PAGE_TITLE_ERROR);
    });

    test("catch error when rendering the page", async () => {
      mockGetApplicationData.mockImplementationOnce(() => { throw new Error(ANY_MESSAGE_ERROR); });
      const resp = await request(app).get(config.TRUST_INFO_URL);

      expect(resp.status).toEqual(500);
      expect(resp.text).toContain(SERVICE_UNAVAILABLE);
    });
  });

  describe("POST tests", () => {
    test(`redirects to the ${config.CHECK_YOUR_ANSWERS_PAGE} page`, async () => {
      mockPrepareData.mockImplementationOnce( () => TRUSTS_SUBMIT );
      mockGetApplicationData.mockReturnValue(APPLICATION_DATA_MOCK);
      const bo = BENEFICIAL_OWNER_INDIVIDUAL_OBJECT_MOCK;
      bo.trust_ids = undefined;
      mockGetFromApplicationData.mockReturnValueOnce(bo);
      const resp = await request(app).post(config.TRUST_INFO_URL).send(TRUSTS_SUBMIT);

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(config.CHECK_YOUR_ANSWERS_PAGE);
    });

    test(`redirects to the ${config.TRUST_INFO_PAGE} page`, async () => {
      mockPrepareData.mockImplementationOnce( () => TRUSTS_SUBMIT );
      mockGetApplicationData.mockReturnValue(APPLICATION_DATA_MOCK);
      mockGetFromApplicationData.mockReturnValueOnce(undefined);
      const bo = BENEFICIAL_OWNER_OTHER_OBJECT_MOCK;
      bo.trust_ids = undefined;
      mockGetFromApplicationData.mockReturnValue(bo);
      const resp = await request(app).post(config.TRUST_INFO_URL).send(TRUSTS_ADD_MORE);

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(config.TRUST_INFO_URL);
    });

    test(`mandatory field missing: trust name`, async () => {
      mockPrepareData.mockImplementationOnce( () => TRUSTS_SUBMIT_NO_NAME );
      mockGetApplicationData.mockReturnValue(APPLICATION_DATA_NO_TRUST_NAME_MOCK);
      mockGetFromApplicationData.mockReturnValueOnce(undefined);
      const bo = BENEFICIAL_OWNER_OTHER_OBJECT_MOCK;
      bo.trust_ids = undefined;
      mockGetFromApplicationData.mockReturnValue(bo);
      const resp = await request(app).post(config.TRUST_INFO_URL).send(TRUSTS_SUBMIT_NO_NAME);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(ErrorMessages.TRUST_NAME);
    });

    test(`mandatory field missing: trust creation date`, async () => {
      mockPrepareData.mockImplementationOnce( () => TRUSTS_SUBMIT_NO_CREATION_DATE );
      mockGetApplicationData.mockReturnValue(APPLICATION_DATA_NO_TRUST_DATE_MOCK);
      mockGetFromApplicationData.mockReturnValueOnce(undefined);
      const bo = BENEFICIAL_OWNER_OTHER_OBJECT_MOCK;
      bo.trust_ids = undefined;
      mockGetFromApplicationData.mockReturnValue(bo);
      const resp = await request(app).post(config.TRUST_INFO_URL).send(TRUSTS_SUBMIT_NO_CREATION_DATE);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(ErrorMessages.TRUST_CREATION_DATE);
    });

    test(`mandatory field missing: partial trust creation date`, async () => {
      mockPrepareData.mockImplementationOnce( () => TRUSTS_SUBMIT_PARTIAL_CREATION_DATE );
      mockGetApplicationData.mockReturnValue(APPLICATION_DATA_PARTIAL_TRUST_DATE_MOCK);
      mockGetFromApplicationData.mockReturnValueOnce(undefined);
      const bo = BENEFICIAL_OWNER_OTHER_OBJECT_MOCK;
      bo.trust_ids = undefined;
      mockGetFromApplicationData.mockReturnValue(bo);
      const resp = await request(app).post(config.TRUST_INFO_URL).send(TRUSTS_SUBMIT_PARTIAL_CREATION_DATE);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(ErrorMessages.TRUST_CREATION_DATE);
    });

    test(`POST empty object and check for error in page title`, async () => {
      mockGetApplicationData.mockReturnValue(APPLICATION_DATA_PARTIAL_TRUST_DATE_MOCK);
      const resp = await request(app)
        .post(config.TRUST_INFO_URL)
        .send({ TrustKey: "Trust info" });
      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(PAGE_TITLE_ERROR);
    });

    test("catch error when rendering the page", async () => {
      mockGetApplicationData.mockImplementationOnce(() =>  { throw ERROR; });
      const resp = await request(app)
        .post(config.TRUST_INFO_URL)
        .send({ TrustKey: "Trust info" });

      expect(resp.status).toEqual(500);
      expect(resp.text).toContain(SERVICE_UNAVAILABLE);
    });

    test("renders the current page with TRUST_DATA_EMPTY error messages", async () => {
      mockPrepareData.mockImplementationOnce( () => TRUSTS_SUBMIT );
      mockGetApplicationData.mockReturnValueOnce(APPLICATION_DATA_MOCK);
      mockGetFromApplicationData.mockReturnValueOnce(undefined);
      const bo = BENEFICIAL_OWNER_OTHER_OBJECT_MOCK;
      bo.trust_ids = undefined;
      mockGetFromApplicationData.mockReturnValue(bo);
      const resp = await request(app).post(config.TRUST_INFO_URL).send(TRUSTS_EMPTY_TRUST_DATA);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(TRUST_INFO_PAGE_TITLE);
      expect(resp.text).toContain(ErrorMessages.TRUST_DATA_EMPTY);
    });

    test("renders the current page with TRUSTS_EMPTY_CHECKBOX error messages", async () => {
      mockPrepareData.mockImplementationOnce( () => TRUSTS_SUBMIT );
      mockGetApplicationData.mockReturnValueOnce(APPLICATION_DATA_MOCK);
      mockGetFromApplicationData.mockReturnValueOnce(undefined);
      const bo = BENEFICIAL_OWNER_OTHER_OBJECT_MOCK;
      bo.trust_ids = undefined;
      mockGetFromApplicationData.mockReturnValue(bo);
      const resp = await request(app).post(config.TRUST_INFO_URL).send(TRUSTS_EMPTY_CHECKBOX);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(TRUST_INFO_PAGE_TITLE);
      expect(resp.text).toContain(ErrorMessages.TRUST_BO_CHECKBOX);
    });

    test(`renders error message when corporate RO address premises field too long`, async () => {
      mockPrepareData.mockImplementationOnce( () => TRUSTS_SUBMIT_CORPORATE_RO_ADDRESS_PREMISES_TOO_LONG );
      mockGetApplicationData.mockReturnValue(TRUSTS_SUBMIT_CORPORATE_RO_ADDRESS_PREMISES_TOO_LONG);
      const resp = await request(app).post(config.TRUST_INFO_URL).send(TRUSTS_SUBMIT_CORPORATE_RO_ADDRESS_PREMISES_TOO_LONG);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(ErrorMessages.TRUST_CORPORATE_REGISTERED_OFFICE_ADDRESS_LENGTH);
    });

    test(`renders error message when corporate SA address premises field too long`, async () => {
      mockPrepareData.mockImplementationOnce( () => TRUSTS_SUBMIT_CORPORATE_SA_ADDRESS_PREMISES_TOO_LONG );
      mockGetApplicationData.mockReturnValue(TRUSTS_SUBMIT_CORPORATE_SA_ADDRESS_PREMISES_TOO_LONG);
      const resp = await request(app).post(config.TRUST_INFO_URL).send(TRUSTS_SUBMIT_CORPORATE_SA_ADDRESS_PREMISES_TOO_LONG);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(ErrorMessages.TRUST_CORPORATE_CORRESPONDENCE_ADDRESS_LENGTH);
    });

    test(`renders error message when individual URA address premises field too long`, async () => {
      mockPrepareData.mockImplementationOnce( () => TRUSTS_SUBMIT_INDIVIDUAL_URA_ADDRESS_PREMISES_TOO_LONG );
      mockGetApplicationData.mockReturnValue(TRUSTS_SUBMIT_INDIVIDUAL_URA_ADDRESS_PREMISES_TOO_LONG);
      const resp = await request(app).post(config.TRUST_INFO_URL).send(TRUSTS_SUBMIT_INDIVIDUAL_URA_ADDRESS_PREMISES_TOO_LONG);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(ErrorMessages.TRUST_INDIVIDUAL_HOME_ADDRESS_LENGTH);
    });

    test(`renders error message when individual SA address premises field too long`, async () => {
      mockPrepareData.mockImplementationOnce( () => TRUSTS_SUBMIT_INDIVIDUAL_SA_ADDRESS_PREMISES_TOO_LONG );
      mockGetApplicationData.mockReturnValue(TRUSTS_SUBMIT_INDIVIDUAL_SA_ADDRESS_PREMISES_TOO_LONG);
      const resp = await request(app).post(config.TRUST_INFO_URL).send(TRUSTS_SUBMIT_INDIVIDUAL_SA_ADDRESS_PREMISES_TOO_LONG);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(ErrorMessages.TRUST_INDIVIDUAL_CORRESPONDENCE_ADDRESS_LENGTH);
    });

    test(`does not display error message when address premises fields are not submitted`, async () => {
      mockPrepareData.mockImplementationOnce( () => TRUSTS_SUBMIT_INDIVIDUAL_AND_CORPORATE_NO_ADDRESS_PREMISES );
      mockGetApplicationData.mockReturnValue(APPLICATION_DATA_MOCK);
      const bo = BENEFICIAL_OWNER_INDIVIDUAL_OBJECT_MOCK;
      bo.trust_ids = undefined;
      mockGetFromApplicationData.mockReturnValueOnce(bo);
      const resp = await request(app).post(config.TRUST_INFO_URL).send(TRUSTS_SUBMIT);

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(config.CHECK_YOUR_ANSWERS_PAGE);
    });
  });
});
