/**
 * Algorithm Visualization Script
 * This script manages the visualization of sorting algorithms.
 */
document.addEventListener('DOMContentLoaded', function() {
    // ------------------------------------------------------------
    // DOM ELEMENT REFERENCES
    // ------------------------------------------------------------
    const arrayInput = document.getElementById('array-input');
    const generateRandomBtn = document.getElementById('generate-random');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stepBtn = document.getElementById('step-btn');
    const resetBtn = document.getElementById('reset-btn');
    const speedSlider = document.getElementById('speed-slider');
    const visualizationContainer = document.getElementById('visualization-container');
    const algorithmDescription = document.getElementById('algorithm-description');

    // ------------------------------------------------------------
    // STATE VARIABLES
    // ------------------------------------------------------------
    let currentArray = [];        // Current array being sorted
    let animationSpeed = speedSlider.value;  // Speed of animation (1-10)
    let isAnimating = false;      // Whether animation is in progress
    let animationPaused = false;  // Whether animation is paused
    let animationTimeout = null;  // Reference to timeout for animation
    let currentStep = 0;          // Current step in the algorithm
    let animationSteps = [];      // Steps received from the backend

    // ------------------------------------------------------------
    // ALGORITHM INFORMATION
    // ------------------------------------------------------------
    const algorithmInfo = {
        bubble: {
            name: "Bubble Sort",
            description: "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in wrong order.",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)"
        },
        selection: {
            name: "Selection Sort",
            description: "Selection Sort divides the input list into two parts: a sorted sublist and an unsorted sublist. It repeatedly finds the minimum element from the unsorted sublist and puts it at the end of the sorted sublist.",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)"
        },
        insertion: {
            name: "Insertion Sort",
            description: "Insertion Sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.",
            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)"
        },
        quick: {
            name: "Quick Sort",
            description: "Quick Sort is a divide-and-conquer algorithm that works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.",
            timeComplexity: "Average: O(n log n), Worst: O(n²)",
            spaceComplexity: "O(log n)"
        },
        merge: {
            name: "Merge Sort",
            description: "Merge Sort is an efficient, stable, divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.",
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(n)"
        }
    };

    // ------------------------------------------------------------
    // EVENT LISTENERS
    // ------------------------------------------------------------
    // Set up all button click handlers
    generateRandomBtn.addEventListener('click', generateRandomArray);
    startBtn.addEventListener('click', startVisualization);
    pauseBtn.addEventListener('click', togglePause);
    stepBtn.addEventListener('click', stepVisualization);
    resetBtn.addEventListener('click', resetVisualization);
    speedSlider.addEventListener('input', updateSpeed);

    // Add event listeners for algorithm checkboxes
    const algorithmCheckboxes = document.querySelectorAll('input[name="algorithm"]');
    for (let i = 0; i < algorithmCheckboxes.length; i++) {
        algorithmCheckboxes[i].addEventListener('change', updateAlgorithmInfo);
    }

    // ------------------------------------------------------------
    // ARRAY GENERATION AND DISPLAY
    // ------------------------------------------------------------
    /**
     * Generates a random array and displays it
     */
    function generateRandomArray() {
        // Generate a random array size (5-14)
        const size = Math.floor(Math.random() * 10) + 5; 
        const randomArray = [];
        
        // Generate random values (1-100)
        for (let i = 0; i < size; i++) {
            randomArray.push(Math.floor(Math.random() * 100) + 1);
        }
        
        // Update the input field and display the array
        arrayInput.value = randomArray.join(',');
        visualizeArray(randomArray);
    }

    /**
     * Visualizes the given array as bars
     */
    function visualizeArray(array) {
        currentArray = array || parseArrayInput();
        if (currentArray.length === 0) return;

        // Clear previous visualization
        visualizationContainer.innerHTML = '';

        // Only show the initial array as a single visualizer (not for algorithm comparison)
        const visualizerDiv = document.createElement('div');
        visualizerDiv.className = 'visualizer';
        visualizerDiv.style.display = 'flex';
        visualizerDiv.style.alignItems = 'flex-end';
        visualizerDiv.style.gap = '4px';

        // Find the maximum value for scaling
        let maxValue = Math.max(...currentArray);

        // Create and append bars for each value
        for (let i = 0; i < currentArray.length; i++) {
            const value = currentArray[i];
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = Math.floor((value / maxValue) * 200) + 'px';
            bar.setAttribute('data-value', value);
            visualizerDiv.appendChild(bar);
        }

        visualizationContainer.appendChild(visualizerDiv);
    }

    /**
     * Parses the array input from the text field
     * returns {Array} The parsed array of integers
     */
    function parseArrayInput() {
        const inputText = arrayInput.value.trim();
        if (inputText === '') return [];

        try {
            // Split by commas and parse each item as an integer
            const values = inputText.split(',');
            const result = [];
            
            for (let i = 0; i < values.length; i++) {
                const num = parseInt(values[i].trim(), 10);
                if (isNaN(num)) {
                    throw new Error('Invalid input');
                }
                result.push(num);
            }
            
            return result;
        } catch (error) {
            alert('Please enter valid numbers separated by commas');
            return [];
        }
    }

    // ------------------------------------------------------------
    // VISUALIZATION CONTROL
    // ------------------------------------------------------------
    /**
     * Starts the visualization process
     */
    function startVisualization() {
        const array = parseArrayInput();
        if (array.length === 0) {
            alert('Please enter an array of numbers');
            return;
        }

        const selectedAlgorithms = getSelectedAlgorithms();
        if (selectedAlgorithms.length === 0) {
            alert('Please select at least one algorithm');
            return;
        }

        // Update UI controls
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        stepBtn.disabled = false;
        resetBtn.disabled = false;
        
        // Fetch sorting steps from server
        fetchSortingSteps(array, selectedAlgorithms);
    }

    /**
     * Gets the list of selected algorithm values
     * @returns {Array} Array of selected algorithm values
     */
    function getSelectedAlgorithms() {
        const checkboxes = document.querySelectorAll('input[name="algorithm"]:checked');
        const selectedAlgorithms = [];
        
        for (let i = 0; i < checkboxes.length; i++) {
            selectedAlgorithms.push(checkboxes[i].value);
        }
        
        return selectedAlgorithms;
    }

    /**
     * Fetches sorting steps from the backend API
     * param {Array} array - The array to sort
     * param {Array} algorithms - The algorithms to use
     */
    function fetchSortingSteps(array, algorithms) {
        // Create query parameters
        const queryParams = new URLSearchParams();
        queryParams.set('array', JSON.stringify(array));
        queryParams.set('algorithms', JSON.stringify(algorithms));
        
        // Make API request
        fetch('/sort?' + queryParams.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error! Status: ' + response.status);
            }
            return response.json();
        })
        .then(function(data) {
            visualizationContainer.innerHTML = '';

            // Store animation state for each algorithm
            const animations = [];

            algorithms.forEach(function(algo, idx) {
                const steps = data[algo];
                if (!steps || steps.error) return;

                // Create a container for this algorithm
                const algoDiv = document.createElement('div');
                algoDiv.className = 'visualizer';
                algoDiv.style.display = 'flex';
                algoDiv.style.flexDirection = 'column';
                algoDiv.style.alignItems = 'center';

                // Add a label
                const label = document.createElement('div');
                label.textContent = (algorithmInfo[algo]?.name || algo) + ' Sort';
                label.style.marginBottom = '10px';
                label.style.fontWeight = 'bold';
                algoDiv.appendChild(label);

                // Create the bars container
                const barsDiv = document.createElement('div');
                barsDiv.className = 'bars-container';
                barsDiv.style.display = 'flex';
                barsDiv.style.alignItems = 'flex-end';
                barsDiv.style.gap = '4px';

                // Find the maximum value for scaling
                const maxValue = Math.max(...array);

                // Create bars for the initial array
                array.forEach(function(value) {
                    const bar = document.createElement('div');
                    bar.className = 'bar';
                    bar.style.height = Math.floor((value / maxValue) * 200) + 'px';
                    bar.style.width = '30px';
                    bar.setAttribute('data-value', value);
                    barsDiv.appendChild(bar);
                });

                algoDiv.appendChild(barsDiv);
                visualizationContainer.appendChild(algoDiv);

                // Store animation state for this algorithm
                animations.push({
                    barsDiv: barsDiv,
                    array: array.slice(),
                    steps: steps,
                    currentStep: 0,
                    isAnimating: true,
                    animationPaused: false,
                    animationTimeout: null
                });
            });

            // Animate all algorithms in parallel
            animations.forEach(function(anim) {
                animateStepsMulti(anim);
            });

            // Store for pause/step/reset controls if needed (advanced: you may want to refactor controls for multi-algo)
            window._algoAnimations = animations;
        })
        .catch(function(error) {
            console.error('Error fetching sorting steps:', error);
            alert('Error fetching sorting steps. Check console for details.');
            resetVisualization();
        });
    }

    // Animate steps for a specific algorithm's barsDiv
    function animateStepsMulti(anim) {
        if (!anim.isAnimating || anim.currentStep >= anim.steps.length) {
            return;
        }
        if (anim.animationPaused) return;

        const step = anim.steps[anim.currentStep];
        const bars = anim.barsDiv.children;

        // Reset all bars to default color
        for (let i = 0; i < bars.length; i++) {
            bars[i].className = 'bar';
        }

        // Process the current step
        if (step.compare) {
            // Highlight bars being compared
            const i = step.compare[0];
            const j = step.compare[1];
            
            if (i < bars.length && j < bars.length) {
                bars[i].classList.add('comparing');
                bars[j].classList.add('comparing');
            }
        } else if (step.swap) {
            // Highlight and swap bars
            const i = step.swap[0];
            const j = step.swap[1];
            
            if (i < bars.length && j < bars.length) {
                bars[i].classList.add('swapping');
                bars[j].classList.add('swapping');

                // Get the heights and values
                const heightI = bars[i].style.height;
                const heightJ = bars[j].style.height;
                const valueI = bars[i].getAttribute('data-value');
                const valueJ = bars[j].getAttribute('data-value');

                // Swap heights and values
                bars[i].style.height = heightJ;
                bars[j].style.height = heightI;
                bars[i].setAttribute('data-value', valueJ);
                bars[j].setAttribute('data-value', valueI);
            }
        } else if (step.divide) {
            // Highlight the subarray being divided
            const start = step.divide[0];
            const end = step.divide[1];
            
            for (let i = start; i <= end && i < bars.length; i++) {
                bars[i].classList.add('dividing');
            }

        } else if (step.merge) {
            // Highlight the subarrays being merged
            const start = step.merge[0];
            const mid = step.merge[1];
            const end = step.merge[2];
            
            // Highlight left subarray
            for (let i = start; i <= mid && i < bars.length; i++) {
                bars[i].classList.add('merging-left');
            }
            
            // Highlight right subarray
            for (let i = mid + 1; i <= end && i < bars.length; i++) {
                bars[i].classList.add('merging-right');
            }
        } else if (step.pivot) {
            // Highlight the pivot element in quicksort
            const pivotIndex = step.pivot;
            if (pivotIndex < bars.length) {
                bars[pivotIndex].classList.add('pivot');
            }
        } else if (step.partition) {
            // Highlight the entire partition being processed
            const start = step.partition[0];
            const end = step.partition[1];
            
            for (let i = start; i <= end && i < bars.length; i++) {
                bars[i].classList.add('partitioning');
            }
        } else if (step.place) {
            // Direct placement of a value at an index (especially for merge sort)
            const index = step.place[0];
            const value = step.place[1];
            
            if (index < bars.length) {
                bars[index].classList.add('placing');
                
                // Calculate the height based on the maximum value in the array
                const maxValue = Math.max(...currentArray);
                const heightPercent = Math.floor((value / maxValue) * 200) + 'px';
                
                // Update the bar's height and value
                bars[index].style.height = heightPercent;
                bars[index].setAttribute('data-value', value);
                
                // Also update our currentArray to keep track of the actual values
                currentArray[index] = value;
            }
        } else if (step.mergeComplete) {
            // Highlight the completed merged subarray
            const start = step.mergeComplete[0];
            const end = step.mergeComplete[1];
            
            for (let i = start; i <= end && i < bars.length; i++) {
                bars[i].classList.add('merged');
            }
        }

        // Move to next step
        anim.currentStep++;
        
        // Calculate delay based on speed (convert speed 1-10 to delay 1000ms-100ms)
        const delay = 1100 - (animationSpeed * 100);
        anim.animationTimeout = setTimeout(function() {
            animateStepsMulti(anim);
        }, delay);
    }

    /**
     * Toggles pause/resume of animation
     */
    function togglePause() {
        animationPaused = !animationPaused;
        if (animationPaused){
            pauseBtn.textContent = 'Resume';
        }
        
        else{
            pauseBtn.textContent = 'Pause';
            animateSteps();
        }
    }

    /**
     * Steps through the visualization manually
     */
    function stepVisualization() {
        if (!isAnimating) return;
        
        // Cancel any scheduled animation
        clearTimeout(animationTimeout);
        animationPaused = true;
        pauseBtn.textContent = 'Resume';
        
        // Process one step if available
        if (currentStep < animationSteps.length) {
            const step = animationSteps[currentStep];
            const bars = visualizationContainer.querySelectorAll('.bar');
            
            // Reset all bars to default color
            for (let i = 0; i < bars.length; i++) {
                bars[i].className = 'bar';
            }
            
            // Process the current step
            if (step.compare) {
                const i = step.compare[0];
                const j = step.compare[1];
                
                if (i < bars.length && j < bars.length) {
                    bars[i].classList.add('comparing');
                    bars[j].classList.add('comparing');
                }
            } else if (step.swap) {
                const i = step.swap[0];
                const j = step.swap[1];
                
                if (i < bars.length && j < bars.length) {
                    bars[i].classList.add('swapping');
                    bars[j].classList.add('swapping');
                    
                    // Swap heights and values
                    const heightI = bars[i].style.height;
                    const heightJ = bars[j].style.height;
                    const valueI = bars[i].getAttribute('data-value');
                    const valueJ = bars[j].getAttribute('data-value');
                    
                    bars[i].style.height = heightJ;
                    bars[j].style.height = heightI;
                    bars[i].setAttribute('data-value', valueJ);
                    bars[j].setAttribute('data-value', valueI);
                }
            } else if (step.divide) {
                // Highlight the subarray being divided
                const start = step.divide[0];
                const end = step.divide[1];
                
                for (let i = start; i <= end && i < bars.length; i++) {
                    bars[i].classList.add('dividing');
                }
                
                // Optional: Add a visual divider
                if (step.divide[2]) { // If there's a midpoint specified
                    const mid = step.divide[2];
                    if (mid < bars.length - 1) {
                        bars[mid].classList.add('divider');
                    }
                }
            } else if (step.merge) {
                // Highlight the subarrays being merged
                const start = step.merge[0];
                const mid = step.merge[1];
                const end = step.merge[2];
                
                // Highlight left subarray
                for (let i = start; i <= mid && i < bars.length; i++) {
                    bars[i].classList.add('merging-left');
                }
                
                // Highlight right subarray
                for (let i = mid + 1; i <= end && i < bars.length; i++) {
                    bars[i].classList.add('merging-right');
                }
            } else if (step.pivot) {
                // Highlight the pivot element in quicksort
                const pivotIndex = step.pivot;
                if (pivotIndex < bars.length) {
                    bars[pivotIndex].classList.add('pivot');
                }
            } else if (step.partition) {
                // Highlight the entire partition being processed
                const start = step.partition[0];
                const end = step.partition[1];
                
                for (let i = start; i <= end && i < bars.length; i++) {
                    bars[i].classList.add('partitioning');
                }
            } else if (step.place) {
                // Direct placement of a value at an index (especially for merge sort)
                const index = step.place[0];
                const value = step.place[1];
                
                if (index < bars.length) {
                    bars[index].classList.add('placing');
                    
                    // Calculate the height based on the maximum value in the array
                    const maxValue = Math.max(...currentArray);
                    const heightPercent = Math.floor((value / maxValue) * 200) + 'px';
                    
                    // Update the bar's height and value
                    bars[index].style.height = heightPercent;
                    bars[index].setAttribute('data-value', value);
                    
                    // Also update our currentArray to keep track of the actual values
                    currentArray[index] = value;
                }
            } else if (step.mergeComplete) {
                // Highlight the completed merged subarray
                const start = step.mergeComplete[0];
                const end = step.mergeComplete[1];
                
                for (let i = start; i <= end && i < bars.length; i++) {
                    bars[i].classList.add('merged');
                }
            }
            
            // Move to next step
            currentStep++;
            
            // Reset controls if finished
            if (currentStep >= animationSteps.length) {
                resetControls();
            }
        }
    }

    /**
     * Resets the visualization to initial state
     */
    function resetVisualization() {
        clearTimeout(animationTimeout);
        isAnimating = false;
        animationPaused = false;
        currentStep = 0;
        resetControls();
        visualizeArray(parseArrayInput());
    }

    /**
     * Resets control buttons to initial state
     */
    function resetControls() {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        pauseBtn.textContent = 'Pause';
        stepBtn.disabled = true;
        resetBtn.disabled = true;
    }

    /**
     * Updates animation speed from slider
     */
    function updateSpeed() {
        animationSpeed = speedSlider.value;
    }

    // ------------------------------------------------------------
    // INFORMATION DISPLAY
    // ------------------------------------------------------------
    /**
     * Updates algorithm information display based on selection
     */
    function updateAlgorithmInfo() {
        const selectedAlgorithms = getSelectedAlgorithms();
        
        if (selectedAlgorithms.length === 1) {
            // Display info for a single selected algorithm
            const algo = selectedAlgorithms[0];
            const info = algorithmInfo[algo];
            
            algorithmDescription.innerHTML = 
                '<h3>' + info.name + '</h3>' +
                '<p>' + info.description + '</p>' +
                '<p><strong>Time Complexity:</strong> ' + info.timeComplexity + '</p>' +
                '<p><strong>Space Complexity:</strong> ' + info.spaceComplexity + '</p>';
        } else if (selectedAlgorithms.length > 1) {
            // Multiple algorithms selected
            algorithmDescription.innerHTML = 
                '<p>Multiple algorithms selected. Start visualization to compare them.</p>';
        } else {
            // No algorithms selected
            algorithmDescription.innerHTML = 
                '<p>Select an algorithm to see its description and complexity.</p>';
        }
    }

    // ------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------
    /**
     * Initializes the page
     */
    function init() {
        generateRandomArray();
        updateAlgorithmInfo();
    }

    // Start initialization when page loads
    init();
});
