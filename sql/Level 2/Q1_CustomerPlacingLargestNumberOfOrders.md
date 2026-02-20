# Q1. Customer Placing the Largest Number of Orders (MySQL)

## Problem Overview
Find the `customer_number` of the customer who has placed the **most orders**. The problem guarantees exactly one such customer exists.

## Table Structure

### Orders Table
| Column Name     | Type | Notes         |
|-----------------|------|---------------|
| order_number    | int  | Primary Key   |
| customer_number | int  |               |

## Core Concepts

### GROUP BY + Aggregate Functions
To count orders per customer, you need to **group rows by customer** and **count** how many rows fall in each group.
```sql
GROUP BY customer_number
```

This collapses all rows with the same `customer_number` into one group, letting you run `COUNT(*)` on each group.

### COUNT(*) vs COUNT(column)
| Expression         | Counts                          |
|--------------------|---------------------------------|
| `COUNT(*)`         | All rows in the group           |
| `COUNT(column)`    | Non-NULL values in that column  |

Here, `COUNT(*)` is fine — every order row counts as one order regardless of NULLs.

### ORDER BY + LIMIT
Instead of using `MAX()` in a subquery, you can sort groups by their count and just grab the top one:
```sql
ORDER BY COUNT(*) DESC   -- largest count first
LIMIT 1                  -- take only the top row
```

This is clean and efficient for "find the top X" problems.

## Solution
```sql
SELECT customer_number
FROM Orders
GROUP BY customer_number
ORDER BY COUNT(*) DESC
LIMIT 1;
```

## Walkthrough With Example Data

| order_number | customer_number |
|--------------|-----------------|
| 1            | 1               |
| 2            | 2               |
| 3            | 3               |
| 4            | 3               |

**After `GROUP BY customer_number`:**

| customer_number | COUNT(*) |
|-----------------|----------|
| 1               | 1        |
| 2               | 1        |
| 3               | 2        |

**After `ORDER BY COUNT(*) DESC`:**

| customer_number | COUNT(*) |
|-----------------|----------|
| 3               | 2        |
| 1               | 1        |
| 2               | 1        |

**After `LIMIT 1`:** → returns customer `3` ✅

## Alternative: Subquery with MAX()
```sql
SELECT customer_number
FROM Orders
GROUP BY customer_number
HAVING COUNT(*) = (
    SELECT MAX(order_count)
    FROM (
        SELECT COUNT(*) AS order_count
        FROM Orders
        GROUP BY customer_number
    ) AS counts
);
```
This works too, but it's more verbose. The `ORDER BY ... LIMIT 1` approach is preferred here because the problem guarantees a unique winner.

> **When to use each:**
> - `ORDER BY ... LIMIT 1` → when exactly one winner is guaranteed (like this problem)
> - `MAX() subquery` → when there could be **ties** and you want all tied winners

## Key Takeaways
✓ `GROUP BY` + `COUNT(*)` is the standard pattern for counting rows per group  
✓ `ORDER BY COUNT(*) DESC LIMIT 1` is a clean way to find the "top" group  
✓ Your solution is already optimal — no changes needed  
✓ Save the `MAX()` subquery pattern for when ties are possible