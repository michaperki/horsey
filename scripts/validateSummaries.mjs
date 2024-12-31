import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Directories
const baseDir = path.join(__dirname, '..');
const summarySubDir = 'summary';
const dismissedFile = path.join(baseDir, summarySubDir, 'dismissed.json');

let dismissed = {};

// Load dismissed alerts
if (await fs.pathExists(dismissedFile)) {
  dismissed = await fs.readJSON(dismissedFile);
} else {
  await fs.ensureFile(dismissedFile);
  await fs.writeJSON(dismissedFile, dismissed, { spaces: 2 });
}

// Helper function to get all git-tracked files
const getGitTrackedFiles = async (targetDir) => {
  try {
    const { stdout } = await execAsync('git ls-files', { cwd: targetDir });
    const files = stdout
      .split('\n')
      .filter(file => file && !file.includes('node_modules') && !file.startsWith(`${summarySubDir}/`)); // Exclude summary folder
    return files.map(file => path.join(targetDir, file));
  } catch (error) {
    console.error(chalk.red('Error fetching git-tracked files:'), error);
    return [];
  }
};

// Main validation function
const validateSummaries = async (targetDir, dirLabel) => {
  const summaryDir = path.join(targetDir, summarySubDir);
  const allFiles = await getGitTrackedFiles(targetDir);
  const missingSummaries = [];
  const outdatedSummaries = [];

  // Ensure dismissed records exist for this directory
  dismissed[dirLabel] = dismissed[dirLabel] || [];

  allFiles.forEach((file) => {
    const relativePath = path.relative(targetDir, file);
    const summaryPath = path.join(summaryDir, relativePath + '.summary.txt');

    if (!fs.existsSync(summaryPath)) {
      missingSummaries.push(relativePath);
    } else {
      const fileStat = fs.statSync(file);
      const summaryStat = fs.statSync(summaryPath);
      if (fileStat.mtime > summaryStat.mtime) {
        // Check if dismissed
        if (!dismissed[dirLabel].includes(relativePath)) {
          outdatedSummaries.push(relativePath);
        }
      }
    }
  });

  if (missingSummaries.length === 0 && outdatedSummaries.length === 0) {
    console.log(chalk.green(`✅ All summary files are up to date for ${dirLabel}!`));
    return;
  }

  if (missingSummaries.length > 0) {
    console.log(chalk.red(`\n⚠️  Missing Summaries (${missingSummaries.length}) in ${dirLabel}:`));
    missingSummaries.forEach((file) => {
      console.log(chalk.yellow(` - ${file}`));
    });
  }

  if (outdatedSummaries.length > 0) {
    console.log(chalk.red(`\n⚠️  Outdated Summaries (${outdatedSummaries.length}) in ${dirLabel}:`));
    outdatedSummaries.forEach((file) => {
      console.log(chalk.yellow(` - ${file}`));
    });
  }

  // Prompt user to dismiss alerts
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: `Choose an action for ${dirLabel}:`,
      choices: [
        'Update summaries',
        'Dismiss these alerts',
        'Ignore for now',
      ],
    },
  ]);

  if (action === 'Update summaries') {
    console.log(chalk.blue('🔧 Please update the summary files manually.'));
  } else if (action === 'Dismiss these alerts') {
    const toDismiss = [...missingSummaries, ...outdatedSummaries];
    dismissed[dirLabel] = [...new Set([...dismissed[dirLabel], ...toDismiss])];
    await fs.writeJSON(dismissedFile, dismissed, { spaces: 2 });
    console.log(chalk.green(`✅ Alerts dismissed for ${dirLabel}.`));
  } else {
    console.log(chalk.blue('👌 Alerts ignored for now.'));
  }
};

// Entry point
(async () => {
  const { directories } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'directories',
      message: 'Select directories to validate summaries for:',
      choices: [
        { name: 'Backend', value: { path: path.join(baseDir, 'backend'), label: 'Backend' } },
        { name: 'Frontend', value: { path: path.join(baseDir, 'frontend'), label: 'Frontend' } },
      ],
    },
  ]);

  for (const { path: dirPath, label } of directories) {
    await validateSummaries(dirPath, label);
  }
})().catch((err) => {
  console.error(chalk.red('An error occurred:'), err);
  process.exit(1);
});
