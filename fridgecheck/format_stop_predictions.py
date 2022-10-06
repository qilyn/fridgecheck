from datetime import datetime


def format_date(stop_prediction: dict):
    for departure in stop_prediction.get('departures', []):
        departure['arrival']['aimed'] = datetime.fromisoformat(departure['arrival']['aimed'])
        if departure['arrival']['expected']:
            departure['arrival']['expected'] = datetime.fromisoformat(departure['arrival']['expected'])