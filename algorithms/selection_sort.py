def selection_sort(arr):
    steps = []
    n = len(arr)
    for i in range(n):
        min_index = i
        for j in range(i + 1, n):
            steps.append({'compare': [min_index, j]})
            if arr[j] < arr[min_index]:
                min_index = j
        if min_index != i:
            arr[i], arr[min_index] = arr[min_index], arr[i]
            steps.append({'swap': [i, min_index]})
    return steps
