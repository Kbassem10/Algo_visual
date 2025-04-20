def selection_sort(arr):
    print("Original list (Selection Sort):", arr)
    n = len(arr)
    for i in range(n):
        min_index = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j
        arr[i], arr[min_index] = arr[min_index], arr[i]
        print(f"After step {i + 1}: {arr}")
    return arr

arr1 = [64, 25, 12, 22, 11]
selection_sort(arr1)
