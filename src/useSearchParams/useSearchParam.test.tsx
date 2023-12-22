import { renderHook } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { array, date, number, object, string, tuple } from "yup";
import { type ValidateFunction } from "./types";
import { useSearchParams } from "./useSearchParams";
import { identity, valueToString } from "./utils";

describe("Test useSearchParams", () => {
  type WrapperProps = { searchParams?: string; validate?: ValidateFunction };
  function wrapper({ searchParams, children }: PropsWithChildren<WrapperProps>) {
    return <MemoryRouter initialEntries={[`/?${searchParams}`]}>{children}</MemoryRouter>;
  }

  function renderUseSearchParams(options: WrapperProps = {}) {
    const { searchParams, validate } = { searchParams: "", validate: identity, ...options };
    return renderHook(() => useSearchParams({ validate }), {
      wrapper: ({ children }) => wrapper({ children, searchParams, validate }),
    });
  }

  describe("Sanity", () => {
    test("display nothing when params are empty", () => {
      const { result } = renderUseSearchParams();

      expect(result.current.params).toStrictEqual({});
    });

    test("show params", () => {
      const { result } = renderUseSearchParams({ searchParams: "foo=bar" });

      expect(result.current.params).toStrictEqual({ foo: "bar" });
    });
  });

  // shared resources
  type ValuesType = {
    searchTerm: string;
    page: number;
    tags: Array<string>;
    createdAt?: Date;
    cloudCover: number;
    location: [number, number];
  };

  const mockDate = new Date("2020-02-02 UTC");
  const values: ValuesType = {
    searchTerm: "foo", // string
    page: 3, // integer
    tags: ["tree", "city"], // array of stings
    createdAt: mockDate,
    cloudCover: 0.5, // float 0 - 1
    location: [-5, 7], // longitude latitude
  };

  const searchParams = new URLSearchParams([
    ["searchTerm", valueToString(values.searchTerm)],
    ["page", valueToString(values.page)],
    ["tags", valueToString(values.tags)],
    ["cloudCover", valueToString(values.cloudCover)],
    ["location", valueToString(values.location)],
  ]);

  const valueSchema = object({
    searchTerm: string().required().default(""),
    page: number().required().positive().integer().default(0),
    tags: array()
      .transform((s) => s.split(","))
      .default([]),
    createdAt: date().default(mockDate),
    cloudCover: number().positive().min(0).max(1),
    location: tuple([
      number().label("longitude").min(-180).max(180).default(0),
      number().label("latitude").min(-90).max(90).default(0),
    ]).transform(function strToLonLat(s: string) {
      return s.split(",").map((l: string) => Number(l));
    }),
  });

  describe("parse functionality", () => {
    describe("custom parse function", () => {
      const basicValidation: ValidateFunction = (search): ValuesType => {
        const ret: Partial<ValuesType> = {};
        if ("searchTerm" in search) {
          ret["searchTerm"] = search["searchTerm"];
        }
        if ("page" in search) {
          ret["page"] = Number(search["page"]);
        }
        if ("tags" in search) {
          ret["tags"] = search["tags"].split(",");
        }
        if ("createdAt" in search) {
          ret["createdAt"] = new Date(search["createdAt"]);
        } else {
          ret["createdAt"] = mockDate;
        }
        if ("cloudCover" in search) {
          ret["cloudCover"] = Number(search["cloudCover"]);
        }
        if ("location" in search) {
          ret["location"] = search["location"].split(",").map((l: string) => Number(l)) as [number, number];
        }

        return ret as ValuesType;
      };

      test("parsing with bespoke parsing function", () => {
        const { result } = renderUseSearchParams({ validate: basicValidation, searchParams: searchParams.toString() });

        expect(result.current.params).toStrictEqual(values);
      });
    });

    describe("yup parser", () => {
      test("parsing with yup schema", () => {
        const { result } = renderUseSearchParams({
          validate: (p) => valueSchema.cast(p),
          searchParams: searchParams.toString(),
        });

        expect(result.current.params).toStrictEqual(values);
      });
    });
  });

  describe("Stringify / serialize functionality", () => {
    test("stringify params into ", () => {
      const { result } = renderUseSearchParams({
        validate: (p) => valueSchema.cast(p),
        searchParams: searchParams.toString(),
      });

      const { params, stringify } = result.current;
      expect(params).toStrictEqual(values);

      const urlSearchParam = stringify(params);
      const paramsAsArray = Object.entries(params);
      expect(urlSearchParam.split("&")).toHaveLength(paramsAsArray.length);

      paramsAsArray.forEach(([key, value]) => {
        expect(urlSearchParam).toContain(key);
        expect(urlSearchParam).toContain(encodeURIComponent(valueToString(value)));
      });
    });
  });
});
