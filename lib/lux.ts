import { 
    RunResult,
    RunOptions,
    raw
} from "./run";

import { 
    addCommonArguments,
    addPathArgument,
    addPathFile
} from "./util";

/**
 * Author declarative unit tests for custom actions.
 * For more information, see [Unit-testing custom actions with Lux](http://wixtoolset.org/documentation/manual/v3/overview/lux.html).
 * 
 * @param src           The wxs file(s) to test.
 * @param [options]     Options for the tester.
 */
export async function lux(src: string | string[], options: LuxOptions = {}): Promise<RunResult> {
    const args = ["-nologo"] as string[];

    await addPathArgument(args, "-o", options.out);
    addCommonArguments(args, options);

    await addPathFile(args, src);

    return raw.lux(args, options);
}

/** Options for the Lux executable. */
export interface LuxOptions extends RunOptions {
    /** Extension assembly or "class, assembly". */
    ext?: string | string[];
    
    /** Specify output file (default: write to current directory). */
    out?: string;

    /** Verbose output. */
    verbose?: boolean;
}
