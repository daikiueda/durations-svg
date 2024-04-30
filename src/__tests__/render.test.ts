import index from "../index";

import durations from "./sample.json";

(async () => {
  const result = await index(durations);
  console.log(result);
})();
