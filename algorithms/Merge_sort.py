def merge_sort(arr):
    steps = []
    n = len(arr)
    
    def merge(start, mid, end):
        left = arr[start:mid+1]
        right = arr[mid+1:end+1]
        i = j = 0
        k = start
        
        while i < len(left) and j < len(right):
            steps.append({'compare': [start+i, mid+1+j]})
            if left[i] <= right[j]:
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                steps.append({'swap': [k, mid+1+j]})
                j += 1
            k += 1
            
        while i < len(left):
            arr[k] = left[i]
            i += 1
            k += 1
            
        while j < len(right):
            arr[k] = right[j]
            j += 1
            k += 1
    
    def sort(start, end):
        if start < end:
            mid = (start + end) // 2
            sort(start, mid)
            sort(mid+1, end)
            merge(start, mid, end)
    
    sort(0, n-1)
    return steps
