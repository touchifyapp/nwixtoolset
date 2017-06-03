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
 * Combines multiple .wixobj files into libraries that can be consumed by Light.
 * For more information, see [Librarian](http://wixtoolset.org/documentation/manual/v3/overview/lit.html).
 * 
 * @param src           The wixobj files to combine.
 * @param [options]     Options for the combiner.
 */
export async function lit(src: string[], options: LitOptions = {}): Promise<RunResult> {
    const args = ["-nologo"] as string[];

    await addPathArgument(args, "-b", options.bind);
    addArgument(args, "-bf", options.bindFiles);
    addArgument(args, "-loc", options.loc);

    await addPathArgument(args, "-o", options.out);
    addArgument(args, "-pedantic", options.pedantic);
    addArgument(args, "-ss", options.suppressSchemaValidation);
    addArgument(args, "-sv", options.suppressIntermediateValidation);

    addCommonArguments(args, options);

    await addPathFile(args, src);

    return raw.lit(args, options);
}

/** Options for the Lit executable. */
export interface LitOptions extends CommonWIXOptions {
    /**
     * Binder path to locate all files (default: current directory) 
     * prefix the path with 'name=' where 'name' is the name of your named bindpath.
     */
    bind?: string;

    /** Specify output file (default: write .wxs to current directory). */
    bindFiles?: boolean;

    /** Bind localization strings from a wxl into the library file. */
    loc?: string | string[];

    /** Specify output file (default: write to current directory). */
    out?: string;

    /** Show pedantic messages. */
    pedantic?: boolean;

    /** Suppress schema validation of documents (performance boost). */
    suppressSchemaValidation?: boolean;

    /** Suppress intermediate file version mismatch checking. */
    suppressIntermediateValidation?: boolean;
}
