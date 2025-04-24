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
        // Use provided array or parse from input
        currentArray = array || parseArrayInput();
        if (currentArray.length === 0) return;

        // Clear previous visualization
        visualizationContainer.innerHTML = '';
        
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
            visualizationContainer.appendChild(bar);
        }
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
            // Start visualization with the first algorithm's steps just for now with only one algo
            const firstAlgo = algorithms[0];
            animationSteps = data[firstAlgo];
            currentStep = 0;
            isAnimating = true;
            animationPaused = false;
            visualizeArray(array);
            animateSteps();
        })
        .catch(function(error) {
            console.error('Error fetching sorting steps:', error);
            alert('Error fetching sorting steps. Check console for details.');
            resetVisualization();
        });
    }

    // ------------------------------------------------------------
    // ANIMATION FUNCTIONS
    // ------------------------------------------------------------
    /**
     * Animates through the sorting steps
     */
    function animateSteps() {
        // Check if animation should continue
        // the base case of the recusrion
        if (!isAnimating || currentStep >= animationSteps.length) {
            if (currentStep >= animationSteps.length) {
                resetControls();
            }
            return;
        }

        // Do nothing if paused
        //another base case for the recursion
        if (animationPaused) return;

        const step = animationSteps[currentStep];
        const bars = visualizationContainer.querySelectorAll('.bar');

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
        }

        // Move to next step
        currentStep++;
        
        // Calculate delay based on speed (convert speed 1-10 to delay 1000ms-100ms)
        const delay = 1100 - (animationSpeed * 100);
        animationTimeout = setTimeout(animateSteps, delay);
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
