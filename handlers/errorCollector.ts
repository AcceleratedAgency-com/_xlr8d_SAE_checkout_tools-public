interface IErrorCollector {
    uuid: string;
    eid: string;
    debug: boolean;
    maxLogs: number;
    logs: ErrorLogEntry[];
    print: (title: string,args:ErrorLogEntry['args'])=>void;
    log: (...args:ErrorLogEntry['args'])=>void;
}
  
type ErrorLogEntry = {
    timestamp: number;
    args: unknown[];
}

class ErrorCollector implements IErrorCollector {
    constructor(uuid:string) {this.uuid=uuid;}
    uuid:string;
    eid:string;
    debug = !1;
    maxLogs = 150;
    logs:ErrorLogEntry[] = [];
    print(title:string,args:unknown[]) {
        console.log(`%c[${title}]\n`, "color: #fff; font-size: 14px; font-weight: bold; background: #191f31; padding: 4px; border-radius: 4px;", ...args);
    }
    log(...args:unknown[]) {
        const title = `${this.eid}(${this.uuid})`;
        if (!args.length) return this.logs.forEach(({timestamp, args})=>this.print(`${timestamp} - ${title}`, args));
        if (this.debug) this.print(title,args);
        this.logs.unshift({timestamp:Date.now(), args});
        if (this.logs.length > this.maxLogs) this.logs.splice(this.maxLogs);
    }
}

export { ErrorCollector, IErrorCollector, ErrorLogEntry }