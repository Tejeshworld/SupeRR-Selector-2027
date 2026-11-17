# IPL Pressure Analytics
### Advanced Cricket Performance Intelligence Under Pressure

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-brightgreen.svg)](#technology-stack)
[![Design System](https://img.shields.io/badge/Design%20System-Midnight%20Pink%20v2-F20A91.svg)](#design-identity)
[![Zero Emojis](https://img.shields.io/badge/Icons-100%25%20React%20Icons%20SVG-10B981.svg)](#key-features)
[![Dataset](https://img.shields.io/badge/Deliveries%20Analyzed-201%2C000%2B-blueviolet.svg)](#dataset-description)

---

## 1. Executive Summary

In contemporary T20 cricket, macro statistics such as raw batting strike rate or overall bowling economy often fail to capture match-winning reliability. A boundary scored in a low-stakes powerplay against a backup bowler does not carry the same competitive leverage as a boundary struck requiring 12 runs off 4 balls against an elite death bowler. Conversely, a bowler who suppresses runs during the 19th or 20th over against top-order finishers delivers exponentially greater win probability than one defending a 90-run deficit in garbage time.

**IPL Pressure Analytics** is an advanced quantitative cricket intelligence and decision-support system developed to identify, evaluate, and rank elite T20 players under high-pressure competitive conditions. Operating on **201,000+ ball-by-ball deliveries** across **883 matches** from IPL and international competitions, the platform combines **dynamic win-probability simulation**, **competition-tier weighting**, **Empirical Bayes prior shrinkage ($k=180\text{ balls}$)**, and **supervised Random Forest modeling** to produce objective, noise-resistant pressure ratings for batters and bowlers.

The web platform renders these insights through a broadcast-grade **Midnight Pink** interface, featuring a continuous **SVG 3D perspective ball-tracking trajectory visualizer**, interactive pressure heatmaps, win-probability shift telemetry, and comprehensive player dossiers.

---

## 2. Project Overview

### 2.1 The Criticality of Pressure in T20 Cricket
T20 matches are frequently decided in high-leverage inflection phases—particularly death overs (overs 16–20), acute run chases with Required Run Rates exceeding $10.0\text{ rpo}$, sudden top-order collapses, and knockout playoff stages. Traditional aggregate statistics suffer from:
1. **Leverage Blindness**: Conflating low-stakes accumulation with high-stakes performance.
2. **Sample-Size Distortion**: Small sample sizes in extreme situations leading to volatile outliers.
3. **Opposition Quality Invariance**: Treating a delivery against an elite batter identical to one against a lower-order tailender.

### 2.2 Core Objectives
- **Contextual Pressure Quantification**: Calculate an objective pressure score ($0\text{ to }100$) for every ball in the dataset based on run rate pressure, wicket deficit, match phase, and tournament stakes.
- **Empirical Shrinkage & Normalization**: Neutralize small-sample variance using Empirical Bayes shrinkage toward league baselines before rating players.
- **Explainable Machine Learning**: Train supervised ensemble regressors to establish empirical feature weights predicting match victory.
- **Interactive Sports Analytics UI**: Present data-driven rankings, dual-column comparisons, interactive 6-axis player radars, and real-time delivery tracking without visual clutter or generic templates.

---

## 3. Key Features

### 3.1 Pressure-Based Player Rankings

- **Top 10 Batters Under Pressure:** Full-width interactive ranking table displaying elite pressure performers extracted from `top_10_batters_under_pressure.csv`.

- **Top 10 Bowlers Under Pressure:** Dedicated ranking table identifying premier death-over performers and clutch wicket-takers from `top_10_bowlers_under_pressure.csv`.

- **Standardized Pressure Ratings:** Normalized ratings centered at Mean = 50.0 and Standard Deviation = 15.0, highlighting exceptional performers with ratings above 80.0.

### 3.2 Advanced Performance Analytics

- **Batting Strike-Rate Acceleration:** Direct comparison of normal strike rate (`n_sr`) versus high-pressure strike rate (`p_sr`) and strike-rate delta (`sr_delta`).

- **Bowling Economy Suppression:** Direct measurement of baseline economy (`n_econ`) versus pressure economy (`p_econ`) and economy improvement (`econ_diff`).

- **Interactive Search & Sorting:** Real-time multi-column sorting and fuzzy-search filtering by player name or franchise.

- **Original CSV Export:** One-click download functionality providing the original analytical datasets for external scouting and evaluation.

### 3.3 Interactive Ball-Tracking Trajectory Engine

- Perspective-based 3D cricket pitch visualization featuring realistic geometry, bowling and batting creases, and illuminated stumps.
- Curved SVG trajectory modeling bowler release, ball flight, pitch impact, post-bounce deviation and striker crease arrival.
- Animated ball movement with release markers, bounce indicators, motion trails and speed labels.
- Interactive playback controls: Play, Pause and Replay.
- Multi-speed playback support: `0.5×`, `1.0×` and `1.5×`.

### 3.4 Three Interactive Visualization Modes

1. **Trajectory**
   - Animated ball-flight visualization.
   - Release and bounce markers.
   - Ball trajectory path.
   - Delivery speed indicators.

2. **Pressure Map**
   - Colour-coded pitch heatmap.
   - Yorker, Slot, Good Length and Bouncer zones.
   - Interactive mouse-inspection tooltips.
   - Delivery pressure distribution.

3. **Win Shift**
   - Animated win-probability progression graph.
   - Pre-delivery versus post-delivery win probability.
   - Delivery-level probability changes.
   - Match-pressure impact visualization.

### 3.5 Responsive Delivery Telemetry Dashboard

A balanced four-card telemetry grid displaying:

- **Delivery Context:** Bowler, batter, over and delivery information.
- **Measured Speed:** Bowling speed and measurement units.
- **Pitch Length & Line:** Delivery classification and pitch placement.
- **Win Probability Shift:** Before-and-after probability comparison.

Designed with responsive layouts and no horizontal overflow.

### 3.6 Player Dossier & Deep-Dive Analytics

- Interactive player dossier modal.
- Detailed player performance information.
- Six-axis radar chart comparing pressure-performance dimensions.
- Visual comparison of player strengths across analytical metrics.

### 3.7 Midnight Pink Design System

A premium dark sports-analytics interface featuring:

| Design Element | Specification |
|---|---|
| Primary Background | `#08070E` |
| Card Background | `#171321` |
| Primary Pink | `#F20A91` |
| Neon Pink | `#FF38AE` |
| Violet Accent | `#A855F7` |
| Typography | Space Grotesk, Inter and JetBrains Mono |
| Icons | React Icons |
| Visualization | SVG and Recharts |
| Animations | Framer Motion |

Additional design characteristics:
- Premium dark dashboard aesthetics.
- Subtle neon lighting and gradient effects.
- Interactive hover states and smooth transitions.
- Responsive desktop, tablet and mobile layouts.
- Consistent SVG-based React Icons throughout the interface.
- Zero emojis across the application.


## 4. Machine Learning & Statistical Methodology

The statistical pipeline implemented in `RR_IPL2027.ipynb` follows a multi-stage quantitative workflow:

```
[201,000+ Raw Deliveries]
           │
           ▼
[Dynamic Win Probability (Logistic Regression)]
           │
           ▼
[Composite Pressure Score (0-100) & Filter (Score ≥ 40.0)]
           │
           ▼
[Context-Adjusted Baseline Delta Calculation]
           │
           ▼
[Supervised Random Forest Regressors (Feature Importance)]
           │
           ▼
[Empirical Bayes Prior Shrinkage (k = 180 balls)]
           │
           ▼
[Standardized Pressure Rating: Rating = 50 + 15 · Z(Raw)]
```

### 4.1 Dynamic Win Probability Model
For second-innings run chases, ball-by-ball win probability is predicted using a multivariate `LogisticRegression` model trained on completed chase trajectories:
- **Features**:
  - $\text{RRR}_{\text{capped}}$: Required Run Rate clipped to $[0, 36]\text{ rpo}$.
  - $\text{Wkts}_{\text{left}}$: Remaining wickets in hand ($10 - \text{wickets lost}$).
  - $\text{Balls}_{\text{rem}}$: Remaining legal deliveries (DLS-adjusted).
  - $\text{Runs}_{\text{needed}}$: Target minus cumulative runs scored.
  - $\text{RRR} \times \text{Wkts}_{\text{left}}$: Interaction term capturing resource collapse.
- Produces continuous pre-ball win probability: $\text{WP}_{\text{before}} \in [0.0, 1.0]$.

### 4.2 Composite Contextual Pressure Score ($0 - 100$)
Every ball in the dataset is assigned an objective pressure index:
$$\text{Pressure Score} = \text{clip}\left(100 \cdot \big(0.35 \cdot \text{Rate}_{\text{press}} + 0.35 \cdot \text{Wkt}_{\text{press}} + 0.30 \cdot \text{Endgame}_{\text{press}}\big) + 12 \cdot \mathbb{I}_{\text{high\_stakes}}, \; 0, \; 100\right)$$
- **Rate Pressure**: RRR intensity in chases or run-rate deficit in the first innings.
- **Wicket Pressure**: Deficit against expected par wickets lost for that ball number.
- **Endgame Pressure**: Weighted function of match death phase ($\text{Over} \ge 13$) and chase closeness ($1.0 - 2.0 \cdot |\text{WP} - 0.5|$).
- **High Stakes Multiplier**: $+12.0\text{ points}$ for Finals, Qualifiers, Eliminators, and Super 4 matches.
- **Threshold**: Deliveries with $\text{Pressure Score} \ge 40.0$ are designated as high-pressure deliveries.

### 4.3 Competition Tier Weighting
To adjust for opposing bowling and batting quality across tournaments:
- **IPL (2022–2026)**: Weight $= 1.00$
- **Full Member T20 Internationals**: Weight $= 0.92$
- **Associate / Regional Tournaments**: Weight $= 0.72$
- **Emerging Tournaments**: Weight $= 0.65$

### 4.4 Supervised Win-Impact Modeling (Random Forest)
Player-level aggregations in pressure phases were mapped to team match outcomes (`won` $\in \{0, 1\}$). A `RandomForestRegressor(n_estimators=200, max_depth=5, random_state=42)` and `GradientBoostingRegressor(n_estimators=150, max_depth=3)` were trained to learn empirical feature importances:
- **Batting Features**:
  1. `m_val`: Context-adjusted run value relative to over baseline ($35\%$ importance).
  2. `m_sr`: Phase strike rate ($25\%$ importance).
  3. `m_out`: Dismissal resistance ($20\%$ importance).
  4. `m_dot`: Dot ball reduction ($10\%$ importance).
  5. `m_bdry`: Boundary percentage ($10\%$ importance).
- **Bowling Features**:
  1. `m_val`: Context-adjusted runs saved ($35\%$ importance).
  2. `m_wkts`: Wickets taken in pressure overs ($25\%$ importance).
  3. `m_dot`: Dot ball suppression rate ($15\%$ importance).
  4. `m_econ`: Absolute economy rate ($15\%$ importance).
  5. `m_bdry`: Boundary prevention rate ($10\%$ importance).

### 4.5 Empirical Bayes Prior Shrinkage
To prevent small sample-size distortions (e.g., a batter facing 15 pressure balls with an inflated strike rate), all player statistics are shrunken toward the competition-wide prior mean $\mu_{\text{prior}}$:
$$\text{EB}(x) = \frac{n \cdot x + k \cdot \mu_{\text{prior}}}{n + k}$$
- **Shrinkage Constants ($k$)**:
  - Context Run Value: $k = 180\text{ balls}$
  - Balls Per Dismissal: $k = 150\text{ balls}$
  - Strike Rate Delta: $k = 180\text{ balls}$
  - Bowling Runs Saved / 24b: $k = 200\text{ balls}$
  - Top-Tier Batter Dismissal Rate: $k = 200\text{ balls}$
  - Economy Gain: $k = 180\text{ balls}$
  - Innings / Spell Consistency: $k = 12\text{ to }14\text{ matches}$

---

## 5. Player Ranking Methodology & Mathematical Formulations

Standardized Pressure Rating scales raw scores to a standard distribution with **Mean $= 50.0$** and **Standard Deviation $= 15.0$**:
$$\text{Pressure Rating} = 50 + 15 \cdot \left(\frac{\text{Raw} - \mu_{\text{Raw}}}{\sigma_{\text{Raw}}}\right)$$

### 5.1 Batting Pressure Rating Formula
$$\begin{aligned}
\text{Raw}_{\text{bat}} = \; & 0.35 \cdot Z\Big(\text{EB}_{180}(\text{ctx\_val\_100})\Big) \\
+ \; & 0.20 \cdot Z\Big(\text{EB}_{150}(\text{bpd})\Big) \\
- \; & 0.15 \cdot Z\Big(\text{EB}_{150}(\text{dot\_pct})\Big) \\
+ \; & 0.15 \cdot Z\Big(\text{EB}_{180}(\text{sr\_delta})\Big) \\
+ \; & 0.15 \cdot Z\Big(\text{EB}_{12}(\text{pos\_innings\_pct})\Big)
\end{aligned}$$

#### Official Top 10 Batters Under Pressure:
| Rank | Player Name | Team / Franchise | Pressure Rating | Pressure SR | Normal SR | Delta SR | Runs / Balls | Boundary % | Dot % | Balls / Out | Context Val / 100b |
|:---:|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **#1** | **Shashank Singh** | Punjab Kings | **81.2** | 185.7 | 148.9 | +36.8 | 273 / 147 | 23.8% | 23.1% | 21.0 | +19.4 |
| **#2** | **Jos Buttler** | Rajasthan Royals | **79.3** | 180.2 | 143.1 | +37.1 | 483 / 268 | 23.5% | 25.4% | 24.4 | +18.7 |
| **#3** | **Dinesh Karthik** | Royal Challengers Bengaluru | **78.2** | 191.4 | 149.6 | +41.8 | 425 / 222 | 24.3% | 22.1% | 18.5 | +20.1 |
| **#4** | **Suryakumar Yadav** | Mumbai Indians | **77.5** | 188.5 | 158.4 | +30.1 | 488 / 259 | 24.7% | 24.3% | 21.6 | +18.9 |
| **#5** | **Naman Dhir** | Mumbai Indians | **72.6** | 186.7 | 155.2 | +31.5 | 112 / 60 | 25.0% | 26.7% | 15.0 | +16.2 |
| **#6** | **Tim David** | Mumbai Indians | **72.3** | 179.3 | 152.0 | +27.3 | 364 / 203 | 22.7% | 25.6% | 18.5 | +15.8 |
| **#7** | **Tristan Stubbs** | Delhi Capitals | **71.5** | 178.4 | 149.1 | +29.3 | 289 / 162 | 21.6% | 24.1% | 20.3 | +15.1 |
| **#8** | **Nicholas Pooran** | Lucknow Super Giants | **69.9** | 176.2 | 154.5 | +21.7 | 451 / 256 | 23.0% | 26.2% | 17.1 | +14.2 |
| **#9** | **Tilak Varma** | Mumbai Indians | **69.4** | 162.8 | 141.2 | +21.6 | 324 / 199 | 19.6% | 27.1% | 24.9 | +12.8 |
| **#10** | **Shreyas Iyer** | Kolkata Knight Riders | **68.0** | 158.4 | 136.2 | +22.2 | 301 / 190 | 18.9% | 28.4% | 27.1 | +11.9 |

---

### 5.2 Bowling Pressure Rating Formula
$$\begin{aligned}
\text{Raw}_{\text{bowl}} = \; & 0.35 \cdot Z\Big(\text{EB}_{200}(\text{ctx\_rs\_24})\Big) \\
+ \; & 0.25 \cdot Z\Big(\text{EB}_{200}(\text{tier\_wkt\_pct})\Big) \\
+ \; & 0.15 \cdot Z\Big(\text{EB}_{180}(\text{dot\_pct} \cdot \text{avg\_tier})\Big) \\
+ \; & 0.10 \cdot Z\Big(\text{EB}_{180}(\text{econ\_diff})\Big) \\
+ \; & 0.15 \cdot Z\Big(\text{EB}_{14}(\text{pos\_spells\_pct})\Big)
\end{aligned}$$

#### Official Top 10 Bowlers Under Pressure:
| Rank | Player Name | Team / Franchise | Pressure Rating | Pressure Econ | Normal Econ | Econ Gain | Wkts / Legal Balls | Dot % | Top-Tier Wkt % | Runs Saved / 24b |
|:---:|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **#1** | **Sunil Narine** | Kolkata Knight Riders | **95.6** | 6.42 | 6.78 | +0.36 | 28 / 414 | 46.4% | 67.9% | +5.12 |
| **#2** | **Jasprit Bumrah** | Mumbai Indians | **85.6** | 7.12 | 7.45 | +0.33 | 32 / 366 | 45.1% | 62.5% | +4.48 |
| **#3** | **Abrar Ahmed** | Pakistan | **84.0** | 7.24 | 7.82 | +0.58 | 19 / 222 | 43.2% | 57.9% | +4.10 |
| **#4** | **Sufiyan Muqeem** | Pakistan | **81.1** | 6.95 | 7.60 | +0.65 | 16 / 180 | 44.4% | 56.3% | +3.92 |
| **#5** | **Matheesha Pathirana** | Chennai Super Kings | **80.7** | 7.85 | 8.92 | +1.07 | 29 / 288 | 42.7% | 55.2% | +3.75 |
| **#6** | **Kuldeep Yadav** | Delhi Capitals | **77.3** | 7.64 | 8.15 | +0.51 | 24 / 306 | 40.8% | 54.2% | +3.32 |
| **#7** | **Varun Chakravarthy** | Kolkata Knight Riders | **76.7** | 7.78 | 8.24 | +0.46 | 26 / 324 | 41.4% | 50.0% | +3.18 |
| **#8** | **Akeal Hosein** | Sunrisers Hyderabad | **75.4** | 7.35 | 7.90 | +0.55 | 18 / 240 | 42.1% | 50.0% | +2.95 |
| **#9** | **Mohammad Nawaz** | Pakistan | **74.8** | 7.52 | 8.10 | +0.58 | 17 / 234 | 41.0% | 47.1% | +2.82 |
| **#10** | **Mitchell Santner** | Chennai Super Kings | **73.4** | 7.40 | 7.85 | +0.45 | 14 / 210 | 41.9% | 50.0% | +2.64 |

---

## 6. Interactive Cricket Trajectory Visualization

The hero visual features an interactive **Hawkeye Cricket Trajectory Intelligence Engine** (`assets/three_pitch.js`):

```
       [Top Bar: Mode Tabs (Trajectory | Pressure Map | Win Shift)]
                                  │
      [Controls: Delivery Selector | Play/Pause | Replay | 0.5x 1.0x 1.5x]
                                  │
     [SVG 3D Viewport: Perspective Pitch (345px -> 545px) & Trajectory]
                                  │
   [4-Card Telemetry Grid: Context | Speed | Length & Line | Win Shift]
                                  │
   [Data Transparency Notice: Actual Data vs Model Derived vs Simulation]
```

### 6.1 Architectural Highlights
- **SVG Perspective Geometry**: Pitch trapezoid tapering from $110\text{px}$ at the bowler end to $290\text{px}$ at the striker end (`viewBox="0 0 800 400"`), including popping creases, bowling creases, return creases, and LED stumps at both ends.
- **Continuous Ballistic Path**: Continuous parametric quadratic/cubic Bezier curve modeling release, parabolic air flight, ground impact, and post-bounce deviation.
- **Dynamic Elements**:
  - Glowing cricket ball with dual-layer SVG Gaussian blur (`#neon-ball-glow`).
  - Motion trail tracking the trailing segment of flight.
  - Expanding pulse ripple ring (`#bounce-pulse-ring`) triggered at bounce impact.
  - Tracking speed label following the ball in real time.
- **Data-Linked Delivery Selector**: 7 historical high-pressure deliveries extracted directly from `ball_by_ball.csv` (featuring Jasprit Bumrah, Sunil Narine, Matheesha Pathirana, Alzarri Joseph vs Shashank Singh, Yuzvendra Chahal vs Nicholas Pooran, and Arshdeep Singh vs Dinesh Karthik).
- **Three Modes**:
  1. **Trajectory**: Ballistic arc, release point, bounce marker, arrival marker, and speed tag.
  2. **Pressure Map**: Perspective heatmap showing Yorker blockhole ($94.6\text{ Rating}$), Slot risk ($69.4\text{ Rating}$), and Good Length corridor ($89.2\text{ Rating}$) with interactive hover tooltips.
  3. **Win Shift**: Animated progression graphing win probability acceleration across the 6 balls of the over with match leverage scores ($2.85\times$).
- **Balanced 4-Card Telemetry Grid**: Structured CSS Grid with zero horizontal overflow:
  1. `DELIVERY CONTEXT`: Bowler vs Batter, Over, and outcome.
  2. `MEASURED SPEED`: Speed in $\text{km/h}$ tagged with source (`[ACTUAL DATA: ball_by_ball.csv]`).
  3. `PITCH LENGTH & LINE`: Length classification and line corridor.
  4. `WIN PROBABILITY SHIFT`: Pre-ball to post-ball percentage delta.
- **Data Transparency Disclosure**: Explicitly labels actual dataset values from `ball_by_ball.csv`, supervised ML predictions, and illustrative ballistic pitch simulations.

---

## 7. Technology Stack

### Frontend & UI Architecture
- **HTML5 & CSS3**: Custom design tokens, responsive CSS Grid (`minmax(0, 1fr)`), and Flexbox layout.
- **JavaScript (ES6+)**: Modular client-side state management, dynamic CSV parsing, and SVG animation loop.
- **SVG Vector Graphics**: 3D perspective pitch geometry and continuous path animation (`path.getPointAtLength`).
- **HTML5 Canvas**: Tabular performance bar charts and 6-axis player radar polygon.
- **Typography (Google Fonts)**:
  - Headings: `Space Grotesk`
  - Section Titles & Navigation: `Sora`
  - Body Text & Tables: `Inter`
  - Statistical & Tabular Numerals: `JetBrains Mono`
- **React Icons SVG Engine**: 100% SVG vector implementations (`assets/icons.js`) with **zero emojis**.

### Data Science & Machine Learning Pipeline
- **Python 3.10+**
- **Jupyter Notebook (`RR_IPL2027.ipynb`)**
- **Pandas & NumPy**: Delivery-level aggregation, DLS-aware over baselining, and feature normalization.
- **Scikit-learn**:
  - `LogisticRegression`: Ball-by-ball win probability estimation.
  - `RandomForestRegressor(n_estimators=200, max_depth=5)`: Supervised match win-impact weighting.
  - `GradientBoostingRegressor(n_estimators=150, max_depth=3)`
  - `KMeans(n_clusters=3)`: Player pressure archetype discovery.
  - `StandardScaler`, `cross_val_score`, `r2_score`

---

## 8. Dataset Description

The project repository includes the following structured data files:

| File Name | Size | Records | Description | Key Fields |
|:---|:---:|:---:|:---|:---|
| `ball_by_ball.csv` | $39.17\text{ MB}$ | $201,000+$ | Granular ball-by-ball delivery log | `match_id`, `innings`, `overid`, `over_ball_num`, `striker_name`, `bowler_name`, `runs`, `is_wicket`, `bowl_speed`, `delivery_style`, `stroke` |
| `matches.csv` | $0.12\text{ MB}$ | $883$ | Match metadata, toss, venues, and outcomes | `match_id`, `comp_id`, `match_date`, `stage`, `venue_country`, `home_team`, `away_team`, `win_team_id`, `revised_target` |
| `teams.csv` | $0.01\text{ MB}$ | $40+$ | Franchise and international team mapping | `comp_id`, `team_id`, `team_name` |
| `competitions.csv` | $0.01\text{ MB}$ | $15+$ | Tournament identifiers and formats | `comp_id`, `comp_name`, `match_format`, `season` |
| `competition_team_player_mapping.csv` | $0.44\text{ MB}$ | $5,000+$ | Squad roster and tournament affiliations | `comp_name`, `team_name`, `player_id`, `player_name` |
| `playing_eleven.csv` | $0.92\text{ MB}$ | $19,000+$ | Lineup rosters and impact-player substitutions | `match_id`, `team_id`, `player_id`, `batting_order`, `is_impact` |
| `top_10_batters_under_pressure.csv` | $4.9\text{ KB}$ | $10$ | Official top 10 batter pressure rankings | `rank`, `striker_name`, `p_sr`, `n_sr`, `sr_delta`, `p_ctx_val_100`, `pressure_rating` |
| `top_10_bowlers_under_pressure.csv` | $5.2\text{ KB}$ | $10$ | Official top 10 bowler pressure rankings | `rank`, `bowler_name`, `p_econ`, `n_econ`, `econ_diff`, `p_ctx_rs_24`, `pressure_rating` |
| `all_eligible_batters_ranked.csv` | $35.9\text{ KB}$ | $80+$ | Full database of qualified batters | Comprehensive statistical breakdown under pressure |
| `all_eligible_bowlers_ranked.csv` | $56.3\text{ KB}$ | $120+$ | Full database of qualified bowlers | Comprehensive statistical breakdown under pressure |

---

## 9. Repository Structure

```
RR IPL FINAL/
├── index.html                           # Production dashboard application
├── README.md                            # Comprehensive project documentation
├── RR_IPL2027.ipynb                     # Quantitative data processing & ML notebook
├── top_10_batters_under_pressure.csv    # Official ranked batters dataset
├── top_10_bowlers_under_pressure.csv    # Official ranked bowlers dataset
├── all_eligible_batters_ranked.csv      # Complete qualified batters dataset
├── all_eligible_bowlers_ranked.csv      # Complete qualified bowlers dataset
├── ball_by_ball.csv                     # Raw delivery-level log (201,000+ balls)
├── matches.csv                          # Match metadata and target outcomes
├── teams.csv                            # Team master catalogue
├── competitions.csv                     # Tournament master catalogue
├── competition_team_player_mapping.csv  # Player-team-competition mapping
├── playing_eleven.csv                   # Match lineup and substitution data
├── superr_selector_pressure_analysis.png# Model validation visual report
├── favicon.ico                          # Application favicon
└── assets/
    ├── app.js                           # Dashboard controller, search, sort & modal logic
    ├── three_pitch.js                   # SVG 3D trajectory & Hawkeye telemetry engine
    ├── icons.js                         # React Icons SVG vector renderer (Zero Emojis)
    ├── style.css                        # Midnight Pink design system & responsive styling
    ├── data.js                          # Inlined dataset cache for fallback resilience
    ├── players_data.json                # Structured player statistical registry
    ├── rr_logo.jpg                      # Rajasthan Royals emblem asset
    ├── audio.js                         # Broadcast SFX synthesizers
    └── superr_selector_pressure_analysis.png
```

---

## 10. Local Setup & Quickstart Guide

### 10.1 Prerequisites
- A modern web browser (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge).
- Optional: Python 3.8+ to run the local HTTP server or Jupyter Notebook to reproduce the ML pipeline.

### 10.2 Starting the Web Dashboard
Because the dashboard dynamically loads `top_10_batters_under_pressure.csv` and `top_10_bowlers_under_pressure.csv` via asynchronous `fetch()`, run the application via a local HTTP server:

```bash
# 1. Navigate to the project directory
cd "RR IPL FINAL"

# 2. Launch Python's built-in HTTP server on port 8080
python3 -m http.server 8080
```

Open your browser and navigate to:
```
http://localhost:8080/
```

### 10.3 Reproducing the Machine Learning Pipeline
To re-run the quantitative modeling and generate new ranking CSVs:
```bash
# 1. Install required Python packages
pip install pandas numpy scikit-learn jupyter matplotlib

# 2. Open the notebook
jupyter notebook RR_IPL2027.ipynb
```
Execute cells sequentially to regenerate:
- `all_eligible_batters_ranked.csv`
- `all_eligible_bowlers_ranked.csv`
- `top_10_batters_under_pressure.csv`
- `top_10_bowlers_under_pressure.csv`
- `superr_selector_pressure_analysis.png`

---

## 11. Ethical Considerations & Data Transparency Notice

1. **Illusion of Hawk-Eye Telemetry**: Broadcast optical tracking cameras (e.g., Hawk-Eye or Virtual Eye) record proprietary sub-millimeter 3D spatial ball trajectories. Standard cricket scorecards and ball-by-ball datasets do not contain spatial coordinate tracking. In this application, spatial trajectory paths are **mathematically modeled ballistic simulations** calibrated to match the recorded bowler arm, speed, over, and delivery length from `ball_by_ball.csv`.
2. **Attribution**: Match data and player performance metrics belong to their respective rights holders and competition organizers. Statistical metrics and pressure ratings represent analytical evaluations derived from public match scorecards.

---

## 12. License & Author Information

Developed for **Rajasthan Royals SupeRR Selector Season 2**.  
Architecture, quantitative models, and visual design systems licensed under the [MIT License](LICENSE).
