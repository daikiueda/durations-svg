import buildCli, {
  readFile,
  writeFile,
  Options,
  Executor,
  Examples,
} from "./buildCli.js";

import render from "./index.js";

type Flags = {
  source: string;
  dist: string;
};

const options: Options<Flags> = {
  source: {
    alias: "s",
    type: "string",
    description: "JSON file to read as source",
  },
  dist: {
    alias: "d",
    type: "string",
    description: "SVG File to write rendered",
  },
};

const examples: Examples = [
  ["$0 ./source.json ./dist.svg"],
  ["$0 -s ./source.json -d ./dist.svg"],
  ["cat ./source.json | $0 > ./dist.svg"],
];

const exec: Executor<Flags> = async ({ argv, stdin, yargs }) => {
  const sourceFile = argv.source || argv._[0];
  const source = sourceFile ? await readFile(sourceFile) : stdin;

  if (!source) {
    yargs.showHelp();
    return;
  }

  const svg = render(JSON.parse(source));

  const distFile = argv.dist || argv._[argv.source || stdin ? 0 : 1];
  if (distFile) {
    await writeFile(distFile, svg);
  } else {
    console.log(svg);
  }
};

export default buildCli({ options, examples }, exec);
