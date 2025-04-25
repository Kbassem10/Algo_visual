def merge_sort(arr):
    # Create a list to store visualization steps
    steps = []
    
    def merge(start, mid, end):
        # Visualize the subarrays being merged
        steps.append({'merge': [start, mid, end]})
        
        # Create temporary arrays for the two halves
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
        """Recursively divide the array and merge the sorted subarrays."""
        # Base case: if the subarray has only one element, it's already sorted
        if start >= end:
            return
            
        # Find the middle point to divide the array
        mid = start + (end - start) // 2
        
        # Visualize the division of the array
        steps.append({'divide': [start, end, mid]})
        
        # Recursively sort the first half
        divide_and_conquer(start, mid)
        
        # Recursively sort the second half
        divide_and_conquer(mid + 1, end)
        
        # Merge the two sorted halves
        merge(start, mid, end)
    
    # Start the merge sort process
    divide_and_conquer(0, len(arr) - 1)
    
    return steps
