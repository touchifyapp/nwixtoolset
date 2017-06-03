import { 
    RunResult,
    RunOptions,
    raw
} from "./run";

import { 
    addCommonArguments,
    addPathArgument,
    addPathFile,
    undef
} from "./util";

/**
 * WIX Toolset Scanner.
 * 
 * @param src           The file(s) to scan (path|*.wixproj|*.wixpdb|...).
 * @param [options]     Options for the scanner.
 */
export async function shine(src: string | string[], options: ShineOptions = {}): Promise<RunResult> {
    const args = ["-nologo"] as string[];

    await addPathArgument(args, "-dgml", options.dgml);
    await addPathArgument(args, "-dgmlTemplate", options.dgmlTemplate);
    await addPathArgument(args, "-excludeSymbol", options.excludeSymbol);
    await addPathArgument(args, "-includeSymbol", options.includeSymbol);

    if (!undef(options.show)) {
        Array.isArray(options.show) ?
            args.push("-show", options.show.join(";")) :
            args.push("-show", options.show);
    }
    await addPathFile(args, src);

    return raw.shine(args, options);
}

/** Options for the Shine executable. */
export interface ShineOptions extends RunOptions {
    /** Save scan as DGML file. */
    dgml?: string;

    /** A valid DGML file populated with data from scan. */
    dgmlTemplate?: string;
    
    /** Filter scan to include only specified symbol(s). */
    includeSymbol?: string | string[];
    
    /** Remove symbol and symbols it references from scan. */
    excludeSymbol?: string | string[];

    /** Displays only the specified items in the scan. (default: all) */
    show?: ShineShowItems | ShineShowItems[];
}

export type ShineShowItems = 
    /** Project files. */
    "proj" |
    /** Source files. */
    "file" |
    /** Symbols. */
    "sym" |
    /** Symbol references. */
    "ref" |
    /** All of the above [default]. */
    "all";
