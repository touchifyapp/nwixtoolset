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
 * Inscribes an installer database with information about the digital certificates its external cabs are signed with.
 * For more information, see [Insignia](http://wixtoolset.org/documentation/manual/v3/overview/insignia.html).
 * 
 * @param [options]     Options for Insignia.
 */
export async function insignia(options: InsigniaOptions): Promise<RunResult> {
    const args = ["-nologo"] as string[];

    if (isDatabaseOptions(options)) {
        await addPathArgument(args, "-im", options.inputDatabase);
    }
    else if (isBundleOptions(options)) {
        await addPathArgument(args, "-ib", options.inputBundle);
    }
    else if (isReattachOptions(options)) {
        await addPathArgument(args, "-ab", options.inputEngine);
        await addPathFile(args, options.outputBundle);
    }
    else {
        throw new TypeError("Invalid arguments");
    }

    await addPathArgument(args, "-o", options.out);

    addCommonArguments(args, options);

    return raw.insignia(args, options);
}

function isDatabaseOptions(options: InsigniaOptions): options is InsigniaDatabaseOptions {
    return "inputDatabase" in options;
}

function isBundleOptions(options: InsigniaOptions): options is InsigniaBundleOptions {
    return "inputBundle" in options;
}

function isReattachOptions(options: InsigniaOptions): options is InsigniaReattachOptions {
    return "inputEngine" in options && "outputBundle" in options;
}

export type InsigniaOptions =
    InsigniaDatabaseOptions |
    InsigniaBundleOptions |
    InsigniaReattachOptions;

/** Common options for the Insignia executable. */
export interface InsigniaCommonOptions extends CommonWIXOptions {
    /** 
     * Specify output file (Defaults to databaseFile or bundleFile.).
     * If out is a directory name ending in '\', output to a file with
     * the same name as the databaseFile or bundleFile in that directory.
     */
    out?: string;
}

/** Options for the Insignia executable Database mode. */
export interface InsigniaDatabaseOptions extends InsigniaCommonOptions {
    /** Specify the database file to inscribe. */
    inputDatabase: string;
}

/** Options for the Insignia executable Bundle mode. */
export interface InsigniaBundleOptions extends InsigniaCommonOptions {
    /**
     * Specify the bundle file from which to extract the engine.
     * The engine is stored in the file specified by -o.
     */
    inputBundle: string;
}

/** Options for the Insignia executable Reattach mode. */
export interface InsigniaReattachOptions extends InsigniaCommonOptions {
    /** Reattach this engine to the bundle. */
    inputEngine: string;

    /** The bundle to reattach engine on. */
    outputBundle: string;
}
