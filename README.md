# Algorithm Visualizer

A web application for visualizing various algorithms using Flask. This project aims to help users understand how different algorithms work through visual representation.

## Project Structure

```
Algo_visual/
├── algorithms/           # Algorithm implementation files
│   ├── __init__.py       # Package initialization
│   ├── bubble_sort.py    # Bubble sort implementation
│   └── ...               # Other algorithm files
├── static/               # Static files (CSS, JavaScript, images)
│   ├── css/              # CSS stylesheets
│   ├── js/               # JavaScript files
│   └── images/           # Image assets
├── templates/            # HTML templates
│   ├── index.html        # Main page template
│   └── error_handle.html # Error page template
├── app.py                # Main Flask application file
├── requirements.txt      # Project dependencies
└── README.md             # This file
```

## Setup Instructions

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd Algo_visual
   ```

2. **Create and activate a virtual environment (recommended)**

   On Windows:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

   On macOS/Linux:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**

   ```bash
   flask run
   # or
   python app.py
   ```

5. **Access the application**
   
   Open your browser and navigate to: `http://127.0.0.1:5000/`

## Development Guidelines

### Adding New Algorithms

1. Create a new Python file in the `algorithms/` directory for each algorithm
   - Example: `algorithms/quick_sort.py`
2. Implement the algorithm in a function format
3. Make sure to import the algorithm in `algorithms/__init__.py`
4. Update the Flask routes in `app.py` to utilize the new algorithm

### Frontend Development

- HTML templates should be placed in the `templates/` directory
- CSS files should be placed in `static/css/`
- JavaScript files should be placed in `static/js/`
- Images should be placed in `static/images/`

### Flask Application Structure

The main application logic is in `app.py`. This file:
- Initializes the Flask application
- Defines routes for different URLs
- Handles error cases
- Imports and uses algorithms from the `algorithms/` package

## Common Flask Commands

- Run the application in development mode:
  ```bash
  flask run --debug
  ```

- Run on a specific port:
  ```bash
  flask run --port=8080
  ```

- Run accessible from any network interface:
  ```bash
  flask run --host=0.0.0.0
  ```

## Troubleshooting

- If you encounter import errors, make sure the `algorithms/__init__.py` file is properly importing all algorithm files.
- For Flask errors, check the console output for detailed error messages.
- Make sure all required directories exist before running the application.

## Contributing

1. Create a new branch for your feature
2. Implement your changes
3. Test your implementation thoroughly
4. Submit a pull request for review
