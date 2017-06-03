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
 * WIX Toolset library rebuilder.
 * 
 * @param src           The wixlib file to rebuild.
 * @param [options]     Options for the retina exe.
 */
export async function retina(src: string, options: RetinaOptions = {}): Promise<RunResult> {
    const args = ["-nologo"] as string[];

    await addPathArgument(args, "-i", src);
    await addPathArgument(args, "-o", options.out);
    addCommonArguments(args, options);

    return raw.retina(args, options);
}

/** Options for the Retina executable. */
export interface RetinaOptions extends RunOptions {
    /** Specify output file (default: write to current directory). */
    out?: string;

    /** Verbose output. */
    verbose?: boolean;
}
