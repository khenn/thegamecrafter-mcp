import { describe, expect, it } from "vitest";
import { fail, ok } from "./response.js";

describe("response envelope helpers", () => {
  it("returns the stable success envelope shape", () => {
    expect(ok({ foo: "bar" })).toEqual({
      ok: true,
      data: { foo: "bar" },
      error: null,
    });
  });

  it("returns the stable failure envelope shape", () => {
    expect(fail("BAD_REQUEST", "Nope", { field: "name" })).toEqual({
      ok: false,
      data: null,
      error: {
        code: "BAD_REQUEST",
        message: "Nope",
        details: { field: "name" },
      },
    });
  });

  it("defaults failure details to null", () => {
    expect(fail("NOT_FOUND", "Missing")).toEqual({
      ok: false,
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Missing",
        details: null,
      },
    });
  });
});
