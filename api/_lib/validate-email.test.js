import { test } from "node:test";
import assert from "node:assert/strict";
import { validateEmail } from "./validate-email.js";

test("accepts a normal email", () => {
  assert.equal(validateEmail("chris@chrismbollo.com"), "chris@chrismbollo.com");
});

test("lowercases and trims input", () => {
  assert.equal(validateEmail("  Chris@ChrisMbollo.COM  "), "chris@chrismbollo.com");
});

test("rejects missing @", () => {
  assert.throws(() => validateEmail("chrischrismbollo.com"), /invalid_email/);
});

test("rejects empty string", () => {
  assert.throws(() => validateEmail(""), /invalid_email/);
});

test("rejects non-string", () => {
  assert.throws(() => validateEmail(null), /invalid_email/);
  assert.throws(() => validateEmail(undefined), /invalid_email/);
  assert.throws(() => validateEmail(42), /invalid_email/);
});

test("rejects strings longer than 254 chars", () => {
  const local = "a".repeat(250);
  assert.throws(() => validateEmail(`${local}@x.co`), /invalid_email/);
});

test("rejects dangerous header injection characters", () => {
  assert.throws(() => validateEmail("chris\r\n@x.com"), /invalid_email/);
  assert.throws(() => validateEmail("chris\n@x.com"), /invalid_email/);
});
