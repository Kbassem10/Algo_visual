from flask import Flask, render_template, request, redirect, jsonify
import os
from algorithms import bubble_sort, selection_sort, insertion_sort

app = Flask(__name__)

ALLOWED_ALGORITHMS = {
    'bubble': bubble_sort.bubble_sort,
    'selection': selection_sort.selection_sort,
    'insertion': insertion_sort.insertion_sort
}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/sort")
def sort():
    data = request.get_json()
    array = data.get('array')
    selected = data.get('algorithms')

    if not array or not selected:
        return jsonify({'error': 'Invalid input'}), 400

    results = {}

    for algo in selected:
        if algo in ALLOWED_ALGORITHMS:
            result = ALLOWED_ALGORITHMS[algo](array[:])
            results[algo] = result
        else:
            results[algo] = {'error': 'Unsupported'}

    return jsonify(results)

@app.errorhandler(404)
def page_not_found(error):
    return render_template('error_handle.html', error_code = "404", error_description = "We can't find that page."), 404

@app.errorhandler(400)
def session_expired(error):
    return render_template('error_handle.html', error_code = "400", error_description= "Session Expired."), 400

@app.errorhandler(429)
def request_amount_exceed(error):
    return render_template('error_handle.html', error_code = "429", error_description= "You exceeded the Maximum amount of requests! Please Try Again Later"), 429

@app.errorhandler(405)
def page_not_found(error):
    return render_template('error_handle.html', error_code = "405", error_description = "Method Not Allowed."), 405

@app.errorhandler(Exception)
def server_error(error):
    return render_template('error_handle.html', error_code = "500", error_description = "Something went wrong."), 500

@app.errorhandler(500)
def internal_server_error(error):
    return render_template('error_handle.html', error_code = "500", error_description="Something Went Wrong."), 500