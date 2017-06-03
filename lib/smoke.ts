import { 
    RunResult,
    raw
} from "./run";

import { 
    CommonWIXOptions,
    addArgument,
    addCommonArguments,
    addMapArgument,
    addPathArgument,
    addPathFile,
    undef
} from "./util";

/**
 * Runs validation checks on .msi or .msm files.
 * 
 * @param src           The MSI or MSM file(s) to validate.
 * @param [options]     Options for the validator.
 */
export async function smoke(src: string | string[], options: SmokeOptions = {}): Promise<RunResult> {
    const args = ["-nologo"] as string[];

    await addPathArgument(args, "-cub", options.cub);
    addMapArgument(args, "-ice", options.ice);
    addArgument(args, "-nodefault", options.noDefault);
    addArgument(args, "-notidy", options.notidy);
    await addPathArgument(args, "-pdb", options.pdb);
    addMapArgument(args, "-sice", options.suppressICE);

    addCommonArguments(args, options);
    await addPathFile(args, src);

    if (!undef(options.overridesTemp)) {
        process.env.WIX_TEMP = options.overridesTemp;
    }

    return raw.smoke(args, options);
}

/** Options for the Smoke executable. */
export interface SmokeOptions extends CommonWIXOptions {
    /** Additional .cub file containing ICEs to run. */
    cub?: string;

    /** Run a specific internal consistency evaluator (ICE). */
    ice?: string;

    /** Do not add the default .cub files for .msi and .msm files. */
    noDefault?: boolean;

    /** Do not delete temporary files (useful for debugging). */
    notidy?: boolean;

    /** Path to the pdb file corresponding to the databaseFile. */
    pdb?: string;

    /** Suppress an internal consistency evaluator (ICE). */
    suppressICE?: string;

    /** Overrides the temporary directory used for validation. */
    overridesTemp?: string;
}
