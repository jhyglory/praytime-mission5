import { loadEnvFile } from 'node:process';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
if (existsSync('.env.cms.local')) loadEnvFile('.env.cms.local');
// Next's dev worker inherits execArgv; do not forward Node's --env-file flag.
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--webpack','--hostname','127.0.0.1','--port',process.env.CMS_PORT||'3103'],{stdio:'inherit',env:process.env});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>{process.exitCode=code||0;});
