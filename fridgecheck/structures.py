from dataclasses import dataclass
from datetime import datetime


@dataclass
class PredictionTime:
    aimed: str
    expected: str

    @property
    def aimed_date(self):
        return datetime.fron_iso_format(self.aimed) if self.aimed is not None else None

    @property
    def expected_date(self):
        return (
            datetime.fron_iso_format(self.expected)
            if self.expected is not None
            else None
        )


@dataclass
class Stop:
    stop_id: str
    name: str


@dataclass
class Departure:
    stop_id: str
    service_id: str
    direction: str
    operator: str
    origin: Stop
    destination: Stop
    delay: str
    vehicle_id: str
    arrival: PredictionTime
    departure: PredictionTime
    delay: str
    name: str
    #     **{
    #         "aimed": d["delay"]["aimed"],
    #         "expected": d["delay"]["expected"],
    #     }
    # ),
    status: str
    monitored: bool
    wheelchair_accessible: bool
    trip_id: str


@dataclass
class Prediction:
    """
    Get predictions for services arriving at a stop.
    """

    farezone: str
    closed: bool
    departures: "list[Departure]"
    
    @staticmethod
    def from_dict(data):
        return Prediction(**{
            **data,
            "departures": [
                Departure(**{
                    **departure,
                    "arrival": PredictionTime(**departure['arrival']),
                    "departure": PredictionTime(**departure['departure']),
                })
                for departure in data['departures']
            ]
        })


@dataclass
class Route:
    """
    A path between stops
    """

    id: int
    route_id: str
    agency_id: str
    route_short_name: str
    route_long_name: str
    route_desc: str
    route_type: int
    route_color: str
    route_text_color: str
    route_url: str
