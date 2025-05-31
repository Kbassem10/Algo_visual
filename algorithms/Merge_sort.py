#bet2asem le subproblems w terateb w heya betgama3 tani
import time
def merge_sort(arr):

    #start the timer
    start_time = time.time()
    #a list to store the steps
    steps = []
    
    def merge(start, mid, end):
        #show the two parts that are now merging together
        steps.append({'merge': [start, mid, end]})
        
        # Create temporary arrays for the two halves for visualization
        left = arr[start:mid+1]
        right = arr[mid+1:end+1]
        
        i = 0  # Index for left subarray
        j = 0  # Index for right subarray
        k = start  # Index for merged array
        
        # Merge the two subarrays
        while i < len(left) and j < len(right):
            # Visualize comparison between elements from both subarrays
            steps.append({'compare': [start + i, mid + 1 + j]})
            
            if left[i] <= right[j]:
                # Place element from left subarray
                arr[k] = left[i]
                steps.append({'place': [k, left[i]]})
                i += 1
            else:
                # Place element from right subarray
                arr[k] = right[j]
                steps.append({'place': [k, right[j]]})
                j += 1
            k += 1
        
        # Copy remaining elements from left subarray
        while i < len(left):
            arr[k] = left[i]
            steps.append({'place': [k, left[i]]})
            i += 1
            k += 1
        
        # Copy remaining elements from right subarray
        while j < len(right):
            arr[k] = right[j]
            steps.append({'place': [k, right[j]]})
            j += 1
            k += 1
        
        # Mark this merge operation as complete
        steps.append({'mergeComplete': [start, end]})
    
    def divide_and_conquer(start, end):
        #if the subarray has only one element, it's already sorted
        if start >= end:
            return
            
        #find the mid to divide the array
        mid = start + (end - start) // 2
        
        # store it to the steps to visual on the frontend
        steps.append({'divide': [start, end, mid]})
        
        #call the left half again to devide it too
        divide_and_conquer(start, mid)
        
        #call the right half again to devide it too
        divide_and_conquer(mid + 1, end)
        
        #call the function to merge the first two halves on the stack of the devide now
        merge(start, mid, end)
    
    # Start the merge sort process
    divide_and_conquer(0, len(arr) - 1)

    end_time = time.time()
    time_taken = end_time - start_time
    return steps, time_taken * 1000
