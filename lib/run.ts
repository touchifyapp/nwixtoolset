import * as path from "path";
import { spawn, SpawnOptions, StdioOptions } from "child_process";

import { undef, isWineEnv } from "./util";

/** Options for the inner spawn method. */
export interface RunOptions {
    /** The current working directory to execute WIX exe binary on. */
    cwd?: string;
    /** The inner spawn stdio option. */
    stdio?: StdioOptions;
}

/** Result of the wrapper. */
export interface RunResult {
    /** The WIX exe exit code. */
    code: number;
    /** The WIX exe stdout content. */
    stdout: string;
    /** The WIX exe stderr content. */
    stderr: string;
}

/** Custom error thrown by the executable. */
export type RunError = Error & RunResult & { command: string; args: string[] };

/**
 * Run given WIX executable by using raw arguments.
 * 
 * @param exe       The WIX executable to run.
 * @param args      The arguments to pass to bundler.
 * @param [options] The options for child_process.spawn.
 */
export function run(exe: string, args: string[], options: RunOptions = {}): Promise<RunResult> {
    return new Promise<RunResult>((resolve, reject) => {
        let cmd = path.resolve(__dirname, "..", "wix-bin", `${exe}.exe`);
        if (isWineEnv()) {
            args.unshift(cmd);
            cmd = "wine";
        }

        const childOptions = {} as SpawnOptions;
        if (!undef(options.cwd)) childOptions.cwd = options.cwd;
        if (!undef(options.stdio)) childOptions.stdio = options.stdio;

        const child = spawn(cmd, args, childOptions);

        let stdout = "", stderr = "";
        if (options.stdio !== "ignore" && options.stdio !== "inherit") {
            child.stdout!.on("data", data => { stdout += String(data); });
            child.stderr!.on("data", data => { stderr += String(data); });
        }

        child.on("error", reject);
        child.on("close", code => {
            if (code === 0) {
                return resolve({ code, stdout, stderr });
            }

            const err = new Error(`WIX ${exe} exited with code ${code}` + (stderr ? `\n${stderr}` : "")) as RunError;
            err.command = cmd;
            err.args = args;
            err.code = code;
            err.stdout = stdout;
            err.stderr = stderr;

            reject(err);
        });
    });
}

/** Collections of RAW wrappers. */
export namespace raw {
    /** Raw wrapper for the candle.exe. */
    export const candle = run.bind(null, "candle") as RawMethod;

    /** Raw wrapper for the dark.exe. */
    export const dark = run.bind(null, "dark") as RawMethod;

    /** Raw wrapper for the heat.exe. */
    export const heat = run.bind(null, "heat") as RawMethod;

    /** Raw wrapper for the insignia.exe. */
    export const insignia = run.bind(null, "insignia") as RawMethod;

    /** Raw wrapper for the light.exe. */
    export const light = run.bind(null, "light") as RawMethod;

    /** Raw wrapper for the lit.exe. */
    export const lit = run.bind(null, "lit") as RawMethod;

    /** Raw wrapper for the lux.exe. */
    export const lux = run.bind(null, "lux") as RawMethod;

    /** Raw wrapper for the melt.exe. */
    export const melt = run.bind(null, "melt") as RawMethod;

    /** Raw wrapper for the nit.exe. */
    export const nit = run.bind(null, "nit") as RawMethod;

    /** Raw wrapper for the pyro.exe. */
    export const pyro = run.bind(null, "pyro") as RawMethod;

    /** Raw wrapper for the retina.exe. */
    export const retina = run.bind(null, "retina") as RawMethod;

    /** Raw wrapper for the shine.exe. */
    export const shine = run.bind(null, "shine") as RawMethod;

    /** Raw wrapper for the smoke.exe. */
    export const smoke = run.bind(null, "smoke") as RawMethod;

    /** Raw wrapper for the torch.exe. */
    export const torch = run.bind(null, "torch") as RawMethod;

    export type RawMethod = (args: string[], options?: RunOptions) => Promise<RunResult>;
}
