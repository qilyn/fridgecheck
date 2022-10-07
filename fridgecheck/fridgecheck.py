import os

from dotenv import dotenv_values
from flask import Blueprint, render_template

from .data import Predictions

bp = Blueprint('app', __name__)

config = {
    **dotenv_values(".env"),
    **os.environ,  # override loaded values with environment variables
}

@bp.route('/', methods=("GET",))
# @bp.route('/', methods=("GET",))
def home():
    stop="5510"
    
    response, stops = Predictions.get(stop=stop)

    error = ""

    if response.status_code != 200:
        error = f"{response.status_code} - {response.json()}"
    else:
        stop = response.json()

        if not stops:
            error = "No stops retrieved :("

    print(stops)
    
    return render_template(
        'home.html',
        error=error,
        stop=stop,
        stops=stops,
    )