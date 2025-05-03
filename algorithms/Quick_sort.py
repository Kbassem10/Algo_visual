import time
def quick_sort(arr):
    start_time = time.time()

    steps = []
    
    def partition(start, end):
        # Visualize the current partition range we're working on
        steps.append({'partition': [start, end]})
        
        # Select the rightmost element as pivot
        pivot_index = end
        pivot_value = arr[pivot_index]
        
        # Highlight the pivot element in the visualization
        steps.append({'pivot': pivot_index})
        
        # Index of smaller element
        smaller_index = start - 1
        
        # Process all elements except the pivot
        for current_index in range(start, end):
            # Compare current element with pivot
            steps.append({'compare': [current_index, pivot_index]})
            
            # If current element is smaller than or equal to pivot
            if arr[current_index] <= pivot_value:
                # Move the smaller_index forward
                smaller_index += 1
                
                # Swap if needed
                if smaller_index != current_index:
                    arr[smaller_index], arr[current_index] = arr[current_index], arr[smaller_index]
                    steps.append({'swap': [smaller_index, current_index]})
        
        # Place pivot in its final position
        final_pivot_position = smaller_index + 1
        if final_pivot_position != pivot_index:
            arr[final_pivot_position], arr[pivot_index] = arr[pivot_index], arr[final_pivot_position]
            steps.append({'swap': [final_pivot_position, pivot_index]})
        
        # Return the position where pivot is placed
        return final_pivot_position
    
    def quick_sort_recursive(start, end):
        # Base case: if the array has 1 or 0 elements, it's already sorted
        if start >= end:
            return
            
        # Partition the array and get the pivot position
        pivot_position = partition(start, end)
        
        # Recursively sort the left subarray
        quick_sort_recursive(start, pivot_position - 1)
        
        # Recursively sort the right subarray
        quick_sort_recursive(pivot_position + 1, end)
    
    # Start the quick sort algorithm
    quick_sort_recursive(0, len(arr) - 1)
    
    end_time = time.time()
    time_taken = end_time - start_time
    
    return steps, time_taken * 1000