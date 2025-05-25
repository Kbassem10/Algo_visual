import time
def insertion_sort(arr):

    #start the timer
    start_time = time.time()

    #a list to store the steps
    steps = []
    n = len(arr)
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        while j >= 0:
            steps.append({'compare': [j, j+1]})
            if key < arr[j]:
                arr[j + 1] = arr[j]
                steps.append({'swap': [j, j+1]})
                j -= 1
            else:
                break
        arr[j + 1] = key
    
    #end the timer and return it
    end_time = time.time()
    time_taken = end_time - start_time
    return steps, time_taken * 1000
