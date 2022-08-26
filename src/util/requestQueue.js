export class TaskQueue {
    constructor() {
        this.available = 10;
        this.taskList = []
        setTimeout(() => {
            this.run()
        })
    }
    addTask(task) {
        this.taskList.push(task)
    }
    run() {
        const length = this.taskList.length
        if (!length) {
            return
        }
        const min = Math.min(length, this.available)
        for (let i = 0; i < min; i++) {
            this.available--;
            const task = this.taskList.shift()
            task().then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.available++;
                this.run()
            })
        }
    }
}
