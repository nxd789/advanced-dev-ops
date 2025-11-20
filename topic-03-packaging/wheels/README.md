# SimpleStat

A simple Python package for basic statistical calculations.

## Installation

```bash
pip install simplestat
```

Or build from source:

```bash
python -m build
pip install dist/simplestat-1.0.0-py3-none-any.whl
```

## Features

- Calculate mean (average)
- Calculate median (middle value)
- Calculate mode (most frequent value)
- Calculate variance
- Calculate standard deviation
- Calculate range

## Usage

```python
from simplestat import mean, median, mode, variance, standard_deviation, range_of_values

# Example data
data = [1, 2, 3, 4, 5, 5, 6, 7, 8, 9]

# Calculate statistics
print(f"Mean: {mean(data)}")                          # Mean: 5.0
print(f"Median: {median(data)}")                      # Median: 5.0
print(f"Mode: {mode(data)}")                          # Mode: 5
print(f"Variance: {variance(data)}")                  # Variance: 7.33...
print(f"Standard Deviation: {standard_deviation(data)}")  # Std Dev: 2.70...
print(f"Range: {range_of_values(data)}")              # Range: 8
```

## API Reference

### `mean(numbers: List[Union[int, float]]) -> float`
Calculate the arithmetic mean (average) of a list of numbers.

### `median(numbers: List[Union[int, float]]) -> float`
Calculate the median (middle value) of a list of numbers.

### `mode(numbers: List[Union[int, float]]) -> Union[int, float]`
Calculate the mode (most frequent value) of a list of numbers.

### `variance(numbers: List[Union[int, float]], sample: bool = True) -> float`
Calculate the variance of a list of numbers.
- `sample=True`: Sample variance (divides by n-1)
- `sample=False`: Population variance (divides by n)

### `standard_deviation(numbers: List[Union[int, float]], sample: bool = True) -> float`
Calculate the standard deviation of a list of numbers.

### `range_of_values(numbers: List[Union[int, float]]) -> float`
Calculate the range (max - min) of a list of numbers.

## Building the Package

To build this package as a wheel:

```bash
# Install build tools
pip install build

# Build the package
python -m build

# This creates:
# dist/simplestat-1.0.0-py3-none-any.whl
# dist/simplestat-1.0.0.tar.gz
```

## Testing

```python
# Test the functions
import simplestat

data = [1, 2, 3, 4, 5]
assert simplestat.mean(data) == 3.0
assert simplestat.median(data) == 3
assert simplestat.range_of_values(data) == 4
```

## Requirements

- Python >= 3.8
- No external dependencies

## License

MIT License
