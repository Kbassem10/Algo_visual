from flask import Flask, render_template, request, jsonify
import json
from algorithms import bubble_sort, selection_sort, insertion_sort, Merge_sort, Quick_sort

app = Flask(__name__)

ALLOWED_ALGORITHMS = {
    'bubble': bubble_sort.bubble_sort,
    'selection': selection_sort.selection_sort,
    'insertion': insertion_sort.insertion_sort,
    'quick':Quick_sort.quick_sort,
    'merge':Merge_sort.merge_sort
}

@app.route("/")
def index():
    list_of_algo = []
    for algo in ALLOWED_ALGORITHMS:
        list_of_algo.append(algo)
    
    return render_template("index.html", list_of_algo=list_of_algo)

@app.route("/sort")
def sort():
    array_str = request.args.get('array')
    algorithms_str = request.args.get('algorithms')
    
    if not array_str or not algorithms_str:
        return jsonify({'error': 'Invalid input'}), 400
    
    try:
        array = json.loads(array_str)
        selected_algorithms = json.loads(algorithms_str)
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format'}), 400

    results = {}

    for algo in selected_algorithms:
        if algo in ALLOWED_ALGORITHMS:
            algo_func = ALLOWED_ALGORITHMS[algo]
            result, time_taken = algo_func(array[:])
            results[algo] = {'steps': result, 'time_taken': f"{time_taken:.2f}"}
        else:
            results[algo] = {'error': 'Unsupported algorithm', 'time_taken': 'N/A'}

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
def method_not_allowed(error):
    return render_template('error_handle.html', error_code = "405", error_description = "Method Not Allowed."), 405

@app.errorhandler(Exception)
def server_error(error):
    return render_template('error_handle.html', error_code = "500", error_description = "Something went wrong."), 500

@app.errorhandler(500)
def internal_server_error(error):
    return render_template('error_handle.html', error_code = "500", error_description="Something Went Wrong."), 500

if __name__ == "__main__":
    app.run(debug=True)