interface PredictionTime {
    aimed: string
    expected: string
}

interface Stop {
    stop_id: string
    name: string
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
    status: string
    monitored: boolean
    wheelchair_accessible: boolean
    trip_id: string
}