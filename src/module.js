console.log('Module!')

async function start() {
    return await Promise.resolve('Work!');
}

start().then(console.log)