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
        let maxValue = currentArray[0];
        for (let i = 1; i < currentArray.length; i++) {
            if (currentArray[i] > maxValue) {
                maxValue = currentArray[i];
            }
        }

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
        // Disable step button if multiple algorithms are selected
        stepBtn.disabled = selectedAlgorithms.length > 1; 
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
                const algoData = data[algo]; // Get data for this specific algorithm
                if (!algoData || algoData.error) return; // Skip this algorithm

                const steps = algoData.steps;
                const timeTaken = algoData.time_taken; // Get the time taken

                // Create a container for this algorithm
                const algoDiv = document.createElement('div');
                algoDiv.className = 'visualizer';
                algoDiv.style.display = 'flex';
                algoDiv.style.flexDirection = 'column';
                algoDiv.style.alignItems = 'center';

                // Add a label for the algorithm name
                const label = document.createElement('div');
                label.textContent = (algorithmInfo[algo]?.name || algo);
                label.style.marginBottom = '5px'; // Adjust spacing
                label.style.fontWeight = 'bold';
                algoDiv.appendChild(label);

                // Add element to display time taken
                const timeDiv = document.createElement('div');
                timeDiv.textContent = `Time: ${timeTaken}ms`; // Display formatted time
                timeDiv.style.fontSize = '0.9em';
                timeDiv.style.color = '#555';
                timeDiv.style.marginBottom = '10px'; // Spacing before bars
                algoDiv.appendChild(timeDiv);


                // Create the bars container
                const barsDiv = document.createElement('div');
                                barsDiv.className = 'bars-container';
                barsDiv.style.display = 'flex';
                barsDiv.style.alignItems = 'flex-end';
                barsDiv.style.gap = '4px';

                // Find the maximum value for scaling
                let maxValue = array[0]; // Use the initial array passed to fetchSortingSteps
                for (let i = 1; i < array.length; i++) {
                    if (array[i] > maxValue) {
                        maxValue = array[i];
                    }
                }
                 // Ensure maxValue is at least 1 to avoid division by zero
                maxValue = Math.max(maxValue, 1);

                // Create bars for the initial array
                array.forEach(function(value) {
                    const bar = document.createElement('div');
                    bar.className = 'bar';
                    // Ensure height calculation handles zero max value or zero value gracefully
                    const heightValue = maxValue > 0 ? Math.floor((value / maxValue) * 200) : 0;
                    bar.style.height = heightValue + 'px';
                    bar.style.width = '30px';
                    bar.setAttribute('data-value', value);
                    barsDiv.appendChild(bar);
                });


                algoDiv.appendChild(barsDiv);
                visualizationContainer.appendChild(algoDiv);

                // Store animation state for this algorithm
                animations.push({
                    barsDiv: barsDiv,
                    array: array.slice(), // Use the original array slice for this instance
                    steps: steps,
                    currentStep: 0,
                    isAnimating: true,
                    animationPaused: false,
                    animationTimeout: null,
                    initialMaxValue: maxValue // Store initial max value if needed later
                });
            });

            // Animate all algorithms in parallel
            animations.forEach(function(anim) {
                                animateStepsMulti(anim);
            });

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
        // Check if the specific animation is finished or paused
        if (!anim.isAnimating || anim.currentStep >= anim.steps.length) {
            // Check if all animations are finished
            if (window._algoAnimations && window._algoAnimations.every(a => !a.isAnimating || a.currentStep >= a.steps.length)) {
                resetControls(); // Reset controls only when ALL animations are done
            }
            return; 
        }
        // Use the individual animation's paused state
        if (anim.animationPaused) return; 

        const step = anim.steps[anim.currentStep];
        const bars = anim.barsDiv.children;

        // Reset all bars to default color for this specific visualizer
        for (let i = 0; i < bars.length; i++) {
            bars[i].className = 'bar';
        }

        // Process the current step (logic remains the same)
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
                
                // Calculate the height based on the *initial* maximum value for consistency
                const heightPercent = Math.floor((value / anim.initialMaxValue) * 200) + 'px';
                
                // Update the bar's height and value
                bars[index].style.height = heightPercent;
                bars[index].setAttribute('data-value', value);
                
                anim.array[index] = value; // Update the array state for this animation instance
            }
        } else if (step.mergeComplete) {
            // Highlight the completed merged subarray
            const start = step.mergeComplete[0];
            const end = step.mergeComplete[1];
            
            for (let i = start; i <= end && i < bars.length; i++) {
                bars[i].classList.add('merged');
            }
        }

        // Move to next step for this animation
        anim.currentStep++;
        
        // Calculate delay based on global speed
        const delay = 1100 - (animationSpeed * 100); 
        // Set timeout for this specific animation
        anim.animationTimeout = setTimeout(function() {
            animateStepsMulti(anim); // Pass the specific anim object recursively
        }, delay);
    }

    /**
     * Toggles pause/resume of animation
     */
    function togglePause() {
        // Toggle the global paused state
        animationPaused = !animationPaused; 
        
        if (window._algoAnimations) {
            window._algoAnimations.forEach(function(anim) {
                anim.animationPaused = animationPaused; // Update each animation's paused state
                if (animationPaused) {
                    // Clear timeout when pausing
                    clearTimeout(anim.animationTimeout); 
                } else {
                    // Resume animation if it wasn't finished
                    if (anim.isAnimating && anim.currentStep < anim.steps.length) {
                        animateStepsMulti(anim); // Pass the specific anim object
                    }
                }
            });
        }

        // Update button text
        if (animationPaused){
            pauseBtn.textContent = 'Resume';
        } else {
            pauseBtn.textContent = 'Pause';
        }
    }

    function stepVisualization() {
        // Only allow stepping if exactly one algorithm is running and it's paused
        if (!window._algoAnimations || window._algoAnimations.length !== 1) return;
        
        const anim = window._algoAnimations[0];
        if (!anim.isAnimating || !anim.animationPaused) return; // Must be paused to step

        // Ensure global state reflects the single animation's state for processing
        // This part is tricky and might need better state management if stepping is crucial for multi-algo
        currentStep = anim.currentStep; 
        animationSteps = anim.steps; 
        // currentArray might also need updating if place/swap modified it

        // Process one step if available
        if (currentStep < animationSteps.length) {
            const step = animationSteps[currentStep];
            const bars = anim.barsDiv.children; // Use the correct bars
            
            // Reset all bars to default color
            for (let i = 0; i < bars.length; i++) {
                bars[i].className = 'bar';
            }

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
                    
                    // Calculate the height based on the initial maximum value
                    const heightPercent = Math.floor((value / anim.initialMaxValue) * 200) + 'px';
                    
                    // Update the bar's height and value
                    bars[index].style.height = heightPercent;
                    bars[index].setAttribute('data-value', value);
                    
                    // Also update our currentArray to keep track of the actual values
                    anim.array[index] = value;
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
            anim.currentStep++; // Update the specific animation's step
            currentStep = anim.currentStep; // Keep global step in sync (for now)
            
            // Reset controls if finished
            if (anim.currentStep >= anim.steps.length) {
                anim.isAnimating = false; // Mark this animation as finished
                resetControls();
            }
        }
    }

    /**
     * Resets the visualization to initial state
     */
    function resetVisualization() {
        // Clear timeouts for all animations
        if (window._algoAnimations) {
            window._algoAnimations.forEach(function(anim) {
                clearTimeout(anim.animationTimeout);
                anim.isAnimating = false; // Mark as not animating
            });
        }
        window._algoAnimations = []; // Clear the animations array

        // Reset global state variables
        isAnimating = false; // Although maybe redundant if _algoAnimations controls this
        animationPaused = false;
        currentStep = 0;
        animationSteps = [];
        clearTimeout(animationTimeout); // Clear any lingering global timeout just in case

        resetControls();
        visualizeArray(parseArrayInput()); // Redraw the initial array
    }

    /**
     * Resets control buttons to initial state
     */
    function resetControls() {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        pauseBtn.textContent = 'Pause';
        stepBtn.disabled = true; // Always disable step on reset, re-enable on start if single algo
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
            // Multiple algorithms selected - build HTML for all
            algorithmDescription.innerHTML = ''; // Clear previous content
            for(let i = 0; i < selectedAlgorithms.length; i++){
                const algo = selectedAlgorithms[i];
                const info = algorithmInfo[algo];
                
                // Append info for each algorithm
                algorithmDescription.innerHTML += 
                    '<div style="margin-bottom: 15px;">' + // Add some spacing between entries
                    '<h3>' + info.name + '</h3>' +
                    '<p>' + info.description + '</p>' +
                    '<p><strong>Time Complexity:</strong> ' + info.timeComplexity + '</p>' +
                    '<p><strong>Space Complexity:</strong> ' + info.spaceComplexity + '</p>' +
                    '</div>';
            }
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
