interface Stop {
    name?: string,  // human-chosen name
    number?: string,  // stop number
}


interface Route {
    number?: string, // not confusing at all
    a?: Stop[],
    b?: Stop[],
}

interface Journey {
    name?: string,
    routes?: Route[],
}

export { Journey, Route, Stop };
