jest.mock("ioredis");
jest.mock('../../src/controllers/authentication.controller');
jest.mock('../../src/utils/application.data');

import { describe, expect, test, beforeEach, jest } from '@jest/globals';
import { NextFunction, Request, Response } from "express";
import request from "supertest";

import app from "../../src/app";
import { authentication } from "../../src/controllers";
import * as config from "../../src/config";
import { getApplicationData } from '../../src/utils/application.data';
import {
  BENEFICIAL_OWNER_TYPE_PAGE_HEADING,
  SERVICE_UNAVAILABLE
} from '../__mocks__/text.mock';
import { APPLICATION_DATA_MOCK, ERROR } from '../__mocks__/session.mock';
import {
  BeneficialOwnerTypeChoice,
  ManagingOfficerTypeChoice,
} from "../../src/model/beneficial.owner.type.model";

const mockAuthenticationMiddleware = authentication as jest.Mock;
mockAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next() );

const mockGetApplicationData = getApplicationData as jest.Mock;

describe("BENEFICIAL OWNER TYPE controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET tests", () => {
    test("renders the beneficial owner type page for beneficial owners", async () => {
      mockGetApplicationData.mockReturnValueOnce(APPLICATION_DATA_MOCK);
      const resp = await request(app).get(config.BENEFICIAL_OWNER_TYPE_URL);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(BENEFICIAL_OWNER_TYPE_PAGE_HEADING);
      expect(resp.text).toContain(config.BENEFICIAL_OWNER_STATEMENTS_URL); // back button
    });

    test("catch error when rendering the page", async () => {
      mockGetApplicationData.mockImplementationOnce( () => { throw ERROR; });
      const resp = await request(app).get(config.BENEFICIAL_OWNER_TYPE_URL);

      expect(resp.status).toEqual(500);
      expect(resp.text).toContain(SERVICE_UNAVAILABLE);
    });
  });

  describe("POST tests", () => {
    test(`redirects to the ${config.BENEFICIAL_OWNER_INDIVIDUAL_PAGE} page`, async () => {
      const resp = await request(app)
        .post(config.BENEFICIAL_OWNER_TYPE_URL)
        .send({ selectedOwnerOfficerType: BeneficialOwnerTypeChoice.individual });

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(config.BENEFICIAL_OWNER_INDIVIDUAL_URL);
    });

    test(`redirects to the ${config.BENEFICIAL_OWNER_OTHER_PAGE} page`, async () => {
      const resp = await request(app)
        .post(config.BENEFICIAL_OWNER_TYPE_URL)
        .send({ selectedOwnerOfficerType: BeneficialOwnerTypeChoice.otherLegal });

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(config.BENEFICIAL_OWNER_OTHER_URL);
    });

    test(`redirects to the ${config.BENEFICIAL_OWNER_GOV_PAGE} page`, async () => {
      const resp = await request(app)
        .post(config.BENEFICIAL_OWNER_TYPE_URL)
        .send({ selectedOwnerOfficerType: BeneficialOwnerTypeChoice.government });

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(config.BENEFICIAL_OWNER_GOV_URL);
    });

    test(`redirects to the ${config.MANAGING_OFFICER_PAGE} page`, async () => {
      const resp = await request(app)
        .post(config.BENEFICIAL_OWNER_TYPE_URL)
        .send({ selectedOwnerOfficerType: ManagingOfficerTypeChoice.individual });

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(config.MANAGING_OFFICER_URL);
    });

    test(`redirects to the ${config.MANAGING_OFFICER_CORPORATE_PAGE} page`, async () => {
      const resp = await request(app)
        .post(config.BENEFICIAL_OWNER_TYPE_URL)
        .send({ selectedOwnerOfficerType: ManagingOfficerTypeChoice.corporate });

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(config.MANAGING_OFFICER_CORPORATE_URL);
    });

    test("redirects to the current page", async () => {
      const resp = await request(app).post(config.BENEFICIAL_OWNER_TYPE_URL);

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(config.BENEFICIAL_OWNER_TYPE_URL);
    });
  });
});
