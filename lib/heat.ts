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
    addPathFile
} from "./util";

/**
 * Generates WiX authoring from various input formats.
 * It is used for harvesting files, Visual Studio projects and Internet Information Server web sites,
 * "harvesting" these files into components and generating Windows Installer XML Source files (.wxs).
 * 
 * Heat is good to use when you begin authoring your first Windows Installer package for a product.
 * 
 * @param harvestType   The harvest type. Supported values are (dir, file, payload, perf, project, reg, website).
 * @param harvestSource The harvest to process.
 * @param [options]     Options for the compiler.
 */
export async function heat(harvestType: HarvestType, harvestSource: string, options: HeatOptions = {}): Promise<RunResult> {
    const args = [harvestType] as string[];

    await addPathFile(args, harvestSource);

    args.push("-nologo");

    addArgument(args, "-ag", options.autoGenerateGuid);
    addArgument(args, "-cg", options.componentGroup);
    addArgument(args, "-configuration", options.configuration);
    addArgument(args, "-directoryid", options.directoryId);
    addArgument(args, "-dr", options.directoryRef);
    addArgument(args, "-g1", options.noBrackets);
    addArgument(args, "-generate", options.generate);
    addArgument(args, "-gg", options.generateGuidsNow);
    addArgument(args, "-indent", options.indent);
    addArgument(args, "-ke", options.keepEmptyDirs);
    await addPathArgument(args, "-out", options.out);
    addArgument(args, "-platform", options.platform);
    addArgument(args, "-pog", options.outputGroup);
    addArgument(args, "-projectname", options.projectName);
    addArgument(args, "-scom", options.suppressCOM);
    addArgument(args, "-sfrag", options.suppressFragments);
    addArgument(args, "-srd", options.suppressRootDir);
    addArgument(args, "-sreg", options.suppressRegistry);
    addArgument(args, "-suid", options.suppressUID);
    addArgument(args, "-svb6", options.suppressVB6);
    addArgument(args, "-t", options.transformXSL);
    addArgument(args, "-template", options.template);
    addArgument(args, "-var", options.var);
    addArgument(args, "-wixvar", options.wixvar);

    addCommonArguments(args, options);

    return raw.heat(args, options);
}

/** Heat Harvest Type */
export type HarvestType =
    /** Harvest a directory. */
    "dir" |
    /** Harvest a file. */
    "file" |
    /** Harvest a bundle payload as RemotePayload. */
    "payload" |
    /** Harvest performance counters. */
    "perf" |
    /** Harvest outputs of a VS project. */
    "project" |
    /** Harvest a .reg file. */
    "reg" |
    /** Harvest an IIS web site. */
    "website";

/** Options for the Heat executable. */
export interface HeatOptions extends CommonWIXOptions {
    /** Autogenerate component guids at compile time. */
    autoGenerateGuid?: boolean;

    /** Component group name (cannot contain spaces e.g -cg MyComponentGroup). */
    componentGroup?: string;

    /** Configuration to set when harvesting the project. */
    configuration?: string;

    /** Overridden directory id for generated directory elements. */
    directoryId?: string;

    /** Directory reference to root directories (cannot contain spaces e.g. -dr MyAppDirRef). */
    directoryRef?: string;

    /** Generated guids are not in brackets. */
    noBrackets?: string;

    /** Specify what elements to generate (default is components). */
    generate?: "components" | "container" | "payloadgroup" | "layout" | "packagegroup";

    /** Generate guids now. */
    generateGuidsNow?: boolean;
    
    /** Indentation multiple (overrides default of 4). */
    indent?: number;

    /** Keep empty directories */
    keepEmptyDirs?: boolean;

    /** Specify output file (default: write to current directory). */
    out?: string;

    /** Platform to set when harvesting the project. */
    platform?: string;

    /** Specify output group of VS project. This option may be repeated for multiple output groups. */
    outputGroup?: HeatOutputGroup | HeatOutputGroup[];

    /** Overridden project name to use in variables. */
    projectName?: string;

    /** Suppress COM elements. */
    suppressCOM?: boolean;

    /** Suppress fragments. */
    suppressFragments?: boolean;
    
    /** Suppress harvesting the root directory as an element. */
    suppressRootDir?: boolean;
    
    /** Suppress registry harvesting. */
    suppressRegistry?: boolean;
    
    /** Suppress unique identifiers for files, components, & directories. */
    suppressUID?: boolean;
    
    /** Suppress VB6 COM elements. */
    suppressVB6?: boolean;
    
    /** Transform harvested output with XSL file. */
    transformXSL?: boolean;
    
    /** Use template. */
    template?: "fragment" | "module" | "product";

    /**
     * Substitute File/@Source="SourceDir" with a preprocessor or a wix variable 
     * (e.g. -var var.MySource will become File/@Source="$(var.MySource)\myfile.txt" and
     * -var wix.MySource will become File/@Source="!(wix.MySource)\myfile.txt"
     */
    var?: string;

    /** Generate binder variables instead of preprocessor variables. */
    wixvar?: boolean;
}

export type HeatOutputGroup = "Binaries" | "Symbols" | "Documents" | "Satellites" | "Sources" | "Content";
