def quick_sort(arr):
    steps = []
    n = len(arr)

    def partition(low, high):
        pivot = arr[high]
        i = low - 1

        for j in range(low, high):
            steps.append({'compare': [j, high]})
            if arr[j] <= pivot:
                i += 1
                if i != j:
                    arr[i], arr[j] = arr[j], arr[i]
                    steps.append({'swap': [i, j]})

        if i + 1 != high:
            arr[i + 1], arr[high] = arr[high], arr[i + 1]
            steps.append({'swap': [i + 1, high]})
        return i + 1

    def sort(low, high):
        if low < high:
            pi = partition(low, high)
            sort(low, pi - 1)
            sort(pi + 1, high)

    sort(0, n - 1)
    return steps

def quick_sort(arr):
    steps = []
    n = len(arr)

    def partition(low, high):
        pivot = arr[high]  # Choose the last element as pivot
        i = low - 1  # Index of smaller element

        for j in range(low, high):
            steps.append({'compare': [j, high]})  # Compare with pivot
            if arr[j] <= pivot:
                i += 1
                if i != j:  # Swap only if necessary
                    arr[i], arr[j] = arr[j], arr[i]
                    steps.append({'swap': [i, j]})

        # Place pivot in correct position
        if i + 1 != high:
            arr[i + 1], arr[high] = arr[high], arr[i + 1]
            steps.append({'swap': [i + 1, high]})
        return i + 1

    def sort(low, high):
        if low < high:
            # Partition index
            pi = partition(low, high)
            # Recursively sort left and right partitions
            sort(low, pi - 1)
            sort(pi + 1, high)

    sort(0, n - 1)
    return steps

arr = [64, 25, 12, 22, 11]
quick_sort(arr)