

interface Departure {
    arrival: {
      "aimed": string,
      "expected": string | null,
    },
    delay: string,
    departure: {
      "aimed": string,
      "expected": string | null,
    },
    operator: "RAIL" | "TZM",
    destination: {
      "name": string,
      "stop_id": string,
    },
    status?: (string|null),
    stop_id: string,
};

interface Stop {
    closed: boolean,
    departures: Departure[],
    farezone: string,
};

export type {Departure, Stop};