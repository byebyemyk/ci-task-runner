const promiseTask = require('../lib/promise-task');
const Loger = require('../lib/loger');
const worker = require('../lib/worker');


/**
 * 启动模块设置的构建器
 * @param  {Object[]}  modules          模块列表
 * @param  {number}    parallel         最大并发数
 * @return {Promise}
 */
module.exports = (modules, parallel = require('os').cpus().length) => {

    let tasks = [[]];
    let preOrder = 0;
    let loger = new Loger();

    let task = mod => () => {

        let date = (new Date()).toLocaleString();
        let message = `[green]•[/green] watcher: [green]${mod.name}[/green]`;

        loger.log(`${message} start [gray]${date}[/gray]`);

        return worker(mod.program.command, mod.program.options).then((buildResult = {
            chunks: {},
            assets: []
        }) => {

            Object.assign(buildResult, {
                name: mod.name
            });

            let date = (new Date()).toLocaleString();
            loger.log(`${message} end [gray]${date}[/gray]`);

            return buildResult;
        });
    };

    modules.sort((a, b) => a.order - b.order).forEach(mod => {
        if (mod.order === preOrder) {
            tasks[tasks.length - 1].push(task(mod));
        } else {
            tasks.push([task(mod)]);
        }
        preOrder = mod.order;
    });


    return promiseTask.serial(tasks.map(tasks => () => {
        return promiseTask.parallel(tasks, parallel);
    })).then(buildResults => {
        return [].concat(...buildResults);
    });
};