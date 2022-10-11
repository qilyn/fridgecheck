import os

from dotenv import dotenv_values
from flask import Blueprint, render_template

from .data import Api

bp = Blueprint('app', __name__)

config = {
    **dotenv_values(".env"),
    **os.environ,  # override loaded values with environment variables
}

@bp.route('/', methods=("GET",))
# @bp.route('/', methods=("GET",))
def home():
    stop="5510"
    
    status_code, formatted_response_data = Api(mock=True).get_predictions(stop=None)
    error = None
    
    if status_code != 200:
        error = formatted_response_data.get('message', f'Failed with {status_code}')

    print(formatted_response_data)
    
    return render_template(
        'predictions.html',
        error=error,
        stop=stop,
        prediction=formatted_response_data,
    )