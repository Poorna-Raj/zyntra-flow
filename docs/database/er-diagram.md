# Database ER Diagram

```mermaid
erDiagram

PROVINCE ||--o{ SALES_FORECAST : has
PRODUCT ||--o{ SALES_FORECAST : includes
TIME_DIMENSION ||--o{ SALES_FORECAST : time
SEASON_INFO ||--o{ SALES_FORECAST : season
CONTEXT_DIMENSION ||--o{ SALES_FORECAST : context
USER_PROFILES ||--o{ SALES_FORECAST : manages

PROVINCE {
    uuid id
    string name
}

PRODUCT {
    uuid id
    string product_name
    string category
}

TIME_DIMENSION {
    uuid id
    int week_number
    int month
}

SEASON_INFO {
    uuid id
    boolean payday_week
    string holiday_type
    string festival_season
    string school_season
}

CONTEXT_DIMENSION {
    uuid id
    string avg_temperature_level
    string rainfall_level
    string tourism_level
    string urbanization_level
    string avg_income_level
}

SALES_FORECAST {
    uuid id
    float demand_score
    float estimated_units_sold
}

USER_PROFILES {
    uuid id
    string full_name
    string role
}