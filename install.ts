import * as fs from "fs";
import * as path from "path";

const
    downloadRelease = require("download-github-release").default,

    GITHUB_USER = "wixtoolset",
    GITHUB_REPO = "wix3",
    DEST_PATH = path.resolve(__dirname, "wix-bin");

if (!fs.existsSync(DEST_PATH)) {
    fs.mkdirSync(DEST_PATH);
}

downloadRelease(
    GITHUB_USER,
    GITHUB_REPO,
    DEST_PATH,
    filterReleases,
    filterAssets
);

function filterReleases(release: GithubRelease): boolean {
    return !release.prerelease && !release.draft && /^wix(\d+)rtm$/.test(release.tag_name);
}

function filterAssets(asset: GithubAsset): boolean {
    return /^wix(\d+)-binaries\.zip$/.test(asset.name);
}

interface GithubRelease {
    url: string;
    name: string;
    tag_name: string;
    draft: boolean;
    prerelease: boolean;
}

interface GithubAsset {
    id: number;
    url: string;
    name: string;
}