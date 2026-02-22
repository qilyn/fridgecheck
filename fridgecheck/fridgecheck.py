import os
from datetime import datetime, timedelta
from collections import defaultdict
import requests
from flask import (Response, abort, flash, g, redirect, render_template, request, make_response,
                   url_for, jsonify)
from flask import Flask
from flask_cors import CORS
from flask_caching import Cache, CachedResponse
from dotenv import dotenv_values
from .format_stop_predictions import format_date

# TODO:
# from flaskr.auth import login_required
# from flaskr.db import get_db


config = {
    **dotenv_values(".env"),
    **os.environ,  # override loaded values with environment variables
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}
app = Flask(__name__, static_url_path='/static')
app.config.from_mapping(config)
cache = Cache(app)

CORS(app, resources={r"*": {"origins": [
    "localhost:5000",
    "http://127.0.0.1:5000",
    "http://localhost:5173"]}})

STOPS = config.get('STOPS').split(',')


def _retrieve_stop(stop) -> tuple:
    response = requests.get(
        f"https://api.opendata.metlink.org.nz/v1/stop-predictions?stop_id={stop}",
        headers={
            "x-api-key": config.get('API_KEY')
        },
        timeout=100,
    )
    if response.status_code == 403:
        error = "Your API key is missing or invalid"
        return [], error
    else:
        stop_data = response.json()
        format_date(stop_data)
        return stop_data, None


@app.route('/', methods=("GET",))
def home():
    error = ""
    results = []

    for stop in STOPS:
        stop_data, error = _retrieve_stop(stop)
        if error:
            abort(Response(error))
        results.append(stop_data)

    return render_template(
        'home.html',
        stops=results,
        max_departure_time=datetime.now() + timedelta(hours=2)
    )


@app.route('/stops', methods=("GET",))
@cache.cached()
def stops():
    error = ""
    results = []

    for stop in STOPS:
        stop_data, error = _retrieve_stop(stop)
        if error:
            return (
                error,
                403,
            )
        results.append(stop_data)

    return CachedResponse(response=jsonify(results), timeout=240)


@app.route('/stops/<stop>', methods=("GET",))
@cache.cached()
def stop(stop):
    if stop not in STOPS:
        return CachedResponse(response=Response(
            "Not found",
            404
        ), timeout=0)

    stop_data, error = _retrieve_stop(stop)

    if error:
        return render_template(error, status_code=400)

    return CachedResponse(
        response=Response(jsonify(stop_data)),
        timeout=120,
    )
