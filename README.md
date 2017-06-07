# nwixtoolset

`nwixtoolset` is a Node module wrapper around the [Windows Installer XML Toolset](http://wixtoolset.org) executables.

## Getting Started

`nwixtoolset` works as a wrapper around the [Windows Installer XML Toolset](http://wixtoolset.org).
It abstracts the executables' switches with JS object abstraction.

### Prerequistes

#### Windows

`.NET Framework 4+` should be installed.

#### Linux and Mac OS X

First install `wine` and `winetricks`:
```shell
# Linux
$ apt-get install wine winetricks

# Mac OS X
$ brew install wine --without-x11
$ brew install winetricks
```

Then, configure `wine` for WIX:
```shell
$ export WINEARCH=win32
$ wineboot
$ winetricks --unattended dotnet40 corefonts
```

### Installation

`nwixtoolset` can be installed using NPM:

```shell
$ npm install nwixtoolset --save
```

### Usage

First import `nwixtoolset` in your project:

```javascript
const wixtoolset = require("nwixtoolset");
```

Then use wixtoolset's executable:

```javascript
wixtoolset.candle("*.wxs", { define: { SourceDir: "path/to/source" } })
    .then(() => wixtoolset.light("*.wixobj", { out: "setup.msi" }));
```

`nwixtoolset` uses native `Promise` to wrap asynchronous operations and resolves with the result of the command:

```javascript
wixtoolset.candle("*.wxs")
	.then(result => {
		result.code 	// The wixtoolset executable exit code.
		result.stdout 	// The wixtoolset executable stdout content.
		result.stderr	// The wixtoolset executable stderr content.
	})
    .catch(err => {
		err.command	// The wixtoolset executable called.
		err.args 	// The wixtoolset executable args.
		err.code 	// The wixtoolset executable exit code.
		err.stdout 	// The wixtoolset executable stdout content.
		err.stderr	// The wixtoolset executable stderr content.
    });
```

### Command-line

`nwixtoolset` can work as a simple wrapper around [Windows Installer XML Toolset](http://wixtoolset.org).

```shell
# Install module globally
$ npm install nwixtoolset -g

# Run module from command line
$ wixtoolset candle -o tmp *.wxs
$ wixtoolset light -o dist\setup.msi tmp\*.wixobj
```

### Raw Usage

First import `nwixtoolset` in your project:

```javascript
const wixtoolset = require("nwixtoolset");
```

Then use raw wixtoolset's executable:

```javascript
wixtoolset.raw.candle(["-dSourceDir=path/to/source", "-o", "temp", "*.wxs"])
    .then(result => /* code, stdout, stderr */);
```

Or use raw cli executable wrapper:

```javascript
wixtoolset.run("candle", ["-dSourceDir=path/to/source", "-o", "temp", "*.wxs"])
    .then(result => /* code, stdout, stderr */);
```

## Documentation

### Available Wrappers

 * `candle`: Preprocesses and compiles WiX source files into object files (.wixobj). For more information on compiling.
 * `dark`: Converts a Windows Installer database into a set of WiX source files. This tool is very useful for getting all your authoring into a WiX source file when you have an existing Windows Installer database. However, you will then need to tweak this file to accomodate different languages and breaking things into fragments.
 * `heat`: Generates WiX authoring from various input formats. It is used for harvesting files, Visual Studio projects and Internet Information Server web sites, "harvesting" these files into components and generating Windows Installer XML Source files (.wxs). Heat is good to use when you begin authoring your first Windows Installer package for a product.
 * `insignia`: Inscribes an installer database with information about the digital certificates its external cabs are signed with. For more information, see Insignia.
 * `light`: Links and binds one or more .wixobj files and creates a Windows Installer database (.msi or .msm). When necessary, Light will also create cabinets and embed streams into the Windows Installer database it creates.
 * `lit`: Combines multiple .wixobj files into libraries that can be consumed by Light.
 * `lux`: Author declarative unit tests for custom actions.
 * `melt`: Converts an .msm into a component group in a WiX source file.
 * `nit`: Run declarative unit tests for custom actions.
 * `pyro`: Takes an XML output patch file (.wixmsp) and one or more XML transform files (.wixmst) and produces an .msp file.
 * `retina`: WIX Toolset library rebuilder.
 * `shine`: WIX Toolset Scanner.
 * `smoke`: Runs validation checks on .msi or .msm files.
 * `torch`: Performs a diff to generate a transform (.wixmst or .mst) for XML outputs (.wixout or .wixpdb) or .msi files.

### wixtoolset.candle(src: string | string[], options: CandleOptions = {}): Promise<RunResult>

Preprocesses and compiles WiX source files into object files (.wixobj).
For more information on compiling, see [Compiler](http://wixtoolset.org/documentation/manual/v3/overview/candle.html).
For more information on preprocessing, see [Preprocessor](http://wixtoolset.org/documentation/manual/v3/overview/preprocessor.html).

```typescript
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
```

### wixtoolset.dark(src: string, options: DarkOptions = {}): Promise<RunResult>

Converts a Windows Installer database into a set of WiX source files.
This tool is very useful for getting all your authoring into a WiX source file when you have an existing Windows Installer database.
However, you will then need to tweak this file to accomodate different languages and breaking things into fragments.

```typescript
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
```

### wixtoolset.heat(harvestType: HarvestType, harvestSource: string, options: HeatOptions = {}): Promise<RunResult>

Generates WiX authoring from various input formats.

It is used for harvesting files, Visual Studio projects and Internet Information Server web sites, "harvesting" these files into components and generating Windows Installer XML Source files (.wxs).

Heat is good to use when you begin authoring your first Windows Installer package for a product.

```typescript
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
    generateGuidsNow?: string;
    
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
```

### wixtoolset.insignia(options: InsigniaOptions): Promise<RunResult>

Inscribes an installer database with information about the digital certificates its external cabs are signed with.

```typescript
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
```

### wixtoolset.light(src: string | string[], options: LightOptions = {}): Promise<RunResult>

Links and binds one or more .wixobj files and creates a Windows Installer database (.msi or .msm). When necessary, Light will also create cabinets and embed streams into the Windows Installer database it creates.

For more information on linking, see [Linker](http://wixtoolset.org/documentation/manual/v3/overview/light.html).

```typescript
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
```

### wixtoolset.lit(src: string[], options: LitOptions = {}): Promise<RunResult>

Combines multiple .wixobj files into libraries that can be consumed by Light.
For more information, see [Librarian](http://wixtoolset.org/documentation/manual/v3/overview/lit.html).

```typescript
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
```

### wixtoolset.lux(src: string | string[], options: LuxOptions = {}): Promise<RunResult>

Author declarative unit tests for custom actions. For more information, see [Unit-testing custom actions with Lux](http://wixtoolset.org/documentation/manual/v3/overview/lux.html).

```typescript
/** Options for the Lux executable. */
export interface LuxOptions extends RunOptions {
    /** Extension assembly or "class, assembly". */
    ext?: string | string[];
    
    /** Specify output file (default: write to current directory). */
    out?: string;

    /** Verbose output. */
    verbose?: boolean;
}
```

### wixtoolset.melt(src: string, dest: string, options: MeltOptions = {}): Promise<RunResult>

Converts an .msm into a component group in a WiX source file.

```typescript
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
```

### wixtoolset.nit(src: string | string[], options: RunOptions = {}): Promise<RunResult>

Runs the unit tests in one or more test packages. For more information, see [Unit-testing custom actions with Lux](http://wixtoolset.org/documentation/manual/v3/overview/lux.html).

### wixtoolset.pyro(src: string, dest: string, options: PyroOptions = {}): Promise<RunResult>

Converts an .msm into a component group in a WiX source file.

```typescript
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
```

### wixtoolset.retina(src: string, options: RetinaOptions = {}): Promise<RunResult>

WIX Toolset library rebuilder.

```typescript
/** Options for the Retina executable. */
export interface RetinaOptions extends RunOptions {
    /** Specify output file (default: write to current directory). */
    out?: string;

    /** Verbose output. */
    verbose?: boolean;
}
```

### wixtoolset.shine(src: string | string[], options: ShineOptions = {}): Promise<RunResult>

WIX Toolset Scanner.

```typescript
/** Options for the Shine executable. */
export interface ShineOptions extends RunOptions {
    /** Save scan as DGML file. */
    dgml?: string;

    /** A valid DGML file populated with data from scan. */
    dgmlTemplate?: string;
    
    /** Filter scan to include only specified symbol(s). */
    includeSymbol?: string | string[];
    
    /** Remove symbol and symbols it references from scan. */
    excludeSymbol?: string | string[];

    /** Displays only the specified items in the scan. (default: all) */
    show?: ShineShowItems | ShineShowItems[];
}

export type ShineShowItems = 
    /** Project files. */
    "proj" |
    /** Source files. */
    "file" |
    /** Symbols. */
    "sym" |
    /** Symbol references. */
    "ref" |
    /** All of the above [default]. */
    "all";
```

### wixtoolset.smoke(src: string | string[], options: SmokeOptions = {}): Promise<RunResult>

WIX Toolset Scanner.

```typescript
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
```

### wixtoolset.torch(targetInput: string, updatedInput: string, options: TorchOptions = {}): Promise<RunResult>

WIX Toolset Scanner.

```typescript
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
```

### wixtoolset.run(exe: string, args: string[], [runOptions: RunOptions]): Promise<RunResult>

Run WIX Toolset executable by using raw arguments.

```typescript
/** Run Options */
export interface RunOptions {
    /** The current working directory to execute sfx bundler binary on. */
    cwd?: string;
    /** The inner spawn stdio option. */
    stdio?: string;
}
```

### Common Interfaces

```typescript
/** Result of the wrapper. */
export interface RunResult {
    /** The WIX exe exit code. */
    code: number;
    /** The WIX exe stdout content. */
    stdout: string;
    /** The WIX exe stderr content. */
    stderr: string;
}

export interface CommonWIXOptions extends RunOptions {
    /** Extension assembly or "class, assembly". */
    ext?: string | string[];
    
    /** Suppress all warnings (true) or a specific message ID. */
    suppressWarning?: boolean | number | number[];

    /** Verbose output. */
    verbose?: boolean;

    /** Treat all warnings or a specific message ID as an error. */
    warningAsError?: boolean | number | number[];
}
```

## Contribute

### Install Project dependencies

```shell
$ npm install
```

### Build project

```shell
$ npm run build
```

## License

[MIT](https://github.com/touchifyapp/nwixtoolset/blob/master/LICENSE)
