interface PredictionTime {
    aimed: string
    expected: string
}

interface Stop {
    stop_id: string
    name: string
}

const enum Status {
    DELAYED = "delayed",
    ONTIME = "ontime",
    CANCELLED = "cancelled",
    EARLY = "early"
}

interface Departure {
    stop_id: string
    service_id: string
    direction: string
    operator: string
    origin: Stop
    destination: Stop
    vehicle_id: string
    arrival: PredictionTime
    departure: PredictionTime
    delay: string
    name: string
    status: Status
    monitored: boolean
    wheelchair_accessible: boolean
    trip_id: string
}

interface Prediction {
    farezone: string
    closed: boolean
    departures: Departure[]
}

interface Recommendation {
    departure: Departure,
    nextDeparture?: Departure,
    earlierDeparture?: Departure,
}

export { Departure, Recommendation, Prediction, PredictionTime, Status, Stop }

