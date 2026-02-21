# Q3. Monthly Transactions I (MySQL)

## Problem Overview
For each **month + country** combination, find:
- Total number of transactions and their total amount
- Number of **approved** transactions and their total amount

## Table Structure

### Transactions Table
| Column Name | Type    | Notes                          |
|-------------|---------|--------------------------------|
| id          | int     | Primary Key                    |
| country     | varchar |                                |
| state       | enum    | `"approved"` or `"declined"`   |
| amount      | int     |                                |
| trans_date  | date    |                                |

## Core Concepts

### DATE_FORMAT()
`trans_date` is a full date like `2019-01-07`, but you only want the **year-month** granularity for grouping.
```sql
DATE_FORMAT(trans_date, '%Y-%m')  -- produces "2019-01"
```

This truncates the day portion so all transactions in the same month collapse into one group.

### GROUP BY Multiple Columns
You're grouping by **two dimensions** at once: month and country.
```sql
GROUP BY DATE_FORMAT(trans_date, '%Y-%m'), country
```

Every unique (month, country) pair becomes its own row in the result.

### Conditional Aggregation with CASE WHEN
This is the key pattern for computing a subset aggregate (e.g., only approved rows) **without a separate subquery**.
```sql
SUM(CASE WHEN state = 'approved' THEN 1 ELSE 0 END)
```

Think of it as: for each row in the group, contribute `1` if approved, `0` otherwise — then sum those up. The same idea applies to amounts:
```sql
SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END)
```

| Expression                                           | What it computes                          |
|------------------------------------------------------|-------------------------------------------|
| `COUNT(*)`                                           | All transactions in the group             |
| `SUM(amount)`                                        | Total amount of all transactions          |
| `SUM(CASE WHEN state='approved' THEN 1 ELSE 0 END)`  | Count of only approved transactions       |
| `SUM(CASE WHEN state='approved' THEN amount ELSE 0 END)` | Total amount of only approved ones   |

## Solution
```sql
SELECT
    DATE_FORMAT(trans_date, '%Y-%m') AS month,
    country,
    COUNT(*) AS trans_count,
    SUM(CASE WHEN state = 'approved' THEN 1 ELSE 0 END) AS approved_count,
    SUM(amount) AS trans_total_amount,
    SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END) AS approved_total_amount
FROM Transactions
GROUP BY
    DATE_FORMAT(trans_date, '%Y-%m'),
    country;
```

## Walkthrough With Example Data

**Input:**
| id  | country | state    | amount | trans_date |
|-----|---------|----------|--------|------------|
| 121 | US      | approved | 1000   | 2018-12-18 |
| 122 | US      | declined | 2000   | 2018-12-19 |
| 123 | US      | approved | 2000   | 2019-01-01 |
| 124 | DE      | approved | 2000   | 2019-01-07 |

**After `GROUP BY month, country`**, three groups form:

| Group        | Rows in group    |
|--------------|------------------|
| 2018-12 / US | rows 121, 122    |
| 2019-01 / US | row 123          |
| 2019-01 / DE | row 124          |

**Aggregations applied to group `2018-12 / US`:**

| Metric                | Calculation               | Result |
|-----------------------|---------------------------|--------|
| `trans_count`         | 2 rows → `COUNT(*)`       | 2      |
| `approved_count`      | only row 121 is approved  | 1      |
| `trans_total_amount`  | 1000 + 2000               | 3000   |
| `approved_total_amount` | only 1000 (row 121)     | 1000   |

**Final Output:**
| month   | country | trans_count | approved_count | trans_total_amount | approved_total_amount |
|---------|---------|-------------|----------------|--------------------|-----------------------|
| 2018-12 | US      | 2           | 1              | 3000               | 1000                  |
| 2019-01 | US      | 1           | 1              | 2000               | 2000                  |
| 2019-01 | DE      | 1           | 1              | 2000               | 2000                  |

## Key Takeaways
✓ `DATE_FORMAT(date, '%Y-%m')` is the standard way to group by month in MySQL  
✓ `GROUP BY` on multiple columns creates one output row per unique combination  
✓ `SUM(CASE WHEN ... THEN 1 ELSE 0 END)` is the go-to pattern for **conditional counting**  
✓ The same `CASE WHEN` pattern extends naturally to conditional sums of amounts  
✓ No subqueries needed — everything is computed in a single pass over the table