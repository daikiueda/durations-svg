import ejs from "ejs";

import templateEjs from "./template.ejs.js";

export type Duration = {
  title?: string;
  startTime: number;
  duration: number;
};

const render = (durations: Duration[]) => {
  const tmpl = ejs.compile(templateEjs);
  return tmpl({ durations });
};

export default render;
