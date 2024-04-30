import { text } from "node:stream/consumers";
import fs from "node:fs/promises";
import path from "node:path";

import yargs, { Argv as YargsArgv, Options as YargsOptions } from "yargs";
import { hideBin } from "yargs/helpers";

type Argv<T extends object> = YargsArgv & { _: string[] } & T;

export type Options<Flags extends object> = {
  [key in keyof Flags]: YargsOptions;
};

export type Examples = [string, (string | undefined)?][];

export type Executor<T extends object> = (arg0: {
  argv: Argv<T>;
  stdin: string | null;
  yargs: ReturnType<typeof yargs>;
}) => Promise<void> | void;

const getStdin = async () => {
  if (process.stdin.isTTY) {
    return null;
  }
  return text(process.stdin);
};

const buildCli =
  <T extends object>(
    {
      options = {},
      examples,
    }: {
      options: { [key: string]: YargsOptions };
      examples?: [string, (string | undefined)?][];
    },
    exec: Executor<T>,
  ) =>
  async () => {
    let _yargs = yargs(hideBin(process.argv));

    _yargs = Object.entries(options).reduce(
      (acc, [key, options]) => acc.option(key, options),
      _yargs,
    );

    if (examples) {
      _yargs = _yargs.example(examples);
    }

    await exec({
      argv: _yargs.parse() as Argv<T>,
      stdin: await getStdin(),
      yargs: _yargs,
    });
  };
export default buildCli;

export const readFile = (pathToFile: string) =>
  fs.readFile(path.resolve(pathToFile), { encoding: "utf-8" });

export const writeFile = (pathToFile: string, content: string) =>
  fs.writeFile(path.resolve(pathToFile), content);
