import { 
    RunResult,
    raw
} from "./run";

import { 
    CommonWIXOptions,
    Dictionary,
    addArgument,
    addCommonArguments,
    addFixedArgument,
    addMapArgument,
    addPathArgument,
    addFixedPathArgument,
    addPathFile,
    undef
} from "./util";

/**
 * Links and binds one or more .wixobj files and creates a Windows Installer database (.msi or .msm).
 * When necessary, Light will also create cabinets and embed streams into the Windows Installer database it creates.
 * For more information on linking, see [Linker](http://wixtoolset.org/documentation/manual/v3/overview/light.html).
 * 
 * @param src           The file(s) (wixobj) to process.
 * @param [options]     Options for the compiler.
 */
export async function light(src: string | string[], options: LightOptions = {}): Promise<RunResult> {
    const args = ["-nologo"] as string[];

    addArgument(args, "-ai", options.allowIdenticalRows);
    addArgument(args, "-ad", options.allowDuplicateDir);
    addArgument(args, "-au", options.allowUnresolvedRefs);

    await addPathArgument(args, "-b", options.bind);
    await addBinderArguments(args, options);

    await addPathArgument(args, "-o", options.out);

    addArgument(args, "-bf", options.bindWixout);
    addArgument(args, "-binder", options.binder);
    addMapArgument(args, "-cultures", options.cultures);
    addArgument(args, "-d", options.define);
    
    addArgument(args, "-dut", options.dropUnrealTables);
    await addPathArgument(args, "-loc", options.loc);
    addArgument(args, "-notidy", options.notidy);
    addArgument(args, "-pedantic", options.pedantic);

    addArgument(args, "-sadmin", options.suppressAdminSequences);
    addArgument(args, "-sadv", options.suppressAdvSequences);
    addArgument(args, "-sloc", options.suppressLocalization);
    addArgument(args, "-sma", options.suppressProcessMSI);
    addArgument(args, "-ss", options.supressShemaValidation);
    addArgument(args, "-sts", options.suppressTaggingSectionId);
    addArgument(args, "-sts", options.suppressTaggingSectionId);
    addArgument(args, "-sui", options.suppressUI);
    addArgument(args, "-sv", options.suppressIntermediateFile);
    addArgument(args, "-xo", options.wixout);

    addCommonArguments(args, options);

    await addPathFile(args, src);

    if (!undef(options.overridesTemp)) {
        process.env.WIX_TEMP = options.overridesTemp;
    }

    return raw.light(args, options);
}

async function addBinderArguments(args: string[], options: LightBinderOptions): Promise<void> {
    addArgument(args, "-bcgg", options.backCompatibleGuids);
    await addPathArgument(args, "-cc", options.cacheCabs);
    addArgument(args, "-ct", options.numberOfThreads);
    await addPathArgument(args, "-cub", options.cub);
    addArgument(args, "-cub", options.cub);
    addMapArgument(args, "-dcl", options.defaultCabLevel);
    addArgument(args, "-eav", options.exactAssemblyVersions);
    addArgument(args, "-fv", options.fileVersion);
    addMapArgument(args, "-ice", options.ice);
    addArgument(args, "-O1", options.optimizeSize);
    addArgument(args, "-O2", options.optimizeTime);
    addArgument(args, "-reusecab", options.reuseCab);
    addArgument(args, "-sa", options.suppressAssemblies);
    addArgument(args, "-sacl", options.suppressResetACLs);
    addArgument(args, "-sf", options.suppressFiles);
    addArgument(args, "-sh", options.supressFileInfo);
    addMapArgument(args, "-sice", options.suppressICE);
    addArgument(args, "-sl", options.suppressLayout);
    addArgument(args, "-spdb", options.suppressPdb);
    addArgument(args, "-spsd", options.suppressPatchSequenceData);
    addArgument(args, "-sval", options.suppressValidation);
}

/** Options for the Light executable. */
export interface LightOptions extends CommonWIXOptions, LightBinderOptions {
    /**
     * Allow identical rows, identical rows will be treated as a warning.
     * @deprecated
     */
    allowIdenticalRows?: boolean;

    /** 
     * Allow duplicate directory identities from other libraries.
     * @deprecated
     */
    allowDuplicateDir?: Dictionary<string | boolean>;

    /**
     * (experimental) allow unresolved references (will not create a valid output).
     * @deprecated
     */
    allowUnresolvedRefs?: boolean;

    /** Specify a binder path to locate all files (default: current directory). */
    bind?: string;

    /** Bind files into a wixout (only valid with wixout option). */
    bindWixout?: string;

    /**
     * Specify a specific custom binder to use provided by an extension.
     * @deprecated
     */
    binder?: string;

    /**
     * Semicolon or comma delimited list of localized string cultures to load from .wxl files and libraries.
     * Precedence of cultures is from left to right.
     */
    cultures?: string | string[];

    /**  Define a wix variable, with or without a value. */
    define?: Dictionary<string | boolean>;
    
    /**
     * Drop unreal tables from the output image.
     * @deprecated
     */
    dropUnrealTables?: boolean;

    /** Read localization strings from .wxl file. */
    loc?: string | string[];

    /** Do not delete temporary files (useful for debugging). */
    notidy?: boolean;
    
    /** Specify output file (default: write to current directory). */
    out?: string;
    
    /** Show pedantic messages. */
    pedantic?: boolean;

    /**
     * Suppress default admin sequence actions.
     * @deprecated
     */
    suppressAdminSequences?: boolean;
    
    /**
     * Suppress default adv sequence actions.
     * @deprecated
     */
    suppressAdvSequences?: boolean;

    /** Suppress localization. */
    suppressLocalization?: boolean;
    
    /**
     * Suppress processing the data in MsiAssembly table.
     * @deprecated
     */
    suppressProcessMSI?: boolean;
    
    /**
     * Suppress schema validation of documents (performance boost).
     * @deprecated
     */
    supressShemaValidation?: boolean;

    /**
     * Suppress tagging sectionId attribute on rows.
     * @deprecated
     */
    suppressTaggingSectionId?: boolean;

    /**
     * Suppress default UI sequence actions.
     * @deprecated
     */
    suppressUI?: boolean;

    /**
     * Suppress intermediate file version mismatch checking.
     * @deprecated
     */
    suppressIntermediateFile?: boolean;

    /** Unreferenced symbols file. */
    unreferencedSymbols?: string;

    /** Output wixout format instead of MSI format. */
    wixout?: string;

    /** Overrides the temporary directory used for cab creation, msm exploding, ... */
    overridesTemp?: string;
}

export interface LightBinderOptions {
    /** Use backwards compatible guid generation algorithm (almost never needed). */
    backCompatibleGuids?: boolean;
    
    /** Path to cache built cabinets (will not be deleted after linking). */
    cacheCabs?: string;

    /** Number of threads to use when creating cabinets (default: %NUMBER_OF_PROCESSORS%). */
    numberOfThreads?: number;
    
    /** Additional .cub file containing ICEs to run. */
    cub?: string;
    
    /** Set default cabinet compression level (default mszip). */
    defaultCabLevel?: "low" | "medium" | "high" | "none" | "mszip";
    
    /** Exact assembly versions (breaks .NET 1.1 RTM compatibility). */
    exactAssemblyVersions?: boolean;
    
    /** Add a 'fileVersion' entry to the MsiAssemblyName table (rarely needed) */
    fileVersion?: boolean;
    
    /** Run a specific internal consistency evaluator (ICE). */
    ice?: string;
    
    /**
     * Optimize Smart Cabbing for smallest cabinets.
     * @deprecated
     */
    optimizeSize?: boolean;
    
    /**
     * Optimize Smart Cabbing for faster install time.
     * @deprecated
     */
    optimizeTime?: boolean;
    
    /**
     * Save the WixPdb to a specific file.
     * (default: same name as output with wixpdb extension)
     */
    pdbout?: string;
    
    /** Reuse cabinets from cabinet cache. */
    reuseCab?: boolean;

    /** Suppress assemblies: do not get assembly name information for assemblies. */
    suppressAssemblies?: boolean;

    /** Suppress resetting ACLs (useful when laying out image to a network share. */
    suppressResetACLs?: boolean;

    /** Suppress files: do not get any file information (equivalent to `suppressAssemblies` and `suppressFileInfo`). */
    suppressFiles?: boolean;

    /** Suppress file info: do not get hash, version, language, etc. */
    supressFileInfo?: boolean;

    /** Suppress an internal consistency evaluator (ICE). */
    suppressICE?: string;

    /** Suppress layout. */
    suppressLayout?: string;

    /** Suppress outputting the WixPdb. */
    suppressPdb?: boolean;

    /**
     * Suppress patch sequence data in patch XML to decrease bundle size and increase patch applicability performance.
     * (patch packages themselves are not modified).
     */
    suppressPatchSequenceData?: boolean;

    /** Suppress MSI/MSM validation. */
    suppressValidation?: boolean;
}
