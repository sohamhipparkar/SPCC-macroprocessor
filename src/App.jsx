import { useState } from "react";

const TABS = [
  { id: "define", label: "Define", icon: "＋", hint: "Create a macro" },
  { id: "expand", label: "Expand", icon: "▶", hint: "Resolve a call" },
  { id: "mdt", label: "MDT", icon: "⊞", hint: "Macro bodies" },
  { id: "mnt", label: "MNT", icon: "≡", hint: "Macro names" },
  { id: "ala", label: "ALA", icon: "⇄", hint: "Argument map" },
];

function Toast({ message, type }) {
  if (!message) return null;

  const styles = {
    success: {
      background: "rgba(16, 185, 129, 0.14)",
      color: "#a7f3d0",
      border: "1px solid rgba(16, 185, 129, 0.28)",
    },
    error: {
      background: "rgba(248, 113, 113, 0.12)",
      color: "#fecaca",
      border: "1px solid rgba(248, 113, 113, 0.28)",
    },
  };

  return (
    <div
      style={{
        ...styles[type],
        marginTop: 14,
        padding: "11px 14px",
        borderRadius: 14,
        fontSize: 13,
        lineHeight: 1.5,
        boxShadow: "0 12px 28px rgba(2, 6, 23, 0.22)",
        backdropFilter: "blur(10px)",
      }}
    >
      {message}
    </div>
  );
}

function EmptyState({ icon, title, text }) {
  return (
    <div
      style={{
        borderRadius: 18,
        border: "1px dashed rgba(148, 163, 184, 0.22)",
        background:
          "linear-gradient(180deg, rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.26))",
        padding: "2.4rem 1rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          margin: "0 auto 12px",
          display: "grid",
          placeItems: "center",
          borderRadius: 18,
          color: "#7dd3fc",
          background: "rgba(14, 165, 233, 0.12)",
          boxShadow: "inset 0 0 0 1px rgba(125, 211, 252, 0.16)",
          fontSize: 26,
        }}
      >
        {icon}
      </div>
      <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>
        {title}
      </div>
      <div
        style={{
          color: "#94a3b8",
          fontSize: 13,
          marginTop: 6,
          lineHeight: 1.6,
        }}
      >
        {text}
      </div>
    </div>
  );
}

function Badge({ children, tone = "blue" }) {
  const colors = {
    blue: { bg: "rgba(56, 189, 248, 0.14)", text: "#bae6fd" },
    teal: { bg: "rgba(45, 212, 191, 0.14)", text: "#99f6e4" },
    amber: { bg: "rgba(251, 191, 36, 0.14)", text: "#fde68a" },
    purple: { bg: "rgba(167, 139, 250, 0.14)", text: "#ddd6fe" },
  };

  const c = colors[tone] || colors.blue;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "4px 10px",
        background: c.bg,
        color: c.text,
        border: "1px solid rgba(255, 255, 255, 0.08)",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.02em",
        fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
      }}
    >
      {children}
    </span>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div
      style={{
        borderRadius: 20,
        border: "1px solid rgba(148, 163, 184, 0.16)",
        background:
          "linear-gradient(180deg, rgba(15, 23, 42, 0.86), rgba(15, 23, 42, 0.64))",
        padding: 16,
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: 12 }}>{label}</div>
      <div
        style={{
          color: "#f8fafc",
          fontSize: 30,
          fontWeight: 800,
          marginTop: 8,
        }}
      >
        {value}
      </div>
      <div style={{ marginTop: 8 }}>
        <Badge tone={tone}>{label}</Badge>
      </div>
    </div>
  );
}

function SectionFrame({ eyebrow, title, description, children }) {
  return (
    <section
      style={{
        borderRadius: 24,
        border: "1px solid rgba(148, 163, 184, 0.16)",
        background:
          "linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.8))",
        padding: 24,
        boxShadow: "0 20px 60px rgba(2, 6, 23, 0.34)",
        backdropFilter: "blur(18px)",
      }}
    >
      <p
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          margin: 0,
          color: "#94a3b8",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: "#7dd3fc" }}>◈</span>
        {eyebrow}
      </p>
      <h2
        style={{
          margin: "10px 0 0",
          fontSize: 28,
          lineHeight: 1.05,
          letterSpacing: "-0.05em",
          color: "#f8fafc",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          margin: "12px 0 0",
          color: "#94a3b8",
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        {description}
      </p>
      <div style={{ marginTop: 18 }}>{children}</div>
    </section>
  );
}

export default function MacroProcessor() {
  const [activeTab, setActiveTab] = useState("define");
  const [mdt, setMdt] = useState({});
  const [mnt, setMnt] = useState([]);
  const [ala, setAla] = useState({});

  const [macroName, setMacroName] = useState("");
  const [macroArg, setMacroArg] = useState("");
  const [macroBody, setMacroBody] = useState("");
  const [defineToast, setDefineToast] = useState(null);

  const [expandName, setExpandName] = useState("");
  const [expandArg, setExpandArg] = useState("");
  const [expandedCode, setExpandedCode] = useState(null);
  const [expandToast, setExpandToast] = useState(null);

  const macroCount = mnt.length;
  const alaCount = Object.keys(ala).length;
  const expandedLines = expandedCode ? expandedCode.split("\n").length : 0;

  function toast(setter, msg, type) {
    setter({ message: msg, type });
    setTimeout(() => setter(null), 3000);
  }

  function defineMacro() {
    const name = macroName.trim().toUpperCase();
    const arg = macroArg.trim();
    const body = macroBody.trim();

    if (!name) return toast(setDefineToast, "Macro name is required.", "error");
    if (!body) return toast(setDefineToast, "Macro body is required.", "error");

    setMdt((prev) => ({ ...prev, [name]: { Argument: arg, Body: body } }));
    setMnt((prev) => (prev.includes(name) ? prev : [...prev, name]));
    toast(setDefineToast, `Macro "${name}" defined successfully.`, "success");
    setMacroName("");
    setMacroArg("");
    setMacroBody("");
  }

  function expandMacro() {
    const name = expandName.trim().toUpperCase();
    const actual = expandArg.trim();
    setExpandedCode(null);

    if (!name) return toast(setExpandToast, "Enter a macro name.", "error");
    if (!(name in mdt)) {
      return toast(
        setExpandToast,
        `Macro "${name}" not found in MDT.`,
        "error",
      );
    }

    const formal = mdt[name].Argument;
    setAla((prev) => ({ ...prev, [formal]: actual }));

    const expanded = formal
      ? mdt[name].Body.replaceAll(formal, actual)
      : mdt[name].Body;
    setExpandedCode(expanded);
    toast(setExpandToast, `"${name}" expanded successfully.`, "success");
  }

  const pageStyles = {
    minHeight: "100vh",
    color: "#e2e8f0",
    background:
      "radial-gradient(circle at top left, rgba(45, 212, 191, 0.2), transparent 30%), radial-gradient(circle at top right, rgba(56, 189, 248, 0.18), transparent 28%), linear-gradient(180deg, #0f172a 0%, #111827 52%, #0b1120 100%)",
    position: "relative",
    overflow: "hidden",
  };

  const shell = {
    position: "relative",
    zIndex: 1,
    maxWidth: 1120,
    margin: "0 auto",
    padding: "32px 20px 40px",
  };

  const inputStyle = {
    width: "100%",
    marginTop: 6,
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "rgba(15, 23, 42, 0.58)",
    color: "#f8fafc",
    fontSize: 13,
    outline: "none",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
  };

  const labelStyle = {
    display: "block",
    marginTop: 14,
    marginBottom: 2,
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  };

  const primaryButton = {
    marginTop: 18,
    padding: "11px 18px",
    border: "none",
    borderRadius: 14,
    cursor: "pointer",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.04em",
    background:
      "linear-gradient(135deg, rgba(56, 189, 248, 0.96), rgba(45, 212, 191, 0.96))",
    boxShadow: "0 12px 30px rgba(14, 165, 233, 0.26)",
  };

  const thStyle = {
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    padding: "8px 12px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.14)",
  };

  const tdStyle = {
    padding: "10px 12px",
    fontSize: 13,
    borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
    verticalAlign: "top",
  };

  return (
    <div
      style={{
        ...pageStyles,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.45), transparent 80%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "-4% auto auto -8%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(251, 191, 36, 0.18) 0%, rgba(251, 191, 36, 0.03) 40%, transparent 70%)",
          filter: "blur(12px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "12% -6% auto auto",
          width: 240,
          height: 240,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(45, 212, 191, 0.18) 0%, rgba(45, 212, 191, 0.04) 44%, transparent 72%)",
          filter: "blur(10px)",
          pointerEvents: "none",
        }}
      />

      <main style={shell}>
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(148, 163, 184, 0.18)",
              background: "rgba(15, 23, 42, 0.55)",
              color: "#cbd5e1",
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: "#7dd3fc", fontSize: 14 }}>◈</span>
            Macro Processor Studio
          </div>

          <h1
            style={{
              margin: "18px 0 0",
              maxWidth: 760,
              color: "#f8fafc",
              fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
              lineHeight: 0.96,
              letterSpacing: "-0.07em",
              fontWeight: 800,
            }}
          >
            Macroprocessor Simulation
          </h1>

          <p
            style={{
              maxWidth: 720,
              margin: "14px 0 0",
              color: "#94a3b8",
              fontSize: 15,
              lineHeight: 1.7,
            }}
          >
            Build a macro, expand it with actual arguments, and inspect the MDT,
            MNT, and ALA tables through a cleaner, more visual interface.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginTop: 20,
            }}
          >
            <StatCard label="Defined macros" value={macroCount} tone="blue" />
            <StatCard label="ALA entries" value={alaCount} tone="teal" />
            <StatCard
              label="Expanded lines"
              value={expandedLines}
              tone="amber"
            />
          </div>
        </div>

        <div
          style={{
            borderRadius: 24,
            border: "1px solid rgba(148, 163, 184, 0.16)",
            background:
              "linear-gradient(180deg, rgba(15, 23, 42, 0.86), rgba(15, 23, 42, 0.74))",
            boxShadow: "0 20px 60px rgba(2, 6, 23, 0.34)",
            backdropFilter: "blur(18px)",
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>
                Explore the macro pipeline
              </div>
              <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
                Switch between creation, expansion, and table views.
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                ["Definition", "purple"],
                ["Expansion", "teal"],
                ["Tables", "blue"],
              ].map(([label, tone]) => (
                <Badge key={label} tone={tone}>
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "nowrap",
              overflowX: "auto",
              marginTop: 14,
              paddingBottom: 2,
            }}
            role="tablist"
            aria-label="Macro views"
          >
            {TABS.map((tab) => {
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  className="macro-tab-button"
                  aria-pressed={active}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: "0 0 auto",
                    padding: "11px 14px",
                    borderRadius: 14,
                    border: active
                      ? "1px solid rgba(125, 211, 252, 0.5)"
                      : "1px solid rgba(148, 163, 184, 0.16)",
                    background: active
                      ? "linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(45, 212, 191, 0.16))"
                      : "rgba(15, 23, 42, 0.55)",
                    color: active ? "#e0f2fe" : "#cbd5e1",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition:
                      "transform 0.18s ease, border-color 0.18s ease, background 0.18s ease",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <span style={{ fontSize: 12 }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span
                    style={{
                      fontSize: 11,
                      color: active ? "#bae6fd" : "#94a3b8",
                    }}
                  >
                    {tab.hint}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 18 }}>
            {activeTab === "define" && (
              <SectionFrame
                eyebrow="Create a macro"
                title="Shape a reusable pattern"
                description="Give the macro a name, wire in one formal argument, and define the body you want expanded later."
              >
                <label style={labelStyle}>Macro Name</label>
                <input
                  style={{ ...inputStyle, textTransform: "uppercase" }}
                  value={macroName}
                  onChange={(e) => setMacroName(e.target.value)}
                  placeholder="e.g. ADD"
                />

                <label style={labelStyle}>Formal Argument</label>
                <input
                  style={inputStyle}
                  value={macroArg}
                  onChange={(e) => setMacroArg(e.target.value)}
                  placeholder="e.g. &X"
                />

                <label style={labelStyle}>Macro Body</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 124, resize: "vertical" }}
                  value={macroBody}
                  onChange={(e) => setMacroBody(e.target.value)}
                  placeholder={"e.g. LOAD &X\nADD &X\nSTORE &X"}
                />

                <button
                  className="macro-primary-button"
                  style={primaryButton}
                  onClick={defineMacro}
                >
                  Define Macro
                </button>
                <Toast {...(defineToast || {})} />
              </SectionFrame>
            )}

            {activeTab === "expand" && (
              <SectionFrame
                eyebrow="Expand a call"
                title="Substitute the actual argument"
                description="Select a macro, provide the actual value, and inspect the final expanded output below."
              >
                <label style={labelStyle}>Macro Name</label>
                <input
                  style={{ ...inputStyle, textTransform: "uppercase" }}
                  value={expandName}
                  onChange={(e) => setExpandName(e.target.value)}
                  placeholder="e.g. ADD"
                />

                <label style={labelStyle}>Actual Argument</label>
                <input
                  style={inputStyle}
                  value={expandArg}
                  onChange={(e) => setExpandArg(e.target.value)}
                  placeholder="e.g. 5"
                />

                <button
                  className="macro-primary-button"
                  style={primaryButton}
                  onClick={expandMacro}
                >
                  Expand Macro
                </button>
                <Toast {...(expandToast || {})} />

                {expandedCode !== null && (
                  <div style={{ marginTop: 18 }}>
                    <p style={labelStyle}>Expanded Output</p>
                    <pre
                      style={{
                        margin: 0,
                        borderRadius: 18,
                        border: "1px solid rgba(125, 211, 252, 0.14)",
                        background:
                          "linear-gradient(180deg, rgba(8, 15, 32, 0.96), rgba(15, 23, 42, 0.92))",
                        color: "#7dd3fc",
                        padding: "16px 18px",
                        fontSize: 13,
                        lineHeight: 1.8,
                        overflowX: "auto",
                        whiteSpace: "pre-wrap",
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Consolas, monospace",
                      }}
                    >
                      {expandedCode}
                    </pre>
                  </div>
                )}
              </SectionFrame>
            )}

            {activeTab === "mdt" && (
              <SectionFrame
                eyebrow="Macro definition table"
                title="All stored macro bodies"
                description="This table shows each macro name with the formal parameter and its source body."
              >
                {Object.keys(mdt).length === 0 ? (
                  <EmptyState
                    icon="⊞"
                    title="MDT is empty"
                    text="Define a macro to populate the macro definition table."
                  />
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["#", "Name", "Argument", "Body"].map((h) => (
                          <th key={h} style={thStyle}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(mdt).map(
                        ([name, { Argument, Body }], index) => (
                          <tr key={name}>
                            <td
                              style={{
                                ...tdStyle,
                                width: 36,
                                color: "#94a3b8",
                              }}
                            >
                              {index + 1}
                            </td>
                            <td style={tdStyle}>
                              <Badge tone="blue">{name}</Badge>
                            </td>
                            <td style={tdStyle}>
                              <span
                                style={{
                                  color: "#cbd5e1",
                                  fontFamily:
                                    "ui-monospace, SFMono-Regular, Consolas, monospace",
                                }}
                              >
                                {Argument || "—"}
                              </span>
                            </td>
                            <td style={tdStyle}>
                              <pre
                                style={{
                                  margin: 0,
                                  whiteSpace: "pre-wrap",
                                  color: "#e2e8f0",
                                  fontSize: 12,
                                  lineHeight: 1.7,
                                  fontFamily:
                                    "ui-monospace, SFMono-Regular, Consolas, monospace",
                                }}
                              >
                                {Body}
                              </pre>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                )}
              </SectionFrame>
            )}

            {activeTab === "mnt" && (
              <SectionFrame
                eyebrow="Macro name table"
                title="The roster of defined macros"
                description="Names are stored in insertion order so you can review the macro catalog at a glance."
              >
                {mnt.length === 0 ? (
                  <EmptyState
                    icon="≡"
                    title="MNT is empty"
                    text="Define a macro to add names to the macro name table."
                  />
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["#", "Macro Name"].map((h) => (
                          <th key={h} style={thStyle}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mnt.map((name, index) => (
                        <tr key={name}>
                          <td
                            style={{ ...tdStyle, width: 36, color: "#94a3b8" }}
                          >
                            {index + 1}
                          </td>
                          <td style={tdStyle}>
                            <Badge tone="teal">{name}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </SectionFrame>
            )}

            {activeTab === "ala" && (
              <SectionFrame
                eyebrow="Argument list array"
                title="Actual values substituted so far"
                description="Every expansion writes the formal-to-actual mapping into the ALA view for inspection."
              >
                {Object.keys(ala).length === 0 ? (
                  <EmptyState
                    icon="⇄"
                    title="ALA is empty"
                    text="Expand a macro to capture formal and actual argument mappings."
                  />
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["Formal Argument", "Actual Argument"].map((h) => (
                          <th key={h} style={thStyle}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(ala).map(([formal, actual]) => (
                        <tr key={formal}>
                          <td style={tdStyle}>
                            <Badge tone="amber">{formal}</Badge>
                          </td>
                          <td style={tdStyle}>
                            <span
                              style={{
                                color: "#e2e8f0",
                                fontFamily:
                                  "ui-monospace, SFMono-Regular, Consolas, monospace",
                              }}
                            >
                              {actual}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </SectionFrame>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
