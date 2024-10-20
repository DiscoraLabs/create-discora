#! /usr/bin/env node
/** @format */
import pc from "picocolors";
import { execSync } from "child_process";
import {
  intro,
  outro,
  text,
  isCancel,
  cancel,
  select,
  spinner,
} from "@clack/prompts";
import fs from "fs";
import path from "path";

async function main() {
  try {
    intro(pc.bgBlue("Welcome to Create Discora!"));

    // Prompt for the project directory
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

    // Prompt for template selection
    const template = await select({
      message: "Select one of our default templates",
      options: [
        {
          value:
            "https://github.com/DiscoraLabs/discora-typescript-template",
          label: "TypeScript (recommended)",
        },
        {
          value:
            "https://github.com/DiscoraLabs/discora-javascript-template",
          label: "JavaScript",
        },
      ],
    });

    if (isCancel(template)) {
      cancelOperation();
    }

    // Clack.js spinner for cloning the template
    const cloneSpinner = spinner();
    cloneSpinner.start(pc.green("Cloning template..."));

    try {
      // Run Git clone to download the selected template
      execSync(`git clone ${template} ${String(projectDir)}`, {
        stdio: "inherit",
      });

      if (isCancel(cloneSpinner)) {
        cloneSpinner.stop("Operation cancelled.");
        cancelOperation();
      }

      cloneSpinner.stop(pc.green("Template cloned successfully!"));

      // Optional: Remove the .git folder to disconnect from the original repository
      const gitDir = path.join(String(projectDir), ".git");
      if (fs.existsSync(gitDir)) {
        fs.rmSync(gitDir, { recursive: true, force: true });
      }

      // Clack.js spinner for installing dependencies
      const installSpinner = spinner();
      installSpinner.start("Installing dependencies...");

      if (isCancel(installSpinner)) {
        installSpinner.stop("Operation cancelled.");
        cancelOperation();
      }

      execSync(`cd ${String(projectDir)} && npm install`, {
        stdio: "inherit",
      });

      installSpinner.stop(
        pc.green("Dependencies installed successfully!")
      );
    } catch (cloneError) {
      cloneSpinner.stop(pc.red("Failed to clone the template."));
      throw cloneError;
    }

    outro(pc.green("Discora bot creation completed!"));

    // Additional instructions for the user
    outro(
      pc.bold(
        `\nNext steps:\n` +
          `1. Navigate to your project directory: ${pc.blue(
            `cd ${String(projectDir)}`
          )}\n` +
          `2. Start the bot by running: ${pc.blue("npm run dev")}\n` +
          `3. Customize your bot as needed.\n`
      )
    );
  } catch (error: any) {
    outro(
      pc.red(
        "An error occurred during the process: " +
          String(error.message)
      )
    );
  }
}

function cancelOperation() {
  cancel("Operation cancelled.");
  process.exit(0);
}

main();
