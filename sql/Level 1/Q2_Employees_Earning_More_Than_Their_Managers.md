# Q2. Employees Earning More Than Their Managers (MySQL)

## Problem Overview
Find employees whose salary is greater than their manager's salary by joining the Employee table with itself.

## Table Structure

### Employee Table
| Column Name | Type    | Notes                        |
|-------------|---------|------------------------------|
| id          | int     | Primary Key                  |
| name        | varchar |                              |
| salary      | int     |                              |
| managerId   | int     | Foreign Key → Employee(id)   |

> Note: `managerId` is NULL for top-level employees (they have no manager).

## Key Concept: SELF JOIN

A **Self Join** joins a table to itself. Here, we treat the same `Employee` table as **two different roles**:
- `e1` → the **employee**
- `e2` → the **manager**

By matching `e1.managerId = e2.id`, we link each employee to their manager's row.

### Why INNER JOIN (not LEFT JOIN)?
- We only care about employees **who have a manager**
- Employees with `managerId = NULL` have no manager to compare against, so they're safely excluded
- LEFT JOIN would include NULL managers, causing incorrect comparisons

## Solution
```sql
SELECT
    e1.name AS Employee
FROM
    Employee AS e1 JOIN Employee AS e2
ON e1.managerId = e2.id
WHERE e1.salary > e2.salary;
```

## Explanation of Syntax

| Component | Purpose |
|-----------|---------|
| `Employee AS e1` | The employee's perspective |
| `Employee AS e2` | The manager's perspective (same table, different alias) |
| `ON e1.managerId = e2.id` | Links employee to their manager's row |
| `WHERE e1.salary > e2.salary` | Keeps only employees earning more than their manager |
| `e1.name AS Employee` | Renames column to match expected output |

## Walkthrough With Example Data

| e1 (Employee) | e1.salary | e1.managerId | e2 (Manager) | e2.salary | e1 > e2? |
|---------------|-----------|--------------|--------------|-----------|----------|
| Joe           | 70000     | 3            | Sam          | 60000     | ✅ Yes   |
| Henry         | 80000     | 4            | Max          | 90000     | ❌ No    |
| Sam           | 60000     | NULL         | —            | —         | skipped  |
| Max           | 90000     | NULL         | —            | —         | skipped  |

Only **Joe** passes the WHERE filter → Output: `Joe`

## Self Join vs Regular Join

| Scenario | Join Type |
|----------|-----------|
| Two **different** tables | Regular JOIN |
| Same table, **two different roles** | Self JOIN (use aliases!) |

## Key Takeaways
✓ Self JOIN lets you compare rows **within the same table**  
✓ Use two different aliases to treat the table as two separate entities  
✓ INNER JOIN naturally excludes NULL managers — no extra filtering needed  
✓ Always alias your columns in output to match the expected result format