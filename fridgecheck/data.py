import json
import os
from collections import namedtuple
from dataclasses import dataclass
from datetime import datetime
from typing import Iterable, Tuple

import requests
from dotenv import dotenv_values
from flask import Blueprint

from fridgecheck.structures import Prediction, Route

bp = Blueprint("app", __name__)

config = {
    **dotenv_values(".env"),
    **os.environ,  # override loaded values with environment variables
}


class Formatter:
    @staticmethod
    def predictions(data):
        return Prediction.from_dict(data)

    @staticmethod
    def routes(data):
        return [Route(**r) for r in data]

class MetlinkApiUrls:

    _PREDICTIONS = "https://api.opendata.metlink.org.nz/v1/stop-predictions?stop_id={stop}"
    _ROUTES = "https://api.opendata.metlink.org.nz/v1/gtfs/routes?stop_id={stop_id}"
    
    def get(self, url):
        response = requests.get(
            url,
            headers={
                "x-api-key": config.get('API_KEY')
            }
        )
        return response.status_code, response.json()
    
    def predictions(self, stop) -> Tuple[int, Prediction]:
        status_code, data = self.get(self._PREDICTIONS.format(stop=stop))
        return (
            status_code,
            Formatter.predictions(data) if status_code == 200 else data
        )
            
    def routes(self, stop) -> Tuple[int, Iterable[Route]]:
        status_code, data = self.get(self._ROUTES.format(stop=stop))
        return (
            status_code,
            Formatter.routes(data) if status_code == 200 else data
        )

    
class LoadDataFromFiles:
    
    _PREDICTIONS = "/fridgecheck/example/predictions_5510.json"
    _ROUTES = "/fridgecheck/example/routes_response.json"
    
    def predictions(self, stop=None):
        return (
            200,
            Formatter.predictions(
                json.loads(
                open(os.getcwd() + self._PREDICTIONS).read())
            )
        )

    def routes(self, stop=None):
        return (
            200,
            Formatter.routes(
                json.loads(
                    open(os.getcwd() + self._ROUTES).read()
                )
            )
        )


class Api:
    """
    Interface which allows swapping out the actual Metlink API for a mock (which reads JSON from disk)
    
    Usage: 
    Api(mock=True).get_prediction(stop=5515)
    """
    
    def __init__(self, mock=False):
        if mock:
            self.data = LoadDataFromFiles()
        else:
            self.data = MetlinkApiUrls()            
    
    def __getattr__(self, attr):
        actual = attr.strip('get_')
        if hasattr(self.data, actual):
            return getattr(self.data, actual)
        else:
            raise Exception("cannot access this property on Api")
