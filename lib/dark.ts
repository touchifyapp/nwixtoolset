import { 
    RunResult,
    raw
} from "./run";

import { 
    CommonWIXOptions,
    addArgument,
    addCommonArguments,
    addFixedArgument,
    addPathArgument,
    addPathFile
} from "./util";

/**
 * Converts a Windows Installer database into a set of WiX source files.
 * This tool is very useful for getting all your authoring into a WiX source file when you have an existing Windows Installer database.
 * However, you will then need to tweak this file to accomodate different languages and breaking things into fragments.
 * 
 * @param src           The MSI file to decompile.
 * @param [options]     Options for the decompiler.
 */
export async function dark(src: string, options: DarkOptions = {}): Promise<RunResult> {
    const args = ["-nologo"] as string[];

    addArgument(args, "-notidy", options.notidy);
    await addPathArgument(args, "-o", options.out);
    addArgument(args, "-sct", options.suppressCustomTables);
    addArgument(args, "-sdet", options.suppressDroppingEmptyTables);
    addArgument(args, "-sras", options.suppressRelativeActionSequencing);
    addArgument(args, "-sui", options.suppressUI);
    await addPathArgument(args, "-x", options.export);
    addArgument(args, "-xo", options.wixout);

    addCommonArguments(args, options);

    await addPathFile(args, src);

    return raw.dark(args, options);
}

/** Options for the Dark executable. */
export interface DarkOptions extends CommonWIXOptions {
    /** Do not delete temporary files (useful for debugging). */
    notidy?: boolean;

    /** Specify output file (default: write .wxs to current directory). */
    out?: string;

    /** Suppress decompiling custom tables. */
    suppressCustomTables?: string;

    /** Suppress dropping empty tables (adds EnsureTable as appropriate). */
    suppressDroppingEmptyTables?: boolean;

    /** Suppress relative action sequencing (use explicit sequence numbers). */
    suppressRelativeActionSequencing?: boolean;
    
    /** Suppress decompiling UI-related tables. */
    suppressUI?: boolean;

    /** Export binaries from cabinets and embedded binaries to this path. */
    export?: string;

    /** Output wixout instead of Wix source code (mandatory for transforms and patches). */
    wixout?: boolean;
}
