import { 
    RunResult,
    raw
} from "./run";

import { 
    CommonWIXOptions,
    addArgument,
    addCommonArguments,
    addPathArgument,
    addPathFile
} from "./util";

/**
 * Converts an .msm into a component group in a WiX source file.
 * 
 * @param src           The database file to convert (msm or msi).
 * @param dest          Output wxs (msm) or wixpdb (msi).
 * @param [options]     Options for the converter.
 */
export async function melt(src: string, dest: string, options: MeltOptions = {}): Promise<RunResult> {
    const args = ["-nologo"] as string[];

    await addPathFile(args, [src, dest]);

    addArgument(args, "-id", options.id);
    addArgument(args, "-notidy", options.notidy);

    await addPathArgument(args, "-o", options.out);
    await addPathArgument(args, "-pdb", options.pdb);
    addArgument(args, "-sextract", options.suppressExtract);
    await addPathArgument(args, "-x", options.export);
    addArgument(args, "-xn", options.exportContents);

    addCommonArguments(args, options);

    return raw.melt(args, options);
}

/** Options for the Melt executable. */
export interface MeltOptions extends CommonWIXOptions {
    /** Friendly identifier to use instead of module id. */
    id?: string;

    /** Do not delete temporary files (useful for debugging). */
    notidy?: boolean;

    /** Specify output file (default: write to current directory). */
    out?: string;

    /** Specify .wixpdb matching database.msi. */
    pdb?: string;

    /** Suppress extracting .msi payloads when updating .wixpdb. */
    suppressExtract?: boolean;

    /** Export binaries from database to this path (defaults to output files path). */
    export?: string;

    /** Export contents of File, Binary, and Icon tables to subdirectories to support patching all types of files. Needs `extract`. */
    exportContents?: boolean;
}
