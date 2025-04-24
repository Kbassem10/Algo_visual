def merge_sort(arr):
    # Store visualization steps
    steps = []
    # Create a working copy of the array
    array_copy = arr.copy()
    
    def merge(start, mid, end):
        # Mark the beginning of a merge operation
        steps.append({'merge': [start, mid, end]})
        
        # Copy the two subarrays that need to be merged
        left_half = array_copy[start:mid+1]
        right_half = array_copy[mid+1:end+1]
        
        # Variables to track positions in arrays
        left_pos = 0     # Position in left subarray
        right_pos = 0    # Position in right subarray
        current_pos = start  # Position in main array
        
        # Compare and merge elements from both subarrays
        while left_pos < len(left_half) and right_pos < len(right_half):
            # Visualize comparison between elements
            steps.append({'compare': [start + left_pos, mid + 1 + right_pos]})
            
            # Place smaller element in the right position
            if left_half[left_pos] <= right_half[right_pos]:
                array_copy[current_pos] = left_half[left_pos]
                steps.append({'place': [current_pos, left_half[left_pos]]})
                left_pos += 1
            else:
                array_copy[current_pos] = right_half[right_pos]
                steps.append({'place': [current_pos, right_half[right_pos]]})
                right_pos += 1
                
            current_pos += 1
        
        # Copy any remaining elements from left subarray
        while left_pos < len(left_half):
            array_copy[current_pos] = left_half[left_pos]
            steps.append({'place': [current_pos, left_half[left_pos]]})
            left_pos += 1
            current_pos += 1
        
        # Copy any remaining elements from right subarray
        while right_pos < len(right_half):
            array_copy[current_pos] = right_half[right_pos]
            steps.append({'place': [current_pos, right_half[right_pos]]})
            right_pos += 1
            current_pos += 1
        
        # Mark completion of this merge operation
        steps.append({'mergeComplete': [start, end]})
    
    def split_and_merge(start, end):
        # Base case: single element is already sorted
        if start < end:
            # Find middle point to divide array
            mid = (start + end) // 2
            
            # Visualize the division of array
            steps.append({'divide': [start, end, mid]})
            
            # Recursively sort both halves
            split_and_merge(start, mid)
            split_and_merge(mid + 1, end)
            
            # Merge the sorted halves
            merge(start, mid, end)
    
    # Start the sorting process
    split_and_merge(0, len(arr) - 1)
    
    # Copy the sorted result back to the input array
    for i in range(len(arr)):
        arr[i] = array_copy[i]
    
    return steps
