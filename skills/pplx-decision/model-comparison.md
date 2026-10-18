# How Jev, Standard, and Flash differ

Jev and Perplexity Decisions share a useful pattern: give a model some information and focused questions, then use its structured answers in your application. Their handling of several questions differs, and Perplexity’s Standard (`pplx-decider-v1.2`) and Flash (`pplx-decider-flash-v1.2`) models need different starting assumptions.

## How questions influence each other

Suppose a customer says, “After importing a CSV, my saved contacts disappeared.” Your application asks whether this reports lost data, which team should handle it, and how serious the disruption is.

**Jev is like separate assessors working from the same case file.** Each evaluates its own question against the shared state. Sending the questions together does not make them part of one another’s context. The state itself is still shared: if it contains several documents, those documents are available to each evaluation. This is the question-isolation behavior described in the [TypeSafe introduction](https://docs.typesafe.ai/introduction).

**Perplexity’s v1.2 models are like an assessor who can see the whole questionnaire.** Each question can be influenced by the other questions in the request. Adding a question about severity can therefore change another answer, even when the customer’s message stays the same. Grouping related judgments may help; grouping competing documents or tools can hurt. See the [Perplexity grouping guidance](https://docs.perplexity.ai/docs/decisions/quickstart#grouping-questions-in-one-request).

The assessors are an analogy, and this ticket is illustrative—not a recorded model test.

## Where to start with each model

| Model | A practical starting point |
| --- | --- |
| TypeSafe Jev | Submit questions together when useful; they are evaluated independently against the same state. |
| Perplexity Standard | Test related questions together. Start with separate requests when independently scoring competing candidates. |
| Perplexity Flash | Start with one question per request. Test exceptions such as select-all-that-apply or routing decisions. |

**Flash is a different, smaller model.** It was trained to learn the probability distributions of larger decision models. It is not simply Standard with a faster execution setting, and a question grouping that helps Standard may hurt Flash. The [Flash model card](https://huggingface.co/perplexity-ai/pplx-decider-flash-v1.2) documents this distinction. Evaluate both on examples representative of your application.

## Two other distinctions

Two other distinctions matter:

- **Grouping questions and batching requests are different.** A shared questionnaire lets questions influence one another. Processing several separate requests together for efficiency does not inherently combine their question contexts. The [Standard model card](https://huggingface.co/perplexity-ai/pplx-decider-v1.2) describes its serving implementation; consult the hosted API documentation for API features.
- **Probability and confidence are different signals.** Confidence is not simply the selected answer’s probability. TypeSafe documents how it derives confidence from the probability distribution; Perplexity also distinguishes confidence from the top probability. Test your action thresholds again when changing models, questions, or grouping. See [TypeSafe confidence](https://docs.typesafe.ai/confidence) and [Perplexity answer interpretation](https://docs.perplexity.ai/docs/decisions/quickstart).

## Check your understanding

A useful self-check: if you add a fourth question without changing the state, which models can expose the original three questions to that new context? Both Perplexity v1.2 models can; Jev documents isolated question evaluation. That distinction does not guarantee numerically identical responses across repeated calls.

[Back to the Perplexity Decisions guide](README.md) · [Choose a prompt](README.md#choose-a-starting-point)
