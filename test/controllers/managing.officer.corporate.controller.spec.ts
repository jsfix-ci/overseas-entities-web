jest.mock("ioredis");
jest.mock('../../src/controllers/authentication.controller');
jest.mock('../../src/utils/application.data');

import {
  APPLICATION_DATA_MOCK,
  MANAGING_OFFICER_CORPORATE_OBJECT_MOCK
} from "../__mocks__/session.mock";
import { describe, expect, test, jest } from '@jest/globals';
import { NextFunction, Request, Response } from "express";
import request from "supertest";
import app from "../../src/app";
import { authentication } from "../../src/controllers";
import { CHECK_YOUR_ANSWERS_URL, MANAGING_OFFICER_CORPORATE_URL } from "../../src/config";
import { MANAGING_OFFICER_CORPORATE_PAGE_TITLE, MESSAGE_ERROR, SERVICE_UNAVAILABLE } from "../__mocks__/text.mock";
import { getApplicationData, prepareData, setApplicationData } from "../../src/utils/application.data";
import { managingOfficerCorporateType } from "../../src/model";

const mockAuthenticationMiddleware = authentication as jest.Mock;
mockAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

const mockGetApplicationData = getApplicationData as jest.Mock;
const mockSetApplicationData = setApplicationData as jest.Mock;
const mockPrepareData = prepareData as jest.Mock;

describe("MANAGING_OFFICER CORPORATE controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET tests", () => {

    test("renders the managing officer corporate page", async () => {
      mockGetApplicationData.mockReturnValueOnce(APPLICATION_DATA_MOCK);
      const resp = await request(app).get(MANAGING_OFFICER_CORPORATE_URL);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(MANAGING_OFFICER_CORPORATE_PAGE_TITLE);
      expect(resp.text).toContain("Joe Bloggs");
      expect(resp.text).toContain("France");
      expect(resp.text).toContain("legalForm");
      expect(resp.text).toContain("LegAuth");
      expect(resp.text).toContain("123456789");
    });

    test("Should render the error page", async () => {
      mockGetApplicationData.mockImplementationOnce( () => { throw new Error(MESSAGE_ERROR); });
      const response = await request(app).get(MANAGING_OFFICER_CORPORATE_URL);

      expect(response.status).toEqual(500);
      expect(response.text).toContain(SERVICE_UNAVAILABLE);
    });

  });


  describe("POST tests", () => {
    test("renders the managing officer corporate page", async () => {
      mockPrepareData.mockImplementationOnce( () => MANAGING_OFFICER_CORPORATE_OBJECT_MOCK);
      const resp = await request(app).post(MANAGING_OFFICER_CORPORATE_URL);
      const managingOfficerCorporate = mockSetApplicationData.mock.calls[0][1];

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(CHECK_YOUR_ANSWERS_URL);
      expect(managingOfficerCorporate).toEqual(MANAGING_OFFICER_CORPORATE_OBJECT_MOCK);
      expect(managingOfficerCorporate.officerName).toEqual("Joe Bloggs");
      expect(managingOfficerCorporate.whereOfficerRegistered).toEqual("France");
      expect(managingOfficerCorporate.legalForm).toEqual("legalForm");
      expect(managingOfficerCorporate.legalAuthority).toEqual("LegAuth");
      expect(managingOfficerCorporate.registrationNumber).toEqual("123456789");
      expect(mockSetApplicationData.mock.calls[0][2]).toEqual(managingOfficerCorporateType.ManagingOfficerCorporateKey);
    });

    test("catch error when posting data", async () => {
      mockSetApplicationData.mockImplementationOnce( () => { throw new Error(MESSAGE_ERROR); });
      const resp = await request(app).post(MANAGING_OFFICER_CORPORATE_URL);

      expect(resp.status).toEqual(500);
      expect(resp.text).toContain(SERVICE_UNAVAILABLE);
    });

  });
});