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
 * Performs a diff to generate a transform (.wixmst or .mst) for XML outputs (.wixout or .wixpdb) or .msi files.
 * 
 * @param targetInput   The target input to process.
 * @param updatedInput  The updated input to process.
 * @param [options]     Options for the compiler.
 */
export async function torch(targetInput: string, updatedInput: string, options: TorchOptions = {}): Promise<RunResult> {
    const args = ["-nologo"] as string[];

    addArgument(args, "-a", options.admin);
    await addPathArgument(args, "-ax", options.adminExtract);
    addArgument(args, "-notidy", options.notidy);
    addArgument(args, "-p", options.preserve);
    addArgument(args, "-pedantic", options.pedantic);
    addArgument(args, "-serr", options.suppressError);
    addArgument(args, "-t", options.transformValidation);
    addArgument(args, "-val", options.validation);
    addArgument(args, "-x", options.extract);
    addArgument(args, "-xi", options.inputWix);
    addArgument(args, "-xo", options.outputWix);

    addCommonArguments(args, options);

    await addPathFile(args, [targetInput, updatedInput]);
    await addPathArgument(args, "-o", options.out);

    if (!undef(options.overridesTemp)) {
        process.env.WIX_TEMP = options.overridesTemp;
    }

    return raw.torch(args, options);
}

/** Options for the Torch executable. */
export interface TorchOptions extends CommonWIXOptions {
    /** Generates an admin image (generates source file information in the transform) (default with adminExtract). */
    admin?: boolean;

    /** Generates an admin image with extraction of binaries (combination of 'admin' and 'extract'). */
    adminExtract?: string;

    /** Do not delete temporary files (useful for debugging). */
    notidy?: boolean;

    /** Specify output file (default: write to current directory). */
    out?: string;

    /** Preserve unmodified content in the output. */
    preserve?: boolean;

    /** Show pedantic messages. */
    pedantic?: boolean;

    /** Suppress error when applying transform. */
    suppressError?: TorchErrorFlag;

    /** Use default validation flags for the transform type. */
    transformValidation?: TorchTransformFlag;

    /** Validation flags for the transform. */
    validation?: TorchValidationFlag;
    
    /** Extract binaries to the specified path. */
    extract?: string;

    /** Input WiX format instead of MSI format (.wixout or .wixpdb). */
    inputWix?: boolean;
    
    /** Output wixout instead of MST format (set by default if inputWix is present). */
    outputWix?: boolean;

    /** Overrides the temporary directory used for cab extraction, binary extraction, ... */
    overridesTemp?: string;
}

export type TorchErrorFlag = 
    /** Ignore errors when adding an existing row. */
    "a" |
    /** Ignore errors when deleting an existing row. */
    "b" |
    /** Ignore errors when adding an existing table. */
    "c" |
    /** Ignore errors when deleting an existing table. */
    "d" |
    /** Ignore errors when modifying a missing row. */
    "e" |
    /** Ignore errors when changing the code page. */
    "f";
    
export type TorchTransformFlag = 
    /** UpgradeCode must match. */
    "g" |
    /** Language must match. */
    "l" |
    /** Product ID must match. */
    "r" |
    /** Check major version only. */
    "s" |
    /** Check major and minor versions. */
    "t" |
    /** Check major, minor, and upgrade versions. */
    "u" |
    /** Upgrade version < target version. */
    "v" |
    /** Upgrade version <= target version. */
    "w" |
    /** Upgrade version = target version. */
    "x" |
    /** Upgrade version > target version. */
    "y" |
    /** Upgrade version >= target version */
    "z";

export type TorchValidationFlag = 
    /** Default flags for a language transform. */
    "language" |
    /** Default flags for an instance transform. */
    "instance" |
    /** Default flags for a patch transform. */
    "patch";
