import test from "ava";

import render from "../index.js";

import durations from "./sample.json";

test("render SVG", (t) => {
  const svgStr = render(durations);
  t.snapshot(svgStr);
});
