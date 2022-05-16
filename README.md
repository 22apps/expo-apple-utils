# expo/apple-utils

An unstable library for performing Apple API tasks with the unofficial iTunes APIs.

# CHANGES

Oh boy, the hacks...

This repo was cloned from the NPM package that Expo publishes, since they don't publish the public git repo for it.

We needed to patch the code so that asks for MFA tokens from us instead of prompting the command line for them, since we run the program in non-interactive mode.

Specifically, the code that we needed to change was the implementation of `parseAndPromptTFAAsync()`. We replaced the interactive prompts with a call to an HTTP route `${process.env.EXPO_HACKS_BASE_URL}/apple-mfa-token` , which is then handled by our builder. The original code in that code starts at `if (t || r) ...`.

We didn't need to modify the code that prompts for usernames and passwords, since that actually appears to be handled by `expo-cli` (which we cloned and patched separately).

Finally, if this ever breaks and you need to modify this, try [de-obfuscating](https://lelinhtinh.github.io/de4js/) the code first to figure out where the changes need to be made. Unfortunately, de-obfuscating produces invalid JS, so we can't save the cleaner code, but it helps hugely as a guide.

## Upgrading

Newer Expo CLI versions sometimes use a new version of this apple utils package. This is how I've upgrade this patched version of the package in the past:

1. Download the current non-patched version (see `version` within `package.json`) to a temporary directory using `npm i ...`.
2. Download the new non-patched version required by the desired Expo CLI version.
3. De-obfuscate both `build/index.js` files to something like `build/index.pretty.js`.
4. Diff the de-obfuscated files to find the changes.
5. Manually apply the changes to this repo's `build/index.js`.
6. Diff the other files as well just in case. However, in the past, the only other file that has changed is the `package.json` (to update the `version` field, which you should manually apply to this repo as well).
