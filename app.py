# Karim Bassem Joseph (ID: 231000797) – Project Lead & Backend Developer 
# Nadeem Diaa Shokry (ID: 231000857) – Frontend Developer 
# Ahmed Khaled Shalaby (ID: 231000514) – Algorithm Specialist and UI/UX 
# Mahmoud Ahmed Farag (ID: 231002115) – Algorithm Specialist and Testing 

#importing flask to make the app works as backend
from flask import Flask, render_template, request, jsonify

#import json to send the data to the frontend in a suitable way
import json

#importing the algorithms from the algorithms folder
from algorithms import bubble_sort, selection_sort, insertion_sort, Merge_sort, Quick_sort

#initialize the app
app = Flask(__name__)

#make a dict with the allowed algorithms and reference to their functions
ALLOWED_ALGORITHMS = {
    'bubble': bubble_sort.bubble_sort,
    'selection': selection_sort.selection_sort,
    'insertion': insertion_sort.insertion_sort,
    'quick':Quick_sort.quick_sort,
    'merge':Merge_sort.merge_sort
}

#render the main page
@app.route("/")
def index():
    #create the list of allowed algorithms and send it to the frontend
    list_of_algo = []
    for algo in ALLOWED_ALGORITHMS:
        list_of_algo.append(algo)
    
    return render_template("index.html", list_of_algo=list_of_algo)

#a route to sort the algorithms
@app.route("/sort")
def sort():

    #fetch the array to be sorted and the algorthms selected from the request from the frontend
    array_str = request.args.get('array')
    algorithms_str = request.args.get('algorithms')
    
    #checks if the input is incorrect
    if not array_str or not algorithms_str:
        return jsonify({'error': 'Invalid input'}), 400
    
    #a try block to load the array and the algorithms into a normal python Data Structure
    try:
        array = json.loads(array_str)
        selected_algorithms = json.loads(algorithms_str)
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format'}), 400

    # create a dict of results that will be sent to the frontend with the final results
    results = {}

    #a loop to iterate on the selected algo that are sent from the frontend
    for algo in selected_algorithms:

        #checks if the algo is correct ot not
        if algo in ALLOWED_ALGORITHMS:
            #if it's correct then send a copy of the array to the function in the algos folders
            algo_func = ALLOWED_ALGORITHMS[algo]
            result, time_taken = algo_func(array[:])

            #fetch the result and the time taken by the algo to send them to the frontend
            results[algo] = {'steps': result, 'time_taken': f"{time_taken:.2f}"}
        else:

            #if it's not supported send an error
            results[algo] = {'error': 'Unsupported algorithm', 'time_taken': 'N/A'}

    #return the dict of the results
    return jsonify(results)

#Some error handling just in case
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