const { exec } = require('child_process');
const os = require('os');

const ports = [3000, 3001, 3002, 3003];

const isWindows = os.platform() === 'win32';

const killPort = (port) => {
  return new Promise((resolve, reject) => {
    const command = isWindows
      ? `netstat -ano | findstr :${port}`
      : `lsof -i :${port} -t`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`No process found using port ${port}`);
        resolve();
        return;
      }

      const pid = isWindows
        ? stdout.split('\r\n')[0].split(/\s+/)[4]
        : stdout.trim();

      if (pid) {
        const killCommand = isWindows
          ? `taskkill /F /PID ${pid}`
          : `kill -9 ${pid}`;

        exec(killCommand, (error) => {
          if (error) {
            console.error(`Error killing process on port ${port}:`, error);
            reject(error);
          } else {
            console.log(`Successfully killed process on port ${port}`);
            resolve();
          }
        });
      } else {
        console.log(`No process found using port ${port}`);
        resolve();
      }
    });
  });
};

const killAllPorts = async () => {
  try {
    await Promise.all(ports.map(port => killPort(port)));
    console.log('All specified ports have been checked and cleared.');
  } catch (error) {
    console.error('Error killing processes:', error);
  }
};

killAllPorts(); 