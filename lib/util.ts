import * as cp from "child_process";
import * as isWSL from "is-wsl";

import { RunOptions } from "./run";

export type Dictionary<T> = { [key: string]: T; };
export type ArgumentsScalarTypes = undefined | boolean | number | string | Array<string | number>;
export type ArgumentTypes = ArgumentsScalarTypes | Dictionary<ArgumentsScalarTypes>;

export interface CommonWIXOptions extends RunOptions {
    /** Extension assembly or "class, assembly". */
    ext?: string | string[];

    /** Suppress all warnings (true) or a specific message ID. */
    suppressWarning?: boolean | number | number[];

    /** Verbose output. */
    verbose?: boolean;

    /** Treat all warnings or a specific message ID as an error. */
    warningAsError?: boolean | number | number[];
}

export function addArgument(args: string[], arg: string, value: ArgumentTypes): void {
    const valueType = typeof value;
    if (value === null || valueType === "undefined") {
        return;
    }

    if (valueType === "string") {
        args.push(arg, value as string);
    }
    else if (valueType === "boolean" && value === true) {
        args.push(arg);
    }
    else if (valueType === "number") {
        args.push(arg, (<number>value).toString());
    }
    else if (Array.isArray(value)) {
        value.forEach(val => addArgument(args, arg, val));
    }
    else if (valueType === "object") {
        Object.keys(value as object).forEach(key => {
            let valueArg = arg + key,
                valueVal = (<Dictionary<ArgumentsScalarTypes>>value)[key];

            if (typeof valueVal === "boolean") {
                if (!valueVal) return;
            }
            else {
                valueArg += "=" + valueVal;
            }

            addArgument(args, valueArg, true);
        });
    }
}

export function addFixedArgument(args: string[], arg: string, value: undefined | string | number | boolean | Array<string | number>): void {
    if (undef(value)) {
        return;
    }

    if (Array.isArray(value)) {
        value.forEach(val => addFixedArgument(args, arg, val));
    }
    else if (typeof value === "boolean") {
        if (value) args.push(arg);
    }
    else {
        args.push(arg + value);
    }
}

export function addMapArgument(args: string[], arg: string, value: undefined | string | number | Array<string | number>): void {
    if (undef(value)) {
        return;
    }

    if (Array.isArray(value)) {
        value.forEach(val => addMapArgument(args, arg, val));
    }
    else {
        args.push(`${arg}:${value}`);
    }
}

export async function addPathArgument(args: string[], arg: string, value: undefined | string | string[]): Promise<void> {
    value = await ensurePaths(value);
    addArgument(args, arg, value);
}

export async function addFixedPathArgument(args: string[], arg: string, value: undefined | string | string[]): Promise<void> {
    value = await ensurePaths(value);
    addFixedArgument(args, arg, value);
}

export async function addPathFile(args: string[], file: undefined | string | string[]): Promise<void> {
    file = await ensurePaths(file);
    args.push(...file);
}

export function addCommonArguments(args: string[], options: CommonWIXOptions): void {
    addArgument(args, "-ext", options.ext);
    addFixedArgument(args, "-sw", options.suppressWarning);
    addArgument(args, "-v", options.verbose);
    addFixedArgument(args, "-wx", options.warningAsError);
}

export async function ensurePaths(path?: string | string[]): Promise<string[]> {
    if (undef(path)) {
        return [];
    }

    if (!Array.isArray(path)) {
        path = [path];
    }

    if (isWineEnv()) {
        path = await winepath(...path);
    }

    return path;
}

export function winepath(...srcs: string[]): Promise<string[]> {
    return spawn("winepath", ["-w", ...srcs])
        .then(({ stdout }) => stdout.split(/\r?\n/g))
        .then(paths => paths.filter(p => !!p));
}

export function undef(val: any): val is undefined {
    return typeof val === "undefined";
}

export function isWineEnv() {
    if ((<any>isWineEnv).result) return (<any>isWineEnv).result;
    return ((<any>isWineEnv).result = process.platform !== "win32" && !isWSL);
}

export interface SpawnResult { stdout: string; stderr: string; }
export function spawn(command: string, args: string[], options: cp.SpawnOptions = {}): Promise<SpawnResult> {
    return new Promise((resolve, reject) => {
        const child = cp.spawn(command, args, options);

        let stdout = "", stderr = "";
        if (options.stdio !== "ignore" && options.stdio !== "inherit") {
            child.stdout!.on("data", data => { stdout += String(data); });
            child.stderr!.on("data", data => { stderr += String(data); });
        }

        child.on("error", reject);
        child.on("close", code => {
            if (code !== 0) {
                return reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
            }

            resolve({ stdout, stderr });
        });
    });
}
