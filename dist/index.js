#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/** @format */
const picocolors_1 = __importDefault(require("picocolors"));
const child_process_1 = require("child_process");
const prompts_1 = require("@clack/prompts");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, prompts_1.intro)(picocolors_1.default.bgBlue("Welcome to Create Discora!"));
            // Prompt for the project directory
            const projectDir = yield (0, prompts_1.text)({
                message: "Specify the directory for your project?",
                initialValue: "./myDiscordBot",
                placeholder: "./myDiscordBot",
                validate(value) {
                    if (value.length === 0)
                        return `Value is required!`;
                },
            });
            if ((0, prompts_1.isCancel)(projectDir)) {
                cancelOperation();
            }
            // Prompt for template selection
            const template = yield (0, prompts_1.select)({
                message: "Select one of our default templates",
                options: [
                    {
                        value: "https://github.com/DiscoraLabs/discora-typescript-template",
                        label: "TypeScript (recommended)",
                    },
                    {
                        value: "https://github.com/DiscoraLabs/discora-javascript-template",
                        label: "JavaScript",
                    },
                ],
            });
            if ((0, prompts_1.isCancel)(template)) {
                cancelOperation();
            }
            // Clack.js spinner for cloning the template
            const cloneSpinner = (0, prompts_1.spinner)();
            cloneSpinner.start(picocolors_1.default.green("Cloning template..."));
            try {
                // Run Git clone to download the selected template
                (0, child_process_1.execSync)(`git clone ${template} ${String(projectDir)}`, {
                    stdio: "inherit",
                });
                if ((0, prompts_1.isCancel)(cloneSpinner)) {
                    cloneSpinner.stop("Operation cancelled.");
                    cancelOperation();
                }
                cloneSpinner.stop(picocolors_1.default.green("Template cloned successfully!"));
                // Optional: Remove the .git folder to disconnect from the original repository
                const gitDir = path_1.default.join(String(projectDir), ".git");
                if (fs_1.default.existsSync(gitDir)) {
                    fs_1.default.rmSync(gitDir, { recursive: true, force: true });
                }
                // Clack.js spinner for installing dependencies
                const installSpinner = (0, prompts_1.spinner)();
                installSpinner.start("Installing dependencies...");
                if ((0, prompts_1.isCancel)(installSpinner)) {
                    installSpinner.stop("Operation cancelled.");
                    cancelOperation();
                }
                (0, child_process_1.execSync)(`cd ${String(projectDir)} && npm install`, {
                    stdio: "inherit",
                });
                installSpinner.stop(picocolors_1.default.green("Dependencies installed successfully!"));
            }
            catch (cloneError) {
                cloneSpinner.stop(picocolors_1.default.red("Failed to clone the template."));
                throw cloneError;
            }
            (0, prompts_1.outro)(picocolors_1.default.green("Discora bot creation completed!"));
            // Additional instructions for the user
            (0, prompts_1.outro)(picocolors_1.default.bold(`\nNext steps:\n` +
                `1. Navigate to your project directory: ${picocolors_1.default.blue(`cd ${String(projectDir)}`)}\n` +
                `2. Start the bot by running: ${picocolors_1.default.blue("npm run dev")}\n` +
                `3. Customize your bot as needed.\n`));
        }
        catch (error) {
            (0, prompts_1.outro)(picocolors_1.default.red("An error occurred during the process: " +
                String(error.message)));
        }
    });
}
function cancelOperation() {
    (0, prompts_1.cancel)("Operation cancelled.");
    process.exit(0);
}
main();
