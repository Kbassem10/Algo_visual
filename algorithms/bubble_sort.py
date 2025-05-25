import time
def bubble_sort(arr):
    #start the timer
    start_time = time.time()

    #create a lits to store the steps
    steps = []

    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            steps.append({'compare': [j, j+1]})
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                steps.append({'swap': [j, j+1]})
    
    #stop the timer and calculate it
    end_time = time.time()
    time_taken = end_time - start_time
    return steps, time_taken * 1000
