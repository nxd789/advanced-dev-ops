"""
Simple statistics functions for basic data analysis.
"""

from typing import List, Union


def mean(numbers: List[Union[int, float]]) -> float:
    """
    Calculate the arithmetic mean (average) of a list of numbers.

    Args:
        numbers: A list of numeric values

    Returns:
        The mean of the numbers

    Raises:
        ValueError: If the list is empty

    Example:
        >>> mean([1, 2, 3, 4, 5])
        3.0
    """
    if not numbers:
        raise ValueError("Cannot calculate mean of empty list")
    return sum(numbers) / len(numbers)


def median(numbers: List[Union[int, float]]) -> float:
    """
    Calculate the median (middle value) of a list of numbers.

    Args:
        numbers: A list of numeric values

    Returns:
        The median of the numbers

    Raises:
        ValueError: If the list is empty

    Example:
        >>> median([1, 2, 3, 4, 5])
        3
        >>> median([1, 2, 3, 4])
        2.5
    """
    if not numbers:
        raise ValueError("Cannot calculate median of empty list")

    sorted_numbers = sorted(numbers)
    n = len(sorted_numbers)
    mid = n // 2

    if n % 2 == 0:
        return (sorted_numbers[mid - 1] + sorted_numbers[mid]) / 2
    else:
        return sorted_numbers[mid]


def mode(numbers: List[Union[int, float]]) -> Union[int, float]:
    """
    Calculate the mode (most frequent value) of a list of numbers.

    Args:
        numbers: A list of numeric values

    Returns:
        The mode of the numbers

    Raises:
        ValueError: If the list is empty or has no unique mode

    Example:
        >>> mode([1, 2, 2, 3, 4])
        2
    """
    if not numbers:
        raise ValueError("Cannot calculate mode of empty list")

    frequency = {}
    for num in numbers:
        frequency[num] = frequency.get(num, 0) + 1

    max_freq = max(frequency.values())
    modes = [num for num, freq in frequency.items() if freq == max_freq]

    if len(modes) == len(frequency):
        raise ValueError("No unique mode found")

    return modes[0]


def variance(numbers: List[Union[int, float]], sample: bool = True) -> float:
    """
    Calculate the variance of a list of numbers.

    Args:
        numbers: A list of numeric values
        sample: If True, calculate sample variance (n-1), otherwise population variance (n)

    Returns:
        The variance of the numbers

    Raises:
        ValueError: If the list is empty or has only one element when sample=True

    Example:
        >>> variance([1, 2, 3, 4, 5])
        2.5
    """
    if not numbers:
        raise ValueError("Cannot calculate variance of empty list")

    if sample and len(numbers) < 2:
        raise ValueError("Sample variance requires at least 2 values")

    avg = mean(numbers)
    squared_diffs = [(x - avg) ** 2 for x in numbers]

    divisor = len(numbers) - 1 if sample else len(numbers)
    return sum(squared_diffs) / divisor


def standard_deviation(numbers: List[Union[int, float]], sample: bool = True) -> float:
    """
    Calculate the standard deviation of a list of numbers.

    Args:
        numbers: A list of numeric values
        sample: If True, calculate sample std dev (n-1), otherwise population std dev (n)

    Returns:
        The standard deviation of the numbers

    Raises:
        ValueError: If the list is empty or has only one element when sample=True

    Example:
        >>> round(standard_deviation([1, 2, 3, 4, 5]), 2)
        1.58
    """
    return variance(numbers, sample) ** 0.5


def range_of_values(numbers: List[Union[int, float]]) -> float:
    """
    Calculate the range (max - min) of a list of numbers.

    Args:
        numbers: A list of numeric values

    Returns:
        The range of the numbers

    Raises:
        ValueError: If the list is empty

    Example:
        >>> range_of_values([1, 2, 3, 4, 5])
        4
    """
    if not numbers:
        raise ValueError("Cannot calculate range of empty list")

    return max(numbers) - min(numbers)
