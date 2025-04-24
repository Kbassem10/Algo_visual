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
