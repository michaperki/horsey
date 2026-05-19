import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';

const processes = [
  {
    name: 'backend',
    command: npmCommand,
    args: ['--prefix', 'backend', 'run', 'dev'],
  },
  {
    name: 'frontend',
    command: npmCommand,
    args: ['--prefix', 'frontend', 'start'],
    env: {
      DANGEROUSLY_DISABLE_HOST_CHECK: 'true',
    },
  },
];

let shuttingDown = false;

const children = processes.map(({ name, command, args, env = {} }) => {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ...env,
    },
    shell: isWindows,
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (data) => {
    process.stdout.write(`[${name}] ${data}`);
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(`[${name}] ${data}`);
  });

  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    const reason = signal ? `signal ${signal}` : `code ${code}`;
    console.error(`[${name}] exited with ${reason}`);
    shutdown(code || 1);
  });

  child.on('error', (error) => {
    if (shuttingDown) return;
    console.error(`[${name}] failed to start: ${error.message}`);
    shutdown(1);
  });

  return child;
});

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }

  setTimeout(() => process.exit(code), 300);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
