# Q2. Classes With at Least 5 Students (MySQL)

## Problem Overview
Find all classes that have **at least 5 students** enrolled. Return any order.

## Table Structure

### Courses Table
| Column Name | Type    | Notes                               |
|-------------|---------|-------------------------------------|
| student     | varchar | Part of composite Primary Key       |
| class       | varchar | Part of composite Primary Key       |

> The composite PK `(student, class)` means one student can't be enrolled in the same class twice — so every row is a unique enrollment. `COUNT(*)` safely counts distinct students per class.

## Core Concepts

### WHERE vs HAVING ⚠️
This is the most important concept in this problem.
```sql
-- ❌ This doesn't work — you can't filter on aggregate results with WHERE
WHERE COUNT(*) >= 5

-- ✅ Use HAVING to filter after grouping
HAVING COUNT(*) >= 5
```

| Clause   | Runs...                  | Can use aggregates? |
|----------|--------------------------|----------------------|
| `WHERE`  | Before grouping, row by row | ❌ No            |
| `HAVING` | After `GROUP BY`         | ✅ Yes              |

**Rule of thumb:** `WHERE` filters rows. `HAVING` filters groups.

### The Query Execution Order
SQL doesn't run top-to-bottom — it follows this logical order:
```
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

So `HAVING COUNT(*) >= 5` runs *after* groups are formed, which is exactly what you need here.

## Solution
```sql
SELECT class
FROM Courses
GROUP BY class
HAVING COUNT(*) >= 5;
```

## Walkthrough With Example Data

| student | class    |
|---------|----------|
| A       | Math     |
| B       | English  |
| C       | Math     |
| D       | Biology  |
| E       | Math     |
| F       | Computer |
| G       | Math     |
| H       | Math     |
| I       | Math     |

**After `GROUP BY class`:**

| class    | COUNT(*) |
|----------|----------|
| Math     | 6        |
| English  | 1        |
| Biology  | 1        |
| Computer | 1        |

**After `HAVING COUNT(*) >= 5`:**

| class |
|-------|
| Math  |

Only Math has 6 students ≥ 5, so it's the only result. ✅

## Common Mistake: Using WHERE Instead of HAVING
```sql
-- ❌ Wrong — throws an error
SELECT class
FROM Courses
WHERE COUNT(*) >= 5
GROUP BY class;
```

`WHERE` runs before grouping, so `COUNT(*)` doesn't exist yet — SQL has no groups to count at that stage.

## Key Takeaways
✓ `HAVING` is used to filter on aggregate results — `WHERE` cannot do this  
✓ `GROUP BY` + `HAVING COUNT(*)` is the standard pattern for "groups with at least N members"  
✓ The composite PK guarantees no duplicate enrollments, so `COUNT(*)` = number of distinct students  
✓ SQL execution order: `FROM → WHERE → GROUP BY → HAVING → SELECT` — HAVING always comes after GROUP BY