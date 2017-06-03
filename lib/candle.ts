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
    addPathArgument,
    addFixedPathArgument,
    addPathFile
} from "./util";

/**
 * Preprocesses and compiles WiX source files into object files (.wixobj).
 * For more information on compiling, see [Compiler](http://wixtoolset.org/documentation/manual/v3/overview/candle.html).
 * For more information on preprocessing, see [Preprocessor](http://wixtoolset.org/documentation/manual/v3/overview/preprocessor.html).
 * 
 * @param src           The file(s) to process.
 * @param [options]     Options for the compiler.
 */
export async function candle(src: string | string[], options: CandleOptions = {}): Promise<RunResult> {
    const args = ["-nologo"] as string[];

    addArgument(args, "-arch", options.arch);
    addArgument(args, "-d", options.define);
    addArgument(args, "-fips", options.fips);
    await addPathArgument(args, "-I", options.include);
    await addPathArgument(args, "-o", options.out);
    await addFixedPathArgument(args, "-p", options.preprocess);
    addArgument(args, "-pedantic", options.pedantic);
    addArgument(args, "-platform", options.platform);
    addArgument(args, "-sfdvital", options.sfdvital);
    addArgument(args, "-ss", options.supressShemaValidation);
    addArgument(args, "-trace", options.trace);

    addCommonArguments(args, options);

    await addPathFile(args, src);

    return raw.candle(args, options);
}

/** Options for the Candle executable. */
export interface CandleOptions extends CommonWIXOptions {
    /** set architecture defaults for package, components, etc. (default: x86). */
    arch?: "x86" | "x64" | "ia64";

    /** Define a parameter for the preprocessor. */
    define?: Dictionary<string | boolean>;

    /** Enables FIPS compliant algorithms. */
    fips?: boolean;

    /** Add paths to include search path. */
    include?: string | string[];

    /** Specify output file (default: write to current directory). */
    out?: string;

    /** Preprocess to a file (or stdout if no file supplied). */
    preprocess?: string;

    /** Show pedantic messages. */
    pedantic?: boolean;

    /**
     * Deprecated alias for `arch`.
     * @deprecated
     */
    platform?: string;
    
    /**
     * Suppress marking files as Vital by default.
     * @deprecated
     */
    sfdvital?: boolean;

    /**
     * Suppress schema validation of documents (performance boost).
     * @deprecated
     */
    supressShemaValidation?: boolean;

    /** Show source trace for errors, warnings, and verbose messages. */
    trace?: boolean;
}
