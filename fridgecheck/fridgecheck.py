import os

import requests
from flask import (Blueprint, flash, g, redirect, render_template, request,
                   url_for)
# from flaskr.auth import login_required
# from flaskr.db import get_db
from werkzeug.exceptions import abort

from .format_stop_predictions import format_date

bp = Blueprint('app', __name__)
from dotenv import dotenv_values

config = {
    **dotenv_values(".env"),
    **os.environ,  # override loaded values with environment variables
}

@bp.route('/', methods=("GET",))
def home():
    response = requests.get(
        "https://api.opendata.metlink.org.nz/v1/stop-predictions?stop_id=7724",
        headers={
            "x-api-key": config.get('API_KEY')
        }
    )

    error = ""
    stops = []

    if response.status_code == 403:
        error = "Your API key is missing or invalid"
    else:
        stop = response.json()
        format_date(stop)
        stops = [stop]
    
    return render_template(
        'home.html',
        error=error,
        stops=stops,
    )