# 26-May-2026

Based on my understand at the moment, this project contains 2 parts.

### 1. Global Localized Forecasting Engine

### 2. Business-Specific Forecasting Engine

Currently, I don't have any idea on how to keep this **two sections as a single product** or **weather its possible**.

First, I thought I will start doing the first phase of the project which is the `Global Localized Forecasting Engine`. I generated a synthetic dataset for this with the below structure,

| week_number | month     | province      | product_name | category           | avg_temperature_level | rainfall_level | tourism_level | payday_week | holiday_type | festival_season | school_season | urbanization_level | avg_income_level | demand_score | estimated_units_sold |
| ----------- | --------- | ------------- | ------------ | ------------------ | --------------------- | -------------- | ------------- | ----------- | ------------ | --------------- | ------------- | ------------------ | ---------------- | ------------ | -------------------- |
| 36          | September | North Western | Wheat Flour  | Cooking Essentials | Medium                | Low            | Low           | Yes         | Poya         | Yes             | No            | Medium             | Medium           | 268.7        | 347                  |

Even though I feel like these 2 models are 2 separate models, I think they can be better if **they work together**.

Because the first section of the project doesn't provide much information and It just there to provide information about products trending in that area. The second section provide more details by analyzing existing sales history and tell what products on what quantity needed to be restocked.

So, the project idea is still unclear for me.

Now I decide to make these 2 sections into a single system. So when a customer doesn't have a sales history they will still be able get analytic information via [first system](#1-global-localized-forecasting-engine) and when they have sales history, they will get a more balanced analytic with both systems including the [second system](#2-business-specific-forecasting-engine).

```mermaid
flowchart TD
    A[Start: Customer Request] --> B{Check Sales History}

    B -->|No History| C[First System Only<br>Global-Localized<br>Forecasting Engine]
    C --> D[Generate Analytics<br>Based on Regional/Global Data]
    D --> E[Return Results to Customer]

    B -->|Has History| F[Run Both Systems in Parallel]

    F --> G[First System<br>Global-Localized Engine]
    F --> H[Second System<br>Business-Specific Engine]

    G --> I[Output A: Global/Local Forecast]
    H --> J[Output B: Business-Specific Forecast]

    I --> K[Balanced Analytics Engine]
    J --> K

    K --> L[Weight & Combine Results]
    L --> M[Generate Enhanced Analytics<br>with Sales History Context]
    M --> E

    E --> N[End]
```

## Linear Regression Baseline Model

The baseline model is created for the **global localized engine** using multiple linear regression model.
At **base level** the model shows a,

$R^2 = 0.18244099437092332$  
$\text{MAE} = 183.25608590060762$

- $R^2 = 0.182$ — the model explains only **18\%** of the demand variations.
- $\text{MAE} = 183.256$ — the model's average predictions are off by **183.256** units.

[Read More](../forecasting-service/notebook/module-1/base-model-1.ipynb)

## Random Forest Regression Baseline Model

Another baseline model is created for the **global localized engine** using random forest regression model.
At **base level** the model shows a,

$R^2 = 0.7342853956356417$  
$\text{MAE} = 99.13837483405366$

- $R^2 = 0.734$ — the model explains **73.4\%** of the demand variations.
- $\text{MAE} = 99.138$ — the model's average predictions are off by **99.138** units.

In the training, a logarithm transformation has been applied to the `demand score`. Because, some products have larger demand score and some have a smaller demand score. If they were kept as it is during training the larger values will **dominate the training**. Therefore, a logarithm transform has been used to compress large values,

```py
y = np.log1p(df["demand_score"])
```

and revers the final output to the original scale.

```py
predicts = np.expm1(rf.predict(X_test))
```

[Read More](../forecasting-service/notebook/module-1/base-model-2.ipynb)

## Conclusion

The reason behind the huge difference between `$R^2$` values between the **random forest regression model** and **multiple linear regression model** might be due to the facts that,

- Random forest handles feature interaction better
- Linear regression not great with non-linear patterns
