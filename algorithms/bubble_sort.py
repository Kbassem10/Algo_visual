def bubble_sort(arr):
    print("Original list:", arr)
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
        print(f"After pass {i + 1}: {arr}")
    return arr

arr = [5, 2, 9, 1, 5, 6]
bubble_sort(arr)
