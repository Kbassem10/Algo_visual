def insertion_sort(arr):
    steps = []
    n = len(arr)
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        while j >= 0:
            steps.append({'compare': [j, j+1]})
            if key < arr[j]:
                arr[j + 1] = arr[j]
                steps.append({'swap': [j, j+1]})
                j -= 1
            else:
                break
        arr[j + 1] = key
    return steps

arr2 = [64, 25, 12, 22, 11]
insertion_sort(arr2)
