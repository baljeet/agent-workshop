import { useMemo, useState, type FormEvent, type ReactElement } from "react";
import type { RequirementRecord, SolutionPlan, SourceDocument } from "@app/shared";
import { addDocument, analyzeRequirement, createRequirement } from "../api/client";
import { TagInput } from "../components/TagInput";

type Stage = "intake" | "documents" | "analyze";

const defaultDocumentType: SourceDocument["type"] = "figma";

export const ComposerPage = (): ReactElement => {
  const [stage, setStage] = useState<Stage>("intake");
  const [requirement, setRequirement] = useState<RequirementRecord | null>(null);
  const [plan, setPlan] = useState<SolutionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [goals, setGoals] = useState<string[]>([]);
  const [constraints, setConstraints] = useState<string[]>([]);

  const [docType, setDocType] = useState<SourceDocument["type"]>(defaultDocumentType);
  const [docName, setDocName] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [docContent, setDocContent] = useState("");

  const requirementCreated = useMemo(() => Boolean(requirement), [requirement]);

  const submitRequirement = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setLoading(true);
    setError(null);

    try {
      const created = await createRequirement({
        title: String(formData.get("title") ?? ""),
        summary: String(formData.get("summary") ?? ""),
        targetRepoPath: String(formData.get("repoPath") ?? ""),
        goals,
        constraints
      });
      setRequirement(created);
      setStage("documents");
    } catch (submissionError) {
      setError(messageFromError(submissionError));
    } finally {
      setLoading(false);
    }
  };

  const submitDocument = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!requirement) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updated = await addDocument(requirement.id, {
        type: docType,
        name: docName,
        url: docUrl || undefined,
        content: docContent
      });

      setRequirement(updated);
      setDocName("");
      setDocUrl("");
      setDocContent("");
    } catch (submissionError) {
      setError(messageFromError(submissionError));
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async (): Promise<void> => {
    if (!requirement) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const analyzedPlan = await analyzeRequirement(requirement.id);
      setPlan(analyzedPlan);
      setStage("analyze");
    } catch (submissionError) {
      setError(messageFromError(submissionError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="layout">
      <section className="hero">
        <p className="eyebrow">Sales-to-Engineering Composer</p>
        <h1>Turn Requirements + Figma + Docs into a Delivery Blueprint</h1>
        <p>
          Upload context, index your codebase, and automatically identify what already exists versus what must be
          built for frontend, backend, and APIs.
        </p>
      </section>

      {error ? <div className="panel error">{error}</div> : null}

      <section className="panel">
        <header>
          <h2>1. Requirement Intake</h2>
          <p>Capture the business ask and where your current system lives.</p>
        </header>
        <form className="form" onSubmit={submitRequirement}>
          <label>
            Requirement title
            <input name="title" required minLength={3} placeholder="Cross-sell recommendations in checkout" />
          </label>
          <label>
            Summary
            <textarea
              name="summary"
              required
              minLength={10}
              placeholder="Describe desired user flow and business objective"
            />
          </label>
          <label>
            Target repository path
            <input
              name="repoPath"
              required
              placeholder="/absolute/path/to/your/product-repo"
              defaultValue={requirement?.input.targetRepoPath ?? ""}
            />
          </label>

          <TagInput label="Goals" placeholder="Increase conversion by 15%" onChange={setGoals} />
          <TagInput label="Constraints" placeholder="No schema changes in Q1" onChange={setConstraints} />

          <button disabled={loading} type="submit">
            {loading ? "Creating..." : requirementCreated ? "Recreate Requirement" : "Create Requirement"}
          </button>
        </form>
      </section>

      <section className={`panel ${stage === "documents" || stage === "analyze" ? "active" : "muted"}`}>
        <header>
          <h2>2. Attach Figma and Solution Documents</h2>
          <p>Bring in design links, architecture notes, or discovery docs.</p>
        </header>

        <form className="form" onSubmit={submitDocument}>
          <label>
            Document type
            <select value={docType} onChange={(event) => setDocType(event.target.value as SourceDocument["type"])}>
              <option value="figma">Figma</option>
              <option value="solution_doc">Solution Doc</option>
              <option value="notes">Notes</option>
            </select>
          </label>

          <label>
            Name
            <input value={docName} onChange={(event) => setDocName(event.target.value)} required />
          </label>

          <label>
            URL (optional)
            <input value={docUrl} onChange={(event) => setDocUrl(event.target.value)} placeholder="https://..." />
          </label>

          <label>
            Extracted content or summary
            <textarea
              value={docContent}
              onChange={(event) => setDocContent(event.target.value)}
              required
              placeholder="Paste notes from Figma comments or the solution document"
            />
          </label>

          <button type="submit" disabled={!requirement || loading}>
            {loading ? "Attaching..." : "Attach Document"}
          </button>
        </form>

        <ul className="doc-list">
          {(requirement?.documents ?? []).map((document) => (
            <li key={document.id}>
              <strong>{document.type}</strong> - {document.name}
            </li>
          ))}
        </ul>

        <button className="analyze" type="button" disabled={!requirement || loading} onClick={() => void runAnalysis()}>
          {loading ? "Analyzing..." : "Analyze and Compose Plan"}
        </button>
      </section>

      {plan ? (
        <section className="panel analysis active">
          <header>
            <h2>3. Generated Solution Blueprint</h2>
            <p>Existing building blocks + proposed net-new components and integration sequence.</p>
          </header>

          <div className="grid">
            <article>
              <h3>Existing Building Blocks</h3>
              <ul>
                {plan.existingBlocks.map((block) => (
                  <li key={block.id}>
                    <strong>{block.name}</strong> ({block.kind})
                    <br />
                    <code>{block.path}</code>
                  </li>
                ))}
              </ul>
            </article>

            <article>
              <h3>Net-New Components</h3>
              <ul>
                {plan.newBlocks.map((block) => (
                  <li key={block.id}>
                    <strong>{block.name}</strong> ({block.kind})
                    <p>{block.reason}</p>
                    <code>{block.suggestedLocation}</code>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <article>
            <h3>Integration Steps</h3>
            <ol>
              {plan.integrationSteps.map((step) => (
                <li key={step.id}>
                  <strong>{step.title}</strong>
                  <p>{step.details}</p>
                </li>
              ))}
            </ol>
          </article>

          {plan.uncoveredRisks.length > 0 ? (
            <article>
              <h3>Risks</h3>
              <ul>
                {plan.uncoveredRisks.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </article>
          ) : null}
        </section>
      ) : null}
    </main>
  );
};

const messageFromError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
};
