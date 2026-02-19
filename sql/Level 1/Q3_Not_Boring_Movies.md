# Q3. Not Boring Movies (MySQL)

## Problem Overview
Filter movies based on two conditions — odd-numbered ID and non-boring description — then sort the results by rating.

## Table Structure

### Cinema Table
| Column Name | Type    | Notes                        |
|-------------|---------|------------------------------|
| id          | int     | Primary Key                  |
| movie       | varchar |                              |
| description | varchar |                              |
| rating      | float   | Range [0, 10], 2 decimal places |

## Key Concepts

### 1. Modulo Operator `%`
The `%` operator returns the **remainder** of a division.

| Expression | Result | Meaning     |
|------------|--------|-------------|
| `5 % 2`    | 1      | Odd number  |
| `4 % 2`    | 0      | Even number |

So `id % 2 = 1` is the standard way to check for odd IDs in MySQL.

### 2. String Inequality
`description != "boring"` filters out rows where the description is exactly the string `"boring"`. You can also write this as `description <> "boring"` — both are valid in MySQL.

### 3. ORDER BY DESC
Sorts results from highest to lowest rating.

## Solution
```sql
SELECT *
FROM Cinema
WHERE id % 2 = 1 AND description != "boring"
ORDER BY rating DESC;
```

## Explanation of Syntax

| Component | Purpose |
|-----------|---------|
| `SELECT *` | Return all columns |
| `WHERE id % 2 = 1` | Keep only odd-numbered IDs |
| `AND description != "boring"` | Exclude movies described as boring |
| `ORDER BY rating DESC` | Sort by rating, highest first |

## Walkthrough With Example Data

| id | movie      | description | rating | id % 2 = 1? | Not boring? | Included? |
|----|------------|-------------|--------|-------------|-------------|-----------|
| 1  | War        | great 3D    | 8.9    | ✅          | ✅          | ✅        |
| 2  | Science    | fiction     | 8.5    | ❌          | ✅          | ❌        |
| 3  | irish      | boring      | 6.2    | ✅          | ❌          | ❌        |
| 4  | Ice song   | Fantacy     | 8.6    | ❌          | ✅          | ❌        |
| 5  | House card | Interesting | 9.1    | ✅          | ✅          | ✅        |

After filtering: rows 1 and 5 remain. After `ORDER BY rating DESC`: row 5 comes first (9.1 > 8.9).

## Alternative: MOD() Function
MySQL also has a built-in function equivalent to `%`:
```sql
WHERE MOD(id, 2) = 1
```
Both approaches are identical in performance — `%` is just the shorthand syntax.

## Key Takeaways
✓ Use `%` (modulo) to check odd/even numbers  
✓ `!=` and `<>` are both valid "not equal" operators in MySQL  
✓ `ORDER BY ... DESC` sorts highest to lowest; `ASC` (the default) sorts lowest to highest  
✓ `SELECT *` is fine for practice but in production, explicitly naming columns is preferred