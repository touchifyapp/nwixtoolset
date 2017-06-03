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
    addFixedPathArgument,
    addPathFile,
    undef
} from "./util";

/**
 * Takes an XML output patch file (.wixmsp) and one or more XML transform files (.wixmst) and produces an .msp file.
 * 
 * @param src           The wixmsp file to process.
 * @param dest          Specify output file.
 * @param [options]     Options for the compiler.
 */
export async function pyro(src: string, dest: string, options: PyroOptions = {}): Promise<RunResult> {
    const args = ["-nologo"] as string[];

    await addPathFile(args, src);
    await addPathArgument(args, "-o", dest);

    addArgument(args, "-aet", options.allowEmptyPatch);
    await addPathArgument(args, "-bt", options.newBindPath);
    await addPathArgument(args, "-bu", options.updateBindPath);
    await addPathArgument(args, "-cc", options.cacheCabs);

    addArgument(args, "-delta", options.delta);
    addArgument(args, "-fv", options.fileVersion);
    addArgument(args, "-notidy", options.notidy);
    await addPathArgument(args, "-pdbout", options.pdbout);
    addArgument(args, "-reusecab", options.reuseCab);
    addArgument(args, "-sa", options.suppressAssemblies);
    addArgument(args, "-sf", options.suppressFiles);
    addArgument(args, "-sh", options.supressFileInfo);
    addArgument(args, "-spdb", options.suppressPdb);

    addCommonArguments(args, options);

    if (!undef(options.transform)) {
        Array.isArray(options.transform) ? 
            args.push("-t", ...options.transform) : 
            args.push("-t", options.transform);
    }

    return raw.pyro(args, options);
}

/** Options for the Pyro executable. */
export interface PyroOptions extends CommonWIXOptions {
    /** Allow patches to be created with one or more empty product transforms. */
    allowEmptyPatch?: boolean;

    /**
     * New bind path to replace the original target path.
     * It accepts two formats matching the exact light behavior.
     * (example: name1=c:\feature1\component1 or c:\feature2)
     */
    newBindPath?: string;

    /**
     * New bind paths to replace the bind paths for the updated input.
     * It accepts two formats matching the exact light behavior.
     * (example: name1=c:\feature1\component1 or c:\feature2)
     */
    updateBindPath?: string;

    /** Path to cache built cabinets. */
    cacheCabs?: string;

    /** Create binary delta patch (instead of whole file patch). */
    delta?: boolean;

    /** Update 'fileVersion' entries in the MsiAssemblyName table. */
    fileVersion?: boolean;

    /** Do not delete temporary files (useful for debugging). */
    notidy?: boolean;

    /** Save the WixPdb to a specific file (default: same name as output with wixpdb extension). */
    pdbout?: string;

    /** Reuse cabinets from cabinet cache. */
    reuseCab?: boolean;

    /** Suppress assemblies: do not get assembly name information for assemblies. */
    suppressAssemblies?: boolean;

    /** Suppress files: do not get any file information (equivalent to `suppressAssemblies` and `suppressFileInfo`). */
    suppressFiles?: boolean;

    /** Suppress file info: do not get hash, version, language, etc. */
    supressFileInfo?: boolean;

    /** Suppress outputting the WixPdb. */
    suppressPdb?: boolean;

    /** Transform  one or more wix transforms and its baseline. */
    transform?: string | string[];
}
