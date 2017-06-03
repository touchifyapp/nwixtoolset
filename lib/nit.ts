import { 
    RunResult,
    RunOptions,
    raw
} from "./run";

import { 
    addPathFile
} from "./util";

/**
 * Runs the unit tests in one or more test packages.
 * For more information, see [Unit-testing custom actions with Lux](http://wixtoolset.org/documentation/manual/v3/overview/lux.html).
 * 
 * @param src           The msi file(s) to test.
 * @param [options]     Options for the tester.
 */
export async function nit(src: string | string[], options: RunOptions = {}): Promise<RunResult> {
    const args = ["-nologo"] as string[];

    await addPathFile(args, src);

    return raw.nit(args, options);
}

