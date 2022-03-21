import { describe, expect, test } from '@jest/globals';
import { isActiveFeature } from "../../src/utils/feature.flag";

describe("feature flag tests", function() {

  test("should return false if variable is 'false'", function() {
    const active = isActiveFeature("false");
    expect(active).toBeFalsy;
  });

  test("should return false if variable is '0'", function() {
    const active = isActiveFeature("0");
    expect(active).toBeFalsy;
  });

  test("should return false if variable is ''", function() {
    const active = isActiveFeature("");
    expect(active).toBeFalsy;
  });

  test("should return false if variable is undefined", function() {
    const active = isActiveFeature(undefined);
    expect(active).toBeFalsy;
  });

  test("should return true if variable is random", function() {
    const active = isActiveFeature("kdjhskjf");
    expect(active).toBeTruthy;
  });

  test("should return false if variable is 'off'", function() {
    const active = isActiveFeature("off");
    expect(active).toBeFalsy;
  });

  test("should return false if variable is 'OFF'", function() {
    const active = isActiveFeature("OFF");
    expect(active).toBeFalsy;
  });

  test("should return true if variable is 'on'", function() {
    const active = isActiveFeature("on");
    expect(active).toBeTruthy;
  });

  test("should return true if variable is 'true'", function() {
    const active = isActiveFeature("true");
    expect(active).toBeTruthy;
  });

  test("should return true if variable is 'TRUE'", function() {
    const active = isActiveFeature("TRUE");
    expect(active).toBeTruthy;
  });

  test("should return true if variable is '1'", function() {
    const active = isActiveFeature("1");
    expect(active).toBeTruthy;
  });
});
