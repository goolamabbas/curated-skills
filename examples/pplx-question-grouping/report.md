# Grouping experiment results

Live responses; label review status: user_reviewed_accepted; independence is not established by a review attestation

Successful requests: 1800/1800. Attempts: 1801. Missing: 0. Failed attempts: 1. Accounted cost: $0.025413520 (including reserves for unknown usage).

Numerical warnings: 34 across 34 responses. Metrics retain provider-reported values; see Numerical consistency below.

## Paired quality comparisons

Each row uses the same labelled tickets with all five successful repeats on both sides. Deltas are right minus left; lower Brier, error rate, and MAE are better. Missing cells remain excluded and visible; complete-case analysis can still be biased by failures.

| Comparison | Question | Paired tickets | Excluded labelled tickets | Left | Right | Delta |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| standard:B-A | lost_data | 24 | 0 | 0.000547 | 0.002508 | 0.001961 |
| standard:B-A | team | 24 | 0 | 0.000000 | 0.000000 | 0.000000 |
| standard:B-A | severity | 24 | 0 | 0.025594 | 0.014361 | -0.011234 |
| standard:C-B | lost_data | 24 | 0 | 0.002508 | 0.004045 | 0.001537 |
| standard:C-B | team | 24 | 0 | 0.000000 | 0.000000 | 0.000000 |
| standard:C-B | severity | 24 | 0 | 0.014361 | 0.009760 | -0.004601 |
| flash:B-A | lost_data | 24 | 0 | 0.025266 | 0.026558 | 0.001293 |
| flash:B-A | team | 24 | 0 | 0.041667 | 0.000000 | -0.041667 |
| flash:B-A | severity | 24 | 0 | 0.039829 | 0.048602 | 0.008773 |
| flash:C-B | lost_data | 24 | 0 | 0.026558 | 0.026073 | -0.000485 |
| flash:C-B | team | 24 | 0 | 0.000000 | 0.041667 | 0.041667 |
| flash:C-B | severity | 24 | 0 | 0.048602 | 0.056789 | 0.008187 |
| jev:B-A | lost_data | 24 | 0 | 0.002596 | 0.002573 | -0.000023 |
| jev:B-A | team | 24 | 0 | 0.000000 | 0.000000 | 0.000000 |
| jev:B-A | severity | 24 | 0 | 0.046667 | 0.044167 | -0.002500 |
| jev:C-B | lost_data | 24 | 0 | 0.002573 | 0.002615 | 0.000043 |
| jev:C-B | team | 24 | 0 | 0.000000 | 0.000000 | 0.000000 |
| jev:C-B | severity | 24 | 0 | 0.044167 | 0.045583 | 0.001417 |

Always routing to Technical Support gives 18/24 correct (75%) on the supplied labels. Paired team rows include that baseline recalculated on their exact subset in summary.json. Cohort-specific paired metrics and ticket IDs are also saved there.

## Observed sensitivity and repeat variation

| Comparison | Paired tickets | Median absolute probability shift | Median within-condition range | Median estimated difference SE | Mean threshold flips |
| --- | ---: | ---: | ---: | ---: | ---: |
| standard:B-A | 24 | 0.000455 | 0.000000 | 0.000000 | 0.000000 |
| standard:C-B | 24 | 0.000081 | 0.000000 | 0.000000 | 0.000000 |
| flash:B-A | 24 | 0.005456 | 0.000000 | 0.000000 | 0.000000 |
| flash:C-B | 24 | 0.000576 | 0.000000 | 0.000000 | 0.000000 |
| jev:B-A | 24 | 0.000000 | 0.000000 | 0.000000 | 0.000000 |
| jev:C-B | 24 | 0.000000 | 0.000000 | 0.000000 | 0.000000 |

A nonzero observed shift is not proof of a grouping effect. The estimated standard error is sqrt(sample variance left / 5 + sample variance right / 5), assuming independent calls. With five repeats it is a descriptive noise scale, not a confidence interval or significance test. Symmetric fixture noise cancels exactly by construction; independent zero-effect noise need not. Mean-threshold flips summarize averages; the application acts on one call.

## Unpaired condition summaries

These rows can use different tickets when requests fail. Do not subtract them to infer quality changes; use the paired table above.

| Model and condition | Brier / tickets | Team error rate / tickets | Severity MAE / tickets |
| --- | --- | --- | --- |
| standard:A | 0.000547 / 24 | 0.000000 / 24 | 0.025594 / 24 |
| standard:B | 0.002508 / 24 | 0.000000 / 24 | 0.014361 / 24 |
| standard:C | 0.004045 / 24 | 0.000000 / 24 | 0.009760 / 24 |
| flash:A | 0.025266 / 24 | 0.041667 / 24 | 0.039829 / 24 |
| flash:B | 0.026558 / 24 | 0.000000 / 24 | 0.048602 / 24 |
| flash:C | 0.026073 / 24 | 0.041667 / 24 | 0.056789 / 24 |
| jev:A | 0.002596 / 24 | 0.000000 / 24 | 0.046667 / 24 |
| jev:B | 0.002573 / 24 | 0.000000 / 24 | 0.044167 / 24 |
| jev:C | 0.002615 / 24 | 0.000000 / 24 | 0.045583 / 24 |

Per-ticket means, ranges, review fractions, cohort, and all five probabilities are in per-ticket.csv. Raw answers, actual response model, and provider confidence remain in results.jsonl. summary.json includes paired cohort metrics, exact denominators, failure accounting, cost, and workflow spans.

This pilot tests one fixed questionnaire, one question order, and one extra callback question on 24 synthetic support tickets. It does not establish general grouping behavior, model ranking, calibration, or confidence-formula equivalence. Jev isolation is documented behavior to investigate, not a deterministic-output guarantee. Cross-model result differences also reflect provider implementation and training.

## Numerical consistency

34 warning(s) across 34 format-valid response(s).

Quality and actions use unchanged provider-reported values, including flagged answers. Derived scores are diagnostics only. No automatic normalization or correction.

Both scores are preserved in score-comparison.csv and response-diagnostics.json. numerical-warnings.json lists every discrepancy. A weighted sum from probabilities that do not sum to one is not a valid expected score; it remains explicitly flagged. Warnings do not establish rounding as the cause.

| Model | Ticket | Condition | Repeat | Question | Warning | Reported | Comparison | Difference |
| --- | --- | --- | ---: | --- | --- | ---: | ---: | ---: |
| jev | T24 | A | 1 | severity | score_probability_mismatch | 1.98 | 1.97 | 0.01 |
| jev | T01 | C | 1 | severity | score_probability_mismatch | 1.99 | 2 | -0.01 |
| jev | T01 | B | 1 | severity | score_probability_mismatch | 1.99 | 2 | -0.01 |
| jev | T06 | B | 1 | severity | score_probability_mismatch | 1.99 | 2 | -0.01 |
| jev | T22 | C | 1 | severity | score_probability_mismatch | 0.67 | 0.66 | 0.01 |
| jev | T08 | B | 2 | severity | score_probability_mismatch | 1.99 | 2 | -0.01 |
| jev | T06 | C | 2 | severity | score_probability_mismatch | 1.99 | 2 | -0.01 |
| jev | T24 | B | 2 | severity | score_probability_mismatch | 1.98 | 1.97 | 0.01 |
| jev | T22 | A | 2 | severity | score_probability_mismatch | 0.61 | 0.6 | 0.01 |
| jev | T07 | C | 2 | severity | score_probability_mismatch | 1.99 | 2 | -0.01 |
| jev | T01 | C | 2 | severity | score_probability_mismatch | 1.99 | 2 | -0.01 |
| jev | T08 | A | 2 | severity | score_probability_mismatch | 1.99 | 2 | -0.01 |
| jev | T10 | B | 2 | severity | score_probability_mismatch | 0.24 | 0.23 | 0.01 |
| jev | T22 | B | 2 | severity | score_probability_mismatch | 0.6 | 0.59 | 0.01 |
| jev | T08 | C | 2 | severity | score_probability_mismatch | 1.99 | 2 | -0.01 |
| jev | T24 | A | 2 | severity | score_probability_mismatch | 1.98 | 1.97 | 0.01 |
| jev | T06 | A | 2 | severity | score_probability_mismatch | 1.99 | 2 | -0.01 |
| jev | T23 | C | 3 | severity | score_probability_mismatch | 1.15 | 1.16 | -0.01 |
| jev | T24 | B | 3 | severity | score_probability_mismatch | 1.98 | 1.97 | 0.01 |
| jev | T24 | C | 3 | severity | score_probability_mismatch | 1.98 | 1.97 | 0.01 |
| jev | T22 | B | 3 | severity | score_probability_mismatch | 0.61 | 0.6 | 0.01 |
| jev | T06 | C | 4 | severity | score_probability_mismatch | 1.99 | 2 | -0.01 |
| jev | T01 | C | 4 | severity | score_probability_mismatch | 1.99 | 2 | -0.01 |
| jev | T24 | C | 4 | severity | score_probability_mismatch | 1.98 | 1.97 | 0.01 |
| jev | T24 | A | 4 | severity | score_probability_mismatch | 1.98 | 1.97 | 0.01 |
| jev | T08 | C | 4 | severity | score_probability_mismatch | 1.99 | 2 | -0.01 |
| jev | T22 | C | 4 | severity | score_probability_mismatch | 0.67 | 0.66 | 0.01 |
| jev | T08 | B | 4 | severity | score_probability_mismatch | 1.99 | 2 | -0.01 |
| jev | T24 | C | 5 | severity | score_probability_mismatch | 1.98 | 1.97 | 0.01 |
| jev | T12 | C | 5 | severity | score_probability_mismatch | 1 | 1.01 | -0.01 |
| jev | T22 | A | 5 | severity | score_probability_mismatch | 0.63 | 0.62 | 0.01 |
| jev | T06 | C | 5 | severity | score_probability_mismatch | 1.99 | 2 | -0.01 |
| jev | T22 | B | 5 | severity | score_probability_mismatch | 0.58 | 0.57 | 0.01 |
| jev | T24 | B | 5 | severity | score_probability_mismatch | 1.98 | 1.97 | 0.01 |
