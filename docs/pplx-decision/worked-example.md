# From a customer message to an actionable support decision

A support application needs to decide who should handle a message, whether a person must review it, and how urgently to place it in the queue. This walkthrough shows how to design those judgments with Perplexity Standard, Flash, or TypeSafe/Jev, then use code to control what happens next.

**Illustrative example.** The messages, policy, probabilities, and cutoffs below are invented for teaching. No model calls were made, and the example does not predict which model will perform best.

## Start with the application policy

Our fictional product is a contact manager. Technical Support handles product failures and missing records; Billing handles charges and invoices. A Review queue handles unclear ownership. Possible lost data and insufficient information require human review. An urgency rubric determines queue priority, independently of which team owns the case.

The application may suggest a team or flag a ticket. It does not automatically contact a customer, issue a refund, or confirm that data was actually lost. Those are separate actions with their own evidence and permissions.

## Supply the evidence as state

State is what the model can inspect. Include the customer's words, relevant product facts, and the triage policy. Distinguish reported claims from verified facts. In a real application, retrieval might add account details or incident status; a decision model does not look them up by itself.

| Customer message | What this case teaches |
| --- | --- |
| “Please send the invoice for last month's subscription. Everything is working.” | Clear billing ownership; no reported disruption. |
| “After importing a CSV, my saved contacts disappeared. My team cannot work.” | Technical ownership and an urgent review for possible lost data. The report is not proof that records were deleted. |
| “Something changed after yesterday. Can you fix it?” | Insufficient information: request clarification through a reviewed workflow rather than inventing a cause. |

These are policy examples chosen by the author, not model predictions or a representative evaluation dataset.

## Ask three focused questions

Each judgment has a specific job in the application:

| Question | Type | How the application uses it |
| --- | --- | --- |
| Does this message require human review under the supplied policy? | `noul` | Decide whether a person must inspect the ticket before any automatic route. |
| Which team should own this ticket? | `choice` | Suggest Technical Support, Billing, or Review. |
| What urgency does the reported disruption justify? | `score` | Prioritize the queue using the defined rubric, not the customer's tone alone. |

Define the rubric as **0: routine request, no reported disruption; 1: work is impaired, with no reported lost data or complete blockage; 2: possible lost data or work is blocked**. These are business definitions, not universal meanings of urgency. If evidence is insufficient, the human-review question takes precedence; a numeric urgency answer does not fill in missing facts.

<details>
<summary>Inspect a complete Perplexity Standard request body</summary>

This JSON follows the [documented Perplexity request structure](https://docs.perplexity.ai/docs/decisions/quickstart). It is a prepared example, not an executed request.

```json
{
  "model": "pplx-decider-v1.2",
  "state": {
    "product": "A contact manager",
    "customer_message": "After importing a CSV, my saved contacts disappeared. My team cannot work.",
    "triage_policy": {
      "human_review": "Required for possible lost data, unclear ownership, or insufficient information to triage. A clear routine request with enough information does not require review.",
      "technical": "Product failures, imports, and missing records",
      "billing": "Charges, refunds, and invoices",
      "priority": "Possible lost data or blocked work takes highest priority. Treat the message as a report, not a verified incident."
    }
  },
  "questions": {
    "human_review": {
      "type": "noul",
      "instructions": "Does this message require human review under the supplied triage policy?"
    },
    "team": {
      "type": "choice",
      "instructions": "Which team should own this ticket under the supplied policy? Choose review if ownership is unclear.",
      "criteria": {
        "technical": "Product failures, imports, or missing records",
        "billing": "Charges, refunds, or invoices",
        "review": "Ownership is unclear, outside these categories, or needs clarification"
      }
    },
    "urgency": {
      "type": "score",
      "instructions": "What urgency does the reported disruption justify under the supplied policy?",
      "criteria": [
        "Routine request, no reported disruption",
        "Work is impaired, with no reported lost data or complete blockage",
        "Possible lost data or work is blocked"
      ]
    }
  }
}
```

</details>

## Choose the request layout

Keep the same policy and evidence available to every question. The starting layouts differ:

| Option | Layout for this example | Why |
| --- | --- | --- |
| **Standard** | One request with state and all three related questions, within one processing group. | The questions describe facets of one triage decision. They can influence one another, so evaluate this combined design. |
| **Hosted Flash** | Three requests, each with the same state and one question. | Each question is evaluated separately. Combining them in a single request still repeats and bills state per question. |
| **Jev** | One TypeSafe request with text state and three focused questions. | Questions are evaluated independently against the shared state. Combine their answers in application code. |

For Flash, construct each body from the Standard example by setting `model` to `pplx-decider-flash-v1.2` and retaining exactly one entry in `questions`. Keep the full relevant state in each request.

For Jev, use the [TypeSafe API and SDK documentation](https://docs.typesafe.ai/introduction/quickstart), its endpoint, credentials, and selected model. Carry over the policy and question intent; validate the request builder and answer consumer against that provider's schema. Switching providers requires more than changing a Perplexity model name. TypeSafe's [model page](https://docs.typesafe.ai/models) lists version IDs and alias targets.

If a later question actually needs an earlier answer, use a separate stage: receive the answer, then explicitly put relevant information in the next request's state. Questions sent together should not be treated as a sequential program.

These layouts follow [Perplexity's hosted guidance](https://docs.perplexity.ai/docs/decisions/quickstart#grouping-questions-in-one-request) and the [TypeSafe introduction](https://docs.typesafe.ai/introduction), checked on **20 October 2026**. No comparative performance is implied.

## Turn answers into application behavior

Suppose a simulated answer for the missing-contacts message contains:

| Signal | Invented value | Interpretation |
| --- | --- | --- |
| Human review (`noul`) | 0.90 | A high model-assigned probability that the review policy applies. |
| Team probabilities | Technical 0.90; Billing 0.02; Review 0.08 | Technical has the largest probability among the supplied options. |
| Urgency probabilities | Level 0: 0.05; level 1: 0.15; level 2: 0.80 | Most probability is on possible lost data or blocked work. |
| Expected urgency score | 1.75 | `0 × 0.05 + 1 × 0.15 + 2 × 0.80`; an average over the rubric, not a confidence value. |

This is one synthetic fixture for explaining application logic, **not an output attributed to Standard, Flash, or Jev**. Different models may produce different answers to the same case.

A demonstration policy might work as follows. All cutoffs are unvalidated:

1. If a required answer is unavailable or malformed, put the ticket in Review; do not treat a failure as a negative answer.
2. If human-review probability is **0.20 or higher**, or the selected team is Review, require a person. The deliberately low cutoff prioritizes catching cases that need review; it may create too much review work.
3. Otherwise, allow an automatic team route only when its top probability is **at least 0.85**. Send other cases to Review.
4. If level-2 urgency probability is **at least 0.50**, mark it high priority within its queue. Otherwise use the expected urgency score as a queue-ordering hint.

With the invented values above, code sends the ticket for **high-priority human review**, showing **Technical Support as the suggested owner**. The 0.90 team probability does not bypass the separate review requirement. A person still investigates what happened to the contacts.

Probability, confidence, and urgency are different. A `noul` value near 0.5 means uncertainty about the yes/no judgment. A middle urgency score can mean moderate disruption or uncertainty between extremes. Confidence summarizes the probability distribution, using provider-specific calculations; see the [comparison](model-comparison.md#interpreting-the-answers).

## Evaluate the workflow

The three messages teach the design; they cannot validate it. Before relying on automatic routing:

- Assemble representative messages with decisions labelled under your actual policy. Include ambiguous ownership, routine requests, urgent cases, and missing context. Resolve label disagreements before evaluating predictions.
- Use development cases to refine state, questions, and cutoffs. Freeze each candidate workflow, then assess it on held-out messages. Compare with your existing workflow and simpler rules.
- Measure missed review cases, wrong automatic routes, the fraction sent to humans, urgent cases assigned low priority, end-to-end latency, and total workflow cost. Report consequential error categories separately from an overall average.
- Evaluate Standard's related-question layout, Flash's separate questions, and Jev's independent questions on the same held-out messages. Tune each workflow to common quality and review-capacity requirements; identical numerical thresholds are not a fair comparison by themselves.
- Repeat cases near thresholds to check action stability. Investigate question changes or grouping when a specific failure calls for it. Keep repeats distinct from additional independent examples.

Measure actual billed usage, including repeated state and retries, before choosing on cost. A cheaper token rate does not establish a cheaper useful workflow. State the sample size and remaining uncertainty; do not claim rare errors have been ruled out from a small sample.

## Build a small version

Start with a screen that accepts a message, displays suggested ownership and urgency, and explains the application's review status. Use simulated responses to test the action rules and error paths first. Then evaluate live model quality within an agreed dataset and spending limit.

[Use the filled-in build prompt](guide.md#a-filled-in-example) or [plan an evaluation](guide.md#evaluate-an-existing-workflow). The Perplexity skill supports the Perplexity implementation; the Jev walkthrough explains the comparison and links to TypeSafe's own integration documentation.

[Back to the guide](guide.md) · [Compare the models](model-comparison.md)
