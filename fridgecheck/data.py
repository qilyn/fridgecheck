
import os
from collections import namedtuple
from datetime import datetime

import requests
from dotenv import dotenv_values
from flask import Blueprint

bp = Blueprint('app', __name__)

config = {
    **dotenv_values(".env"),
    **os.environ,  # override loaded values with environment variables
}

Stop = namedtuple('Stop', ["stop_id", "name"])

Departure = namedtuple('Departure', [
    "stop_id",
    "service_id",
    "direction",
    "operator",
    "origin",
    "destination",
    "delay",
    "status",
    "monitored",
])

Prediction = namedtuple('Prediction', ['aimed', 'expected'])
"""
Time at which the vehicle is expected to reach a stop. `expected` may be none if the vehicle hasn't started yet.
"""

class Predictions:
    """
    Get predictions for services arriving at a stop.
    """
    @classmethod
    def get(cls, stop=None):
        response = requests.get(
            "https://api.opendata.metlink.org.nz/v1/stop-predictions?stop_id={stop}",
            headers={
                "x-api-key": config.get('API_KEY')
            }
        )
        return response, cls._format(response) if response.status_code  == 200 else []
        
        
    def _format(response):
        return {
            "farezone": response["farezone"],
            "closed": bool(response["closed"]),
            "departures": [
                Departure(
                    **{
                        "stop_id": d["stop_id"],
                        "service_id": d["service_id"],
                        "direction": d["direction"],
                        "operator": d["operator"],
                        "origin": Stop(**{
                            "stop_id": d["origin"]['stop_id'],
                            "name": d['origin']['name'],
                        }),
                        "destination": Stop(**{
                            "stop_id": d["destination"]['stop_id'],
                            "name": d['destination']['name'],
                        }),
                        "delay": d["delay"],
                        "vehicle_id": d["vehicle_id"],
                        "arrival": Prediction(**{
                            "aimed": datetime.fromisoformat(d['arrival']['aimed']),
                            "expected": datetime.fromisoformat(d['arrival'].get('expected')) if d['arrival'].get('expected') else None,
                        }),
                        "delay": Prediction(**{
                            "aimed": d["delay"]["aimed"],
                            "expected": d["delay"]["expected"],
                        }),
                        "status": d["status"],
                        "monitored": d['monitored'],
                        "wheelchair_accessible": d['wheelchair_accessible'],
                        'trip_id': d['trip_id'],
                    }
                )         
                for d in response['departures']
            ]
        }