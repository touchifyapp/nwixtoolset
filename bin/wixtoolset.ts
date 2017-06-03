#!/usr/bin/env node

import * as toolset from "../index";

const 
    args = process.argv.slice(2),
    exe = args.shift() as string;

toolset.run(exe, args, { stdio: "inherit" })
    .catch((err: toolset.RunError) => {
        process.exit(err.code || 1);
    });