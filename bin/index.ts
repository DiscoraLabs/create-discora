#! /usr/bin/env node
/** @format */
import pc from "picocolors";
import { intro, outro, text, isCancel, cancel, select } from "@clack/prompts";

async function main() {
  try {
    intro(pc.bgBlue("Welcome to Create Discora!"));

    const projectDir = await text({
      message: "Specify the directory for your project?",
      initialValue: "./myDiscordBot",
      placeholder: "./myDiscordBot",
      validate(value) {
        if (value.length === 0) return `Value is required!`;
      },
    });

    if (isCancel(projectDir)) {
      cancelOperation();
    }

    const defaultTemplateType = await select({
      message: "Select one of our default templates",
      options: [
        { value: "typescript", label: "TypeScript (recommended)" },
        { value: "javascript", label: "Plain JavaScript" },
      ],
    });

    if (isCancel(defaultTemplateType)) {
      cancelOperation();
    }

    console.log(`Project Directory: ${String(projectDir)}`);
    console.log(`Selected Template: ${defaultTemplateType}`);

    outro("Discora bot creation completed!");
  } catch (error) {
    console.error(pc.red("An error occurred during the process:"), error);
  }
}

function cancelOperation() {
  cancel("Operation cancelled.");
  process.exit(0);
}

main();
