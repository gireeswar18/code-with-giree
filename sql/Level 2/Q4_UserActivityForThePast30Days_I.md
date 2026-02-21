# Q4. User Activity for the Past 30 Days I (MySQL)

## Problem Overview
For each day in the **30-day window ending 2019-07-27** (inclusive), count the number of **distinct active users** — where "active" means having at least one activity of any type on that day. Days with zero active users are excluded from the output.

## Table Structure

### Activity Table
| Column Name   | Type | Notes                                                              |
|---------------|------|--------------------------------------------------------------------|
| user_id       | int  | May appear multiple times per day                                  |
| session_id    | int  |                                                                    |
| activity_date | date |                                                                    |
| activity_type | enum | `open_session`, `end_session`, `scroll_down`, `send_message`       |

> ⚠️ The table may have **duplicate rows**, and a user can have **multiple activities on the same day** — so naive `COUNT(*)` would overcount.

## Core Concepts

### DATE_SUB() and BETWEEN for a Rolling Window
You need to filter rows to only the 30-day window ending on `2019-07-27`, inclusive on both ends.
```sql
WHERE activity_date BETWEEN DATE_SUB('2019-07-27', INTERVAL 29 DAY) AND '2019-07-27'
```

`DATE_SUB('2019-07-27', INTERVAL 29 DAY)` gives `2019-06-28`. Combined with `BETWEEN`, this captures exactly 30 days: June 28 through July 27.

> **Why 29 and not 30?**  
> `BETWEEN` is **inclusive** on both ends. So the window is:  
> `[2019-06-28, ..., 2019-07-27]` = 29 days gap + 1 = **30 days total**. Using `INTERVAL 30 DAY` would give 31 days.

### COUNT(DISTINCT user_id)
A user with 3 activities on the same day should still count as **1 active user**, not 3.

| Expression                    | Result for user 1 on 2019-07-20 (3 rows) |
|-------------------------------|-------------------------------------------|
| `COUNT(*)`                    | 3 ❌                                      |
| `COUNT(DISTINCT user_id)`     | 1 ✅                                      |

`DISTINCT` deduplicates within each group before counting.

### Days With Zero Users Are Excluded Automatically
Because you're grouping rows that **exist in the table**, days with no activity simply have no rows — so they produce no output group. No special handling needed.

## Solution
```sql
SELECT
    activity_date AS day,
    COUNT(DISTINCT user_id) AS active_users
FROM Activity
WHERE activity_date BETWEEN DATE_SUB('2019-07-27', INTERVAL 29 DAY) AND '2019-07-27'
GROUP BY activity_date;
```

## Walkthrough With Example Data

**After WHERE filter** (removes 2019-06-25, outside the 30-day window):

| user_id | activity_date |
|---------|---------------|
| 1       | 2019-07-20    |
| 1       | 2019-07-20    |
| 1       | 2019-07-20    |
| 2       | 2019-07-20    |
| 2       | 2019-07-21    |
| 2       | 2019-07-21    |
| 3       | 2019-07-21    |
| 3       | 2019-07-21    |
| 3       | 2019-07-21    |

**After `GROUP BY activity_date` + `COUNT(DISTINCT user_id)`:**

| day        | active_users |
|------------|--------------|
| 2019-07-20 | 2 (users 1, 2) |
| 2019-07-21 | 2 (users 2, 3) |

✅ Matches expected output. User 4's rows on 2019-06-25 are filtered out by `WHERE`.

## Key Takeaways
✓ `BETWEEN date_sub AND end_date` is the clean pattern for fixed rolling windows  
✓ When the window is **inclusive on both ends**, subtract `N-1` days to get exactly N days  
✓ `COUNT(DISTINCT user_id)` prevents multi-activity users from being counted multiple times  
✓ Days with no activity are automatically absent — no need to filter them out explicitly