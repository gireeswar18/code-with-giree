# Q4. Find Customer Referee (MySQL)

## Problem Overview
Return customers who were **not** referred by customer with id = 2. This includes customers referred by someone else, and customers with no referrer at all.

## Table Structure

### Customer Table
| Column Name | Type    | Notes                              |
|-------------|---------|-------------------------------------|
| id          | int     | Primary Key                         |
| name        | varchar |                                     |
| referee_id  | int     | NULL if not referred by anyone      |

## Key Concept: NULL Handling ⚠️

This is the most important concept in this problem. In SQL, **NULL means unknown/missing** — it doesn't equal anything, not even itself.
```sql
-- These both return UNKNOWN, not TRUE or FALSE
NULL != 2   → UNKNOWN
NULL = 2    → UNKNOWN
```

Because of this, `WHERE referee_id != 2` **silently drops NULL rows** — rows where the condition evaluates to UNKNOWN are excluded. That's why you must explicitly handle NULL with `IS NULL`.

### The Fix: OR IS NULL
```sql
WHERE referee_id != 2 OR referee_id IS NULL
```
This covers both cases:
- `referee_id != 2` → referred by someone other than customer 2
- `referee_id IS NULL` → not referred by anyone

## Solution
```sql
SELECT name
FROM Customer
WHERE referee_id != 2 OR referee_id IS NULL;
```

## Walkthrough With Example Data

| id | name | referee_id | `!= 2`?  | `IS NULL`? | Included? |
|----|------|------------|----------|------------|-----------|
| 1  | Will | NULL       | UNKNOWN  | ✅         | ✅        |
| 2  | Jane | NULL       | UNKNOWN  | ✅         | ✅        |
| 3  | Alex | 2          | ❌       | ❌         | ❌        |
| 4  | Bill | NULL       | UNKNOWN  | ✅         | ✅        |
| 5  | Zack | 1          | ✅       | ❌         | ✅        |
| 6  | Mark | 2          | ❌       | ❌         | ❌        |

Alex and Mark are excluded — both referred by customer 2.

## Alternative: Using IFNULL()
```sql
WHERE IFNULL(referee_id, 0) != 2
```
`IFNULL(referee_id, 0)` replaces NULL with 0 before comparing, so NULLs safely pass the `!= 2` check. Both approaches give the same result.

## NULL Comparison Cheat Sheet

| Expression       | Result  |
|------------------|---------|
| `NULL = 2`       | UNKNOWN |
| `NULL != 2`      | UNKNOWN |
| `NULL IS NULL`   | TRUE    |
| `NULL IS NOT NULL` | FALSE |
| `IFNULL(NULL, 0)` | 0     |

> **Rule of thumb:** Never use `=` or `!=` to check for NULL. Always use `IS NULL` or `IS NOT NULL`.

## Key Takeaways
✓ `NULL != 2` does **not** evaluate to TRUE — it evaluates to UNKNOWN and gets excluded  
✓ Always handle NULL explicitly with `IS NULL` when filtering nullable columns  
✓ `OR referee_id IS NULL` is the safest and most readable approach  
✓ `IFNULL()` is a handy alternative to substitute a default value for NULLs