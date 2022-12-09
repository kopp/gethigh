import json


def get_values(rows: int, cols: int) -> list[int]:
    values_str = input("Grid values: ")
    values = json.loads(values_str)
    assert len(values) == rows * cols
    return values


def print_grid(values: list[int], rows: int, cols: int) -> None:
    assert len(values) == rows * cols
    for index, value in enumerate(values):
        if value is None:
            print(" X", end=" ")
        else:
            print(f"{value:2d}", end=" ")
        if (index + 1) % cols == 0:
            print()
    print("\n")


def main():
    rows = 5
    cols = 5
    while True:
        values = get_values(rows, cols)
        print_grid(values, rows, cols)


if __name__ == "__main__":
    main()
