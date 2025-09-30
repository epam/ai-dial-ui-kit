/* eslint-disable no-undef */
/**
 * This is a minimal script to publish your package to "npm".
 * This is meant to be used as-is or customize as you see fit.
 *
 * This script is executed on "dist/path/to/library" as "cwd" by default.
 *
 * You might need to authenticate with NPM before running this script.
 */
import mainPackageJson from '../package.json' with { type: 'json' };

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import minimist from 'minimist';

console.log('Version in package.json', mainPackageJson.version);

function invariant(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

// Executing publish script: node path/to/publish.mjs {name} --version {version} --tag {tag}
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
let params = minimist(process.argv);
let version = params.version;
const isDevelopment = params.development;
const dry = params.dry === true || params.dry === 'true';
const tag = params.tag || 'next';
const name = mainPackageJson.name;

console.info(
  `\nPublish run with next values:\nname=${name}\nversion=${version}\ndry=${dry}\ntag=${tag}\ndevelopment=${isDevelopment}\n`,
);

const getVersion = (version) => {
  let potentialVersion = version;

  if (isDevelopment && !version) {
    potentialVersion = getDevVersion(potentialVersion);
    invariant(
      potentialVersion !== 'dev',
      `Version calculated incorrectly - still equal 'dev'.`,
    );
  }

  return potentialVersion || mainPackageJson.version;
};
version = getVersion(version);

// A simple SemVer validation to validate the version
const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/;
invariant(
  version && (validVersion.test(version) || version === 'dev'),
  `No version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.# or special name 'dev', got ${version}.`,
);

try {
  const json = JSON.parse(readFileSync(`package.json`).toString());
  console.info(`Setting version in package.json to ${version}`);
  json.version = version;

  writeFileSync(`package.json`, JSON.stringify(json, null, 2));
} catch {
  console.error(`Error reading package.json file from library build output.`);
}

try {
  console.log(
    `Running publish command: npm publish --access public --tag ${tag}`,
  );
  // Execute "npm publish" to publish
  execSync(`npm publish --access public --tag ${tag}`);
} catch {
  console.error(`Publish failed.`);
}

function getDevVersion(potentialVersion) {
  let result;
  try {
    result = JSON.parse(
      execSync(`npm view ${name} versions --json`).toString(),
    );
  } catch (e) {
    if (JSON.parse(e.stdout).error.code === 'E404') {
      console.warn(
        `Could not get versions from registry. Version from package.json will be used.\n `,
      );

      result = [];
    } else {
      throw new Error(`Could not get versions from registry.`);
    }
  }

  if (!result) {
    throw new Error(`Could not get version.`);
  }

  if (!Array.isArray(result) && typeof result === 'string') {
    result = [result];
  }

  console.info(
    `Calculating version increment based on package version (${mainPackageJson.version}) and version from registry (${JSON.stringify(result)})`,
  );

  const lastVersionToIncrement = result
    .filter((ver) => ver.startsWith(mainPackageJson.version))
    .map((ver) => ver.match(/\d+$/)?.[0])
    .filter(Boolean)
    .map((ver) => parseInt(ver, 10))
    .sort((a, b) => a - b)
    .reverse()[0];

  if (typeof lastVersionToIncrement === 'undefined') {
    potentialVersion = `${mainPackageJson.version}.0`;
  } else {
    const incrementedNum = lastVersionToIncrement + 1;
    potentialVersion = `${mainPackageJson.version}.${incrementedNum}`;
  }
  console.warn(
    `Version of development package for ${name} will be: ${potentialVersion}`,
  );
  return potentialVersion;
}
