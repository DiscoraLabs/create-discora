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
const prompts_1 = require("@clack/prompts");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, prompts_1.intro)(picocolors_1.default.bgBlue("Welcome to Create Discora!"));
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
            const defaultTemplateType = yield (0, prompts_1.select)({
                message: "Select one of our default templates",
                options: [
                    { value: "typescript", label: "TypeScript (recommended)" },
                    { value: "javascript", label: "Plain JavaScript" },
                ],
            });
            if ((0, prompts_1.isCancel)(defaultTemplateType)) {
                cancelOperation();
            }
            console.log(`Project Directory: ${String(projectDir)}`);
            console.log(`Selected Template: ${defaultTemplateType}`);
            (0, prompts_1.outro)("Discora bot creation completed!");
        }
        catch (error) {
            console.error(picocolors_1.default.red("An error occurred during the process:"), error);
        }
    });
}
function cancelOperation() {
    (0, prompts_1.cancel)("Operation cancelled.");
    process.exit(0);
}
main();
