# Q1. Combine Two Tables (MySQL)

## Problem Overview
Combine information from two related tables using a JOIN operation to retrieve person details along with their address information.

## Table Structure

### Person Table
- `personId` (Primary Key)
- `firstName`
- `lastName`

### Address Table
- `addressId` (Primary Key)
- `personId` (Foreign Key)
- `city`
- `state`

## Key Concept: LEFT JOIN

A **LEFT JOIN** returns all records from the left table (Person), and matched records from the right table (Address). If there's no match, the address fields will contain NULL values.

### Why LEFT JOIN?
- Some people might not have an address in the database
- We want to include all people regardless of whether they have an address
- Using INNER JOIN would exclude people without addresses

## Solution

```sql
SELECT p.firstName, p.lastName, a.city, a.state
FROM Person AS p
LEFT JOIN Address AS a
ON p.personId = a.personId;
```

## Explanation of Syntax

| Component | Purpose |
|-----------|---------|
| `SELECT p.firstName, p.lastName, a.city, a.state` | Choose which columns to display from both tables |
| `FROM Person AS p` | Start with Person table, alias it as `p` for brevity |
| `LEFT JOIN Address AS a` | Join Address table on the left, alias it as `a` |
| `ON p.personId = a.personId` | Match rows where personId is the same in both tables |

## Example Output

| firstName | lastName | city     | state |
|-----------|----------|----------|-------|
| Allen     | Wang     | New York | NY    |
| Bob       | Alice    | NULL     | NULL  |
| John      | Smith    | Seattle  | WA    |

Note: Bob appears because LEFT JOIN includes all people, even those without addresses.

## JOIN Types Comparison

| Type | Returns |
|------|---------|
| INNER JOIN | Only matching records from both tables |
| LEFT JOIN | All from left table + matches from right table |
| RIGHT JOIN | All from right table + matches from left table |
| FULL OUTER JOIN | All records from both tables |

## Key Takeaways
✓ Use LEFT JOIN to include all records from the primary table  
✓ Use table aliases for cleaner, more readable code  
✓ Always specify the join condition with ON clause  
✓ Consider what should happen when there's no match in the right table
