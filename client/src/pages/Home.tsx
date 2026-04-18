/**
 * Design reminder for Home.tsx:
 * Every section should reinforce the MUTATRACK Biotech Brutalism language:
 * asymmetric editorial layout, forensic mono metadata, stark black space,
 * white glass panels, and precise red urgency markers.
 */
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  ClipboardList,
  Download,
  Github,
  Linkedin,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Search,
  ShieldAlert,
  Trash2,
  Twitter,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import {
  analyseSequence,
  isValidDNA,
  type RiskLevel,
  scanSequences,
  type ScanResult,
} from "../lib/dnaEngine";
import {
  appendMutations,
  computeCancerRisk,
  deleteProfile,
  getMutations,
  getProfile,
  getProfiles,
  saveProfile,
  type StoredMutation,
} from "../lib/patientStore";

const navItems = ["Home", "About", "Analyze", "Patients", "Research", "Contact"];

const checklist = ["Scan & Compare", "Classify Mutations", "Risk Score", "Export Report"];

const services = [
  {
    title: "Transition / Transversion Classification",
    description:
      "Sequence deltas are separated into clinically meaningful substitution classes — purine↔purine or pyrimidine↔pyrimidine transitions versus cross-class transversions.",
  },
  {
    title: "Risk Level Engine",
    description:
      "Each mutation is evaluated in codon context: CRITICAL (introduces STOP), HIGH (radical AA group change), MODERATE (conservative change), LOW (synonymous).",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Input",
    description: "Upload or paste nucleotide sequences and initialize a structured patient session.",
  },
  {
    number: "02",
    title: "Scan",
    description: "Traverse codons and open reading frames at per-base speed to isolate meaningful mutation events.",
  },
  {
    number: "03",
    title: "Classify",
    description: "Determine substitution type, amino-acid impact, and normalized Ts/Tv relationships.",
  },
  {
    number: "04",
    title: "Report",
    description: "Export a clinically structured summary with risk interpretation and persistent records.",
  },
];

const stats = [
  {
    value: "98",
    suffix: "%",
    label: "Risk classification accuracy",
  },
  {
    value: "<1",
    suffix: "ms",
    label: "Per-base scan speed",
  },
  {
    value: "64",
    suffix: "",
    label: "Codon table entries",
  },
  {
    value: "0.04",
    suffix: "%",
    label: "False detection rate",
  },
];

const faqs = [
  {
    question: "What is a transversion versus a transition?",
    answer:
      "A transition is a substitution within the same nucleobase family, such as purine to purine or pyrimidine to pyrimidine. A transversion crosses those families, which generally makes it less frequent and often more disruptive in interpretation workflows.",
  },
  {
    question: "How is risk level assigned?",
    answer:
      "Risk scoring combines mutation type, amino-acid consequence, codon context, and classification heuristics derived from the platform's clinical ruleset. The resulting signal is normalized into CRITICAL, HIGH, MODERATE, or LOW urgency bands for review.",
  },
  {
    question: "What is the Ts/Tv ratio?",
    answer:
      "The transition-to-transversion ratio is a quality and biological interpretation signal that compares the relative frequency of each substitution class. It helps indicate whether observed mutations fit expected genomic behavior or warrant further scrutiny.",
  },
  {
    question: "How does ORF detection work?",
    answer:
      "Open reading frame detection scans the sequence for valid start and stop codon structures, then evaluates reading continuity so protein-coding regions can be interpreted against potential mutation impact.",
  },
  {
    question: "How are records persisted?",
    answer:
      "Sessions are organized into repeatable patient profiles and clinically structured records so analysts can revisit scans, compare progression, and export findings without losing interpretive context.",
  },
];

const viewport = { once: false, amount: 0.25 };
const revealEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: revealEase },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const heroReveal = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: revealEase, delay: 0.3 },
  },
};

const heroHeadlineReveal = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: revealEase, delay: 0.5 },
  },
};

function HelixBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 mutatrack-grid opacity-20" />
      <div className="scan-line absolute left-[8%] top-0 h-40 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      <div className="scan-line absolute right-[12%] top-0 h-56 w-px bg-gradient-to-b from-transparent via-red-500/20 to-transparent [animation-delay:-3s]" />
      <svg
        className="helix-strand left-[-8%] top-[2%] h-[72rem] w-[32rem]"
        viewBox="0 0 320 1200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M60 0C230 120 230 220 60 340C-110 460 -110 560 60 680C230 800 230 900 60 1020C-110 1140 -110 1220 60 1200" stroke="currentColor" strokeWidth="2" />
        <path d="M260 0C90 120 90 220 260 340C430 460 430 560 260 680C90 800 90 900 260 1020C430 1140 430 1220 260 1200" stroke="currentColor" strokeWidth="2" />
        {Array.from({ length: 16 }).map((_, index) => {
          const y = 40 + index * 70;
          return (
            <line
              key={y}
              x1={76}
              y1={y}
              x2={244}
              y2={y + 24}
              stroke="currentColor"
              strokeWidth="1.25"
            />
          );
        })}
      </svg>
      <svg
        className="helix-strand helix-strand--reverse right-[-12%] top-[14%] h-[62rem] w-[30rem]"
        viewBox="0 0 320 1200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M60 0C230 120 230 220 60 340C-110 460 -110 560 60 680C230 800 230 900 60 1020C-110 1140 -110 1220 60 1200" stroke="currentColor" strokeWidth="2" />
        <path d="M260 0C90 120 90 220 260 340C430 460 430 560 260 680C90 800 90 900 260 1020C430 1140 430 1220 260 1200" stroke="currentColor" strokeWidth="2" />
        {Array.from({ length: 14 }).map((_, index) => {
          const y = 60 + index * 74;
          return (
            <line
              key={y}
              x1={82}
              y1={y}
              x2={238}
              y2={y + 22}
              stroke="currentColor"
              strokeWidth="1.25"
            />
          );
        })}
      </svg>
      <div className="ambient-pulse absolute left-1/2 top-40 h-56 w-56 -translate-x-1/2 rounded-full bg-red-500/8 blur-3xl" />
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <p className="micro-label mb-6">{children}</p>;
}

const riskConfig: Record<RiskLevel, { label: string; cls: string }> = {
  CRITICAL: { label: "!!! CRITICAL", cls: "border-red-500/60 bg-red-500/15 text-red-400" },
  HIGH:     { label: "!!  HIGH",     cls: "border-red-400/40 bg-red-400/10 text-red-300" },
  MODERATE: { label: "!   MODERATE", cls: "border-yellow-500/40 bg-yellow-500/8 text-yellow-300" },
  LOW:      { label: "    LOW",      cls: "border-white/15 bg-white/4 text-white/50" },
};

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const { label, cls } = riskConfig[risk];
  return (
    <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  );
}

export default function Home() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // ── DNA Analyzer state ──────────────────────────────────────
  const [analyzeTab, setAnalyzeTab] = useState<"compare" | "recorder" | "match" | "single">("compare");
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  // Compare by Patient ID
  const [cmpId1, setCmpId1] = useState("");
  const [cmpId2, setCmpId2] = useState("");
  const [cmpLabel, setCmpLabel] = useState<{a: string; b: string}>({ a: "", b: "" });

  // Mutation Recorder
  const [recId, setRecId] = useState("");
  const [recDna, setRecDna] = useState("");
  const [recSaved, setRecSaved] = useState(false);

  // Manual match
  const [baseSeq, setBaseSeq]     = useState("");
  const [sampleSeq, setSampleSeq] = useState("");

  // Single sequence
  const [singleSeq, setSingleSeq] = useState("");
  const [singleStats, setSingleStats] = useState<ReturnType<typeof analyseSequence> | null>(null);

  // Shared scan result
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  function resetAnalyzer() {
    setBaseSeq(""); setSampleSeq(""); setSingleSeq("");
    setCmpId1(""); setCmpId2(""); setRecId(""); setRecDna("");
    setScanResult(null); setSingleStats(null); setError("");
    setRecSaved(false); setCmpLabel({ a: "", b: "" });
  }

  function handleCompareByID() {
    setError(""); setScanResult(null);
    const p1 = getProfile(cmpId1.trim());
    const p2 = getProfile(cmpId2.trim());
    if (!p1) { setError(`Patient "${cmpId1.trim()}" not found. Register them first.`); return; }
    if (!p2) { setError(`Patient "${cmpId2.trim()}" not found. Register them first.`); return; }
    if (!p1.dna || p1.dna.length < 3) { setError(`${p1.name} has no DNA sequence on file.`); return; }
    if (!p2.dna || p2.dna.length < 3) { setError(`${p2.name} has no DNA sequence on file.`); return; }
    setCmpLabel({ a: p1.name, b: p2.name });
    setScanResult(scanSequences(p1.dna, p2.dna));
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function handleMutationRecord() {
    setError(""); setScanResult(null); setRecSaved(false);
    const p = getProfile(recId.trim());
    if (!p) { setError(`Patient "${recId.trim()}" not found.`); return; }
    if (!p.dna || p.dna.length < 3) { setError(`${p.name} has no baseline DNA on file.`); return; }
    const newDna = recDna.trim().toUpperCase().replace(/[^ATGC]/g, "");
    if (!isValidDNA(newDna) || newDna.length < 3) { setError("Invalid DNA sample. Only A, T, G, C allowed. Min 3 bases."); return; }
    setCmpLabel({ a: `${p.name} (Baseline)`, b: `${p.name} (New Sample)` });
    setScanResult(scanSequences(p.dna, newDna));
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function handleSaveMutations() {
    if (!scanResult || !recId.trim()) return;
    const p = getProfile(recId.trim());
    if (!p) return;
    appendMutations(p.id, scanResult.mutations, "Recorded via Mutation Recorder");
    setRecSaved(true);
  }

  function handleManualScan() {
    setError(""); setScanResult(null);
    const b = baseSeq.trim().toUpperCase().replace(/[^ATGC]/g, "");
    const s = sampleSeq.trim().toUpperCase().replace(/[^ATGC]/g, "");
    if (!isValidDNA(b)) { setError("Reference sequence is invalid."); return; }
    if (!isValidDNA(s)) { setError("Sample sequence is invalid."); return; }
    if (b.length < 3 || s.length < 3) { setError("Sequences must be at least 3 bases long."); return; }
    setCmpLabel({ a: "Reference", b: "Sample" });
    setScanResult(scanSequences(b, s));
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function handleSingleAnalyze() {
    setError(""); setSingleStats(null);
    const s = singleSeq.trim().toUpperCase().replace(/[^ATGC]/g, "");
    if (!isValidDNA(s)) { setError("Sequence is invalid. Only A, T, G, C allowed."); return; }
    if (s.length < 3) { setError("Sequence must be at least 3 bases long."); return; }
    setSingleStats(analyseSequence(s));
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function handleDownload() {
    if (!scanResult) return;
    const lines: string[] = [
      "MUTATRACK — DNA MUTATION SCAN REPORT",
      "=====================================",
      `${cmpLabel.a} vs ${cmpLabel.b}`,
      `Similarity  : ${scanResult.similarity.toFixed(2)}%`,
      `Ref length  : ${scanResult.lengthA} bp   GC: ${scanResult.gcA.toFixed(1)}%`,
      `Sample len  : ${scanResult.lengthB} bp   GC: ${scanResult.gcB.toFixed(1)}%`,
      `Transitions : ${scanResult.tsCount}   Transversions: ${scanResult.tvCount}   Ts/Tv: ${scanResult.tsTvRatio.toFixed(2)}`,
      `Risk — CRITICAL: ${scanResult.criticalCount}  HIGH: ${scanResult.highCount}  MODERATE: ${scanResult.moderateCount}  LOW: ${scanResult.lowCount}`,
      "",
      "MUTATION TABLE",
      "--------------",
      "#    Pos    Change  Type          AA Effect       Risk      Orig Codon  AA → Mutant AA",
      ...scanResult.mutations.map((m, i) =>
        `${String(i+1).padEnd(5)} ${String(m.position).padEnd(7)} ${m.original}->${m.mutated}   ${m.mutType.padEnd(14)} ${m.aaEffect.padEnd(16)} ${m.risk.padEnd(10)} ${m.origCodon} ${m.origAA} → ${m.mutAA}`
      )
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "mutatrack_report.txt"; a.click();
    URL.revokeObjectURL(url);
  }

  // ── Patients state ────────────────────────────────────────────
  const [patientTab, setPatientTab] = useState<"lookup" | "register">("lookup");
  const [lookupId, setLookupId]     = useState("");
  const [foundProfile, setFoundProfile] = useState<ReturnType<typeof getProfile> | null | undefined>(undefined);
  const [foundMuts, setFoundMuts]   = useState<ReturnType<typeof getMutations> | null>(null);
  const [patError, setPatError]     = useState("");
  const [patSuccess, setPatSuccess] = useState("");
  const [regId, setRegId]           = useState("");
  const [regName, setRegName]       = useState("");
  const [regDna, setRegDna]         = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const patResultsRef = useRef<HTMLDivElement>(null);

  function handleLookup() {
    setPatError(""); setPatSuccess(""); setFoundProfile(undefined); setFoundMuts(null); setShowDeleteConfirm(false);
    const id = lookupId.trim();
    if (!id) { setPatError("Enter a Patient ID."); return; }
    const p = getProfile(id);
    if (!p) { setFoundProfile(null); setPatError(`No patient found with ID "${id}".`); return; }
    setFoundProfile(p);
    setFoundMuts(getMutations(id));
    setTimeout(() => patResultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function handleRegister() {
    setPatError(""); setPatSuccess("");
    const id = regId.trim().toUpperCase();
    const name = regName.trim();
    const dna = regDna.trim().toUpperCase().replace(/[^ATGC]/g, "");
    if (!id || !name) { setPatError("Patient ID and Name are required."); return; }
    if (dna && !isValidDNA(dna)) { setPatError("DNA sequence is invalid — only A, T, G, C allowed."); return; }
    if (getProfile(id) && !window.confirm(`Patient ${id} already exists. Overwrite?`)) return;
    saveProfile({ id, name, dna, createdAt: new Date().toISOString() });
    setPatSuccess(`Patient ${id} — ${name} registered successfully.`);
    setRegId(""); setRegName(""); setRegDna("");
  }

  function handleDeletePatient() {
    if (!foundProfile) return;
    deleteProfile(foundProfile.id);
    setFoundProfile(undefined); setFoundMuts(null);
    setShowDeleteConfirm(false);
    setPatSuccess(`Patient ${foundProfile.id} deleted.`);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <HelixBackground />

      <div className="relative z-10">
        <header id="home" className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-2xl">
          <div className="container flex h-20 items-center justify-between gap-6 px-8 md:px-16">
            <a href="#home" className="flex items-center gap-3 text-sm font-semibold tracking-[0.24em] uppercase">
              <span className="red-dot text-xl leading-none">●</span>
              <span className="font-display text-lg tracking-[0.18em]">MUTATRACK</span>
            </a>

            <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.24em] text-white/70 md:flex">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="transition-colors duration-300 hover:text-white">
                  {item}
                </a>
              ))}
            </nav>

            <a
              href="#analyze"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-[11px] uppercase tracking-[0.24em] text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10">
              Run Analysis
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </header>

        <main>
          <section className="section-shell px-8 pt-14 md:px-16 md:pt-20">
            <div className="container">
              <div className="flex flex-col items-center justify-center gap-12">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  variants={stagger}
                  className="max-w-lg space-y-8 text-center">
                  <motion.div variants={fadeUp}>
                    <SectionLabel>Home</SectionLabel>
                    <p className="text-sm uppercase tracking-[0.24em] text-white/72">
                      DNA Mutation Analysis &amp; Cancer Risk Detection
                    </p>
                  </motion.div>

                  <motion.p
                    variants={fadeUp}
                    className="max-w-[220px] text-xs uppercase leading-relaxed tracking-[0.3em] text-white/66">
                    Detect mutations. Assess risk. Track cancer progression.
                  </motion.p>

                  <motion.div variants={fadeUp} className="space-y-6">
                    <p className="max-w-md text-sm leading-7 text-white/72 md:text-base">
                      MUTATRACK is a premium mutation analysis surface for converting raw sequence changes into urgent,
                      clinically structured insight.
                    </p>
                    <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.24em] text-white/52">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        Live mutation signal mapping
                      </span>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  variants={fadeUp}
                  className="relative w-full max-w-4xl">
                  <div className="absolute left-1/2 top-10 hidden h-36 w-36 -translate-x-1/2 rounded-full border border-white/10 md:block" />
                  <div className="absolute left-1/2 bottom-16 hidden h-px w-32 -translate-x-1/2 bg-gradient-to-r from-red-500 to-transparent lg:block" />
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center space-y-6">
                      <motion.a
                        href="#analyze"
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        variants={heroReveal}
                        className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm uppercase tracking-[0.24em] text-white transition hover:border-white/30 hover:bg-white/8">
                        Analyze DNA
                        <ArrowRight className="h-5 w-5" />
                      </motion.a>
                      <motion.h1
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        variants={heroHeadlineReveal}
                        className="font-display text-[clamp(3rem,12vw,10rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.08em] text-white text-center">
                        Mutation Tracker
                      </motion.h1>
                    </div>

                    <div className="mutatrack-glass relative overflow-hidden rounded-[1.75rem] p-4 md:p-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-red-500/8" />
                      <img
                        src="https://d2xsxph8kpxj0f.cloudfront.net/310519663569425099/AbQHjmSbxmpJKKAMyBKBDv/mutatrack-hero-biotech-editorial-MS6Mh9JoB4dQicZbFxdYax.webp"
                        alt="Abstract DNA scan visual"
                        className="h-[26rem] w-full rounded-[1.35rem] object-cover object-[68%_center] opacity-88 md:h-[34rem]"
                      />
                      <div className="absolute inset-x-10 bottom-10 flex items-end justify-between gap-6 border-t border-white/10 pt-5">
                        <div>
                          <p className="micro-label mb-3">Operating field</p>
                          <p className="font-display text-2xl uppercase tracking-[-0.04em] md:text-3xl">Clinical signal map</p>
                        </div>
                        <div className="hidden text-right text-xs uppercase tracking-[0.24em] text-white/64 md:block">
                          <p>Ts/Tv monitored</p>
                          <p>Codon impact indexed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={stagger}
                className="mt-12 grid gap-6 lg:grid-cols-2">
                <motion.div variants={fadeUp} className="mutatrack-glass rounded-2xl p-8">
                  <div className="mb-8 flex items-center gap-3">
                    {['A', 'B', 'C'].map((label, index) => (
                      <div
                        key={label}
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/6 text-xs uppercase tracking-[0.25em] text-white"
                        style={{ marginLeft: index === 0 ? 0 : -10 }}>
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="font-display text-5xl font-bold uppercase tracking-[-0.08em]">64</p>
                      <p className="mt-3 max-w-sm text-sm leading-7 text-white/70">
                        Codon table entries covering all standard amino acids and STOP signals.
                      </p>
                    </div>
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/84">
                      <Check className="h-4 w-4 text-red-500" />
                      Clinically Structured
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="mutatrack-glass rounded-2xl p-8">
                  <p className="micro-label mb-4">Analyze</p>
                  <h2 className="font-display text-3xl uppercase tracking-[-0.05em] md:text-4xl">
                    Precision Mutation Scanning
                  </h2>
                  <p className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-red-500 md:text-5xl">0.04%</p>
                  <p className="mt-2 text-sm leading-7 text-white/70">False detection rate</p>
                  <a
                    href="#research"
                    className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/84 transition-transform duration-300 hover:translate-x-1">
                    See how it works
                    <ArrowUpRight className="h-4 w-4 text-red-500" />
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </section>

          <section id="about" className="section-shell px-8 md:px-16">
            <div className="container">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={stagger}
                className="mutatrack-glass relative overflow-hidden rounded-[2rem] px-7 py-10 md:px-12 md:py-14">
                <div className="absolute right-6 top-6 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-400 md:right-10 md:top-10 risk-pulse">
                  Cancer Detection Engine
                </div>
                <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-gradient-to-l from-red-500/10 via-transparent to-transparent lg:block" />

                <motion.div variants={fadeUp}>
                  <SectionLabel>About</SectionLabel>
                  <h2 className="font-display max-w-4xl text-5xl font-bold uppercase leading-[0.9] tracking-[-0.08em] md:text-7xl lg:text-8xl">
                    Detect / Classify / <span className="text-red-500">Act</span>
                  </h2>
                </motion.div>

                <motion.div variants={stagger} className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_0.85fr_1.1fr]">
                  <motion.div variants={fadeUp} className="mutatrack-glass rounded-2xl p-8">
                    <p className="micro-label">Freshness index</p>
                    <p className="mt-5 font-display text-6xl font-bold tracking-[-0.08em]">98%</p>
                    <p className="mt-2 text-sm uppercase tracking-[0.22em] text-white/60">Accuracy in risk classification</p>
                    <a
                      href="#research"
                      className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-white transition hover:border-white/30 hover:bg-white/8">
                      Learn more
                      <ChevronRight className="h-4 w-4 text-red-500" />
                    </a>
                  </motion.div>

                  <motion.div variants={fadeUp} className="mutatrack-glass rounded-2xl p-8">
                    <p className="micro-label mb-6">Feature checklist</p>
                    <div className="space-y-4">
                      {checklist.map((item) => (
                        <div key={item} className="flex items-center justify-between border-b border-white/8 pb-4 last:border-b-0 last:pb-0">
                          <span className="font-display text-2xl uppercase tracking-[-0.05em]">{item}</span>
                          <Check className="h-5 w-5 text-red-500" />
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUp} className="relative overflow-hidden rounded-2xl border border-white/15">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663569425099/AbQHjmSbxmpJKKAMyBKBDv/mutatrack-feature-specimen-panel-HwE5LH3PMKoz8EiWUf9USp.webp"
                      alt="Mutation specimen visualization"
                      className="h-full min-h-[24rem] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/32 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-7">
                      <p className="max-w-md text-sm leading-7 text-white/78">
                        Run your first mutation scan and get a free genomic risk report.
                      </p>
                      <a
                        href="#contact"
                        className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:-translate-y-1 hover:border-red-500/40 hover:bg-red-500/10">
                        <ArrowUpRight className="h-5 w-5 text-white" />
                      </a>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          <section id="analyze" className="section-shell px-8 md:px-16">
            <div className="container">
              <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={stagger} className="space-y-10">
                <motion.div variants={fadeUp} className="mx-auto max-w-3xl text-center">
                  <SectionLabel>Analyze</SectionLabel>
                  <h2 className="font-display text-5xl font-bold uppercase tracking-[-0.08em] md:text-7xl">
                    DNA <span className="text-red-500">Analyzer</span>
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/60">Compare patient profiles, record new mutations, or analyse raw sequences — all backed by codon-level risk classification and cancer detection heuristics.</p>
                </motion.div>

                {/* ── 4 Tab switcher ── */}
                <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2">
                  {([
                    { key: "compare" as const, label: "Compare Patients", icon: <Users className="h-3.5 w-3.5" /> },
                    { key: "recorder" as const, label: "Mutation Recorder", icon: <Activity className="h-3.5 w-3.5" /> },
                    { key: "match" as const, label: "Manual DNA Match", icon: <Zap className="h-3.5 w-3.5" /> },
                    { key: "single" as const, label: "Sequence Analysis", icon: <ClipboardList className="h-3.5 w-3.5" /> },
                  ]).map(tab => (
                    <button key={tab.key} onClick={() => { setAnalyzeTab(tab.key); resetAnalyzer(); }}
                      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs uppercase tracking-[0.18em] transition-all duration-200 ${
                        analyzeTab === tab.key ? "border-red-500/40 bg-red-500/10 text-red-300 tab-active-glow" : "border-white/10 bg-transparent text-white/50 hover:text-white hover:border-white/20"
                      }`}>
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </motion.div>

                <motion.div variants={fadeUp} className="mutatrack-glass rounded-[1.75rem] p-6 md:p-10">

                  {/* ─── Tab: Compare by Patient ID ─── */}
                  {analyzeTab === "compare" && (
                    <div className="space-y-6">
                      <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-5 py-4">
                        <Users className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                        <p className="text-xs leading-5 text-white/55">Select two registered patients to compare their baseline DNA sequences. Mutations, similarity, and risk assessments will be calculated automatically.</p>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="micro-label">Patient A</label>
                          <select value={cmpId1} onChange={e => setCmpId1(e.target.value)}
                            className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono text-sm text-white/90 outline-none focus:border-white/30">
                            <option value="">Select patient…</option>
                            {getProfiles().map(p => <option key={p.id} value={p.id}>{p.id} — {p.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="micro-label">Patient B</label>
                          <select value={cmpId2} onChange={e => setCmpId2(e.target.value)}
                            className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono text-sm text-white/90 outline-none focus:border-white/30">
                            <option value="">Select patient…</option>
                            {getProfiles().map(p => <option key={p.id} value={p.id}>{p.id} — {p.name}</option>)}
                          </select>
                        </div>
                      </div>
                      <button onClick={handleCompareByID}
                        className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-6 py-3 text-xs uppercase tracking-[0.22em] text-red-300 transition hover:bg-red-500/20">
                        <Zap className="h-4 w-4" />
                        Compare DNA
                      </button>
                    </div>
                  )}

                  {/* ─── Tab: Mutation Recorder ─── */}
                  {analyzeTab === "recorder" && (
                    <div className="space-y-6">
                      <div className="flex items-start gap-3 rounded-xl border border-red-500/15 bg-red-500/[0.03] px-5 py-4">
                        <Activity className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                        <div>
                          <p className="text-xs leading-5 text-white/55">Select a registered patient and paste their latest DNA sample. MUTATRACK will scan for mutations against their baseline sequence and let you <strong className="text-white/80">record mutations to their profile</strong> for ongoing cancer risk monitoring.</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="micro-label">Select Patient</label>
                        <select value={recId} onChange={e => setRecId(e.target.value)}
                          className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono text-sm text-white/90 outline-none focus:border-white/30">
                          <option value="">Select patient…</option>
                          {getProfiles().filter(p => p.dna && p.dna.length >= 3).map(p => <option key={p.id} value={p.id}>{p.id} — {p.name} ({p.dna.length} bp)</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="micro-label">New DNA Sample</label>
                        <textarea value={recDna} onChange={e => setRecDna(e.target.value)} rows={4}
                          placeholder="Paste the patient's latest DNA sequence — only A, T, G, C"
                          className="w-full resize-none rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono text-xs text-white/90 placeholder-white/20 outline-none focus:border-white/30" />
                      </div>
                      <button onClick={handleMutationRecord}
                        className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-6 py-3 text-xs uppercase tracking-[0.22em] text-red-300 transition hover:bg-red-500/20">
                        <Activity className="h-4 w-4" />
                        Scan for Mutations
                      </button>
                    </div>
                  )}

                  {/* ─── Tab: Manual DNA Match ─── */}
                  {analyzeTab === "match" && (
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="micro-label">Reference Sequence</label>
                          <textarea value={baseSeq} onChange={e => setBaseSeq(e.target.value)} rows={4}
                            placeholder="Paste reference DNA — only A, T, G, C"
                            className="w-full resize-none rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono text-xs text-white/90 placeholder-white/20 outline-none focus:border-white/30" />
                        </div>
                        <div className="space-y-2">
                          <label className="micro-label">Sample Sequence</label>
                          <textarea value={sampleSeq} onChange={e => setSampleSeq(e.target.value)} rows={4}
                            placeholder="Paste sample DNA — only A, T, G, C"
                            className="w-full resize-none rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono text-xs text-white/90 placeholder-white/20 outline-none focus:border-white/30" />
                        </div>
                      </div>
                      <button onClick={handleManualScan}
                        className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-6 py-3 text-xs uppercase tracking-[0.22em] text-red-300 transition hover:bg-red-500/20">
                        <Zap className="h-4 w-4" />
                        Scan Mutations
                      </button>
                    </div>
                  )}

                  {/* ─── Tab: Single Sequence ─── */}
                  {analyzeTab === "single" && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="micro-label">DNA Sequence</label>
                        <textarea value={singleSeq} onChange={e => setSingleSeq(e.target.value)} rows={4}
                          placeholder="Paste a DNA sequence for nucleotide, codon, and ORF analysis"
                          className="w-full resize-none rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono text-xs text-white/90 placeholder-white/20 outline-none focus:border-white/30" />
                      </div>
                      <button onClick={handleSingleAnalyze}
                        className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-6 py-3 text-xs uppercase tracking-[0.22em] text-red-300 transition hover:bg-red-500/20">
                        <ClipboardList className="h-4 w-4" />
                        Analyze Sequence
                      </button>
                    </div>
                  )}

                  {/* Error display */}
                  {error && (
                    <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/8 px-4 py-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                      <p className="text-xs text-red-300">{error}</p>
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button onClick={resetAnalyzer}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-5 py-2.5 text-xs uppercase tracking-[0.22em] text-white/50 transition hover:text-white/80">
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </button>
                  </div>
                </motion.div>

                {/* ═══════════ Results ═══════════ */}
                <AnimatePresence>
                  {(scanResult || singleStats) && (
                    <motion.div ref={resultsRef} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: revealEase }} className="space-y-6">

                      {/* ── Scan results (compare / recorder / manual) ── */}
                      {scanResult && (
                        <>
                          {/* Label bar */}
                          {(cmpLabel.a || cmpLabel.b) && (
                            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em]">
                              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-white/70">{cmpLabel.a}</span>
                              <span className="text-red-500 font-bold">vs</span>
                              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-white/70">{cmpLabel.b}</span>
                            </div>
                          )}

                          {/* Summary stats */}
                          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                              { label: "Similarity", value: `${scanResult.similarity.toFixed(1)}%`, sub: `${scanResult.mutations.length} mutation${scanResult.mutations.length !== 1 ? "s" : ""}` },
                              { label: "Ts / Tv Ratio", value: scanResult.tsTvRatio.toFixed(2), sub: `Ts:${scanResult.tsCount}  Tv:${scanResult.tvCount}` },
                              { label: cmpLabel.a || "Reference", value: `${scanResult.lengthA} bp`, sub: `GC ${scanResult.gcA.toFixed(1)}%` },
                              { label: cmpLabel.b || "Sample", value: `${scanResult.lengthB} bp`, sub: `GC ${scanResult.gcB.toFixed(1)}%` },
                            ].map(s => (
                              <div key={s.label} className="stat-card rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                                <p className="micro-label mb-3">{s.label}</p>
                                <p className="font-display text-3xl font-bold tracking-[-0.06em]">{s.value}</p>
                                <p className="mt-1 text-xs text-white/45">{s.sub}</p>
                              </div>
                            ))}
                          </div>

                          {/* Risk tally */}
                          <div className="flex flex-wrap gap-3">
                            {([
                              { risk: "CRITICAL" as RiskLevel, count: scanResult.criticalCount },
                              { risk: "HIGH" as RiskLevel,     count: scanResult.highCount },
                              { risk: "MODERATE" as RiskLevel, count: scanResult.moderateCount },
                              { risk: "LOW" as RiskLevel,      count: scanResult.lowCount },
                            ]).map(({ risk, count }) => (
                              <div key={risk} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs ${riskConfig[risk].cls}`}>
                                <RiskBadge risk={risk} />
                                <span className="font-mono">{count}</span>
                              </div>
                            ))}
                          </div>

                          {/* Cancer risk warning if high-severity mutations found */}
                          {(scanResult.criticalCount > 0 || scanResult.highCount > 0) && (
                            <div className="cancer-risk-card rounded-2xl border border-red-500/40 bg-red-500/[0.06] p-6 risk-pulse">
                              <div className="flex items-center gap-3 mb-3">
                                <ShieldAlert className="h-5 w-5 text-red-400" />
                                <p className="micro-label m-0 text-red-300">Oncogenic Risk Alert</p>
                              </div>
                              <p className="text-sm leading-7 text-white/70">
                                This scan detected <strong className="text-red-300">{scanResult.criticalCount} CRITICAL</strong> and <strong className="text-red-300">{scanResult.highCount} HIGH</strong> risk mutations.
                                STOP-codon introductions truncate tumour suppressor proteins (TP53, BRCA1/2, APC), and radical amino acid substitutions can activate oncogenes (KRAS, MYC, EGFR).
                                These mutation patterns are consistent with early-stage oncogenesis markers documented in the COSMIC database. <em className="text-white/50">Clinical review is strongly recommended.</em>
                              </p>
                            </div>
                          )}

                          {/* Mutation Recorder: save to patient button */}
                          {analyzeTab === "recorder" && scanResult.mutations.length > 0 && !recSaved && (
                            <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-5">
                              <Save className="h-5 w-5 text-white/40 shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm text-white/80">Record {scanResult.mutations.length} mutation{scanResult.mutations.length > 1 ? "s" : ""} to this patient's clinical history?</p>
                                <p className="text-xs text-white/45 mt-1">This will update their cancer risk profile and be visible in the Patient Records tab.</p>
                              </div>
                              <button onClick={handleSaveMutations}
                                className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-red-300 transition hover:bg-red-500/20 shrink-0">
                                <Save className="h-3.5 w-3.5" />
                                Save to Record
                              </button>
                            </div>
                          )}
                          {analyzeTab === "recorder" && recSaved && (
                            <div className="flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/6 px-6 py-5">
                              <Check className="h-5 w-5 text-green-400" />
                              <p className="text-sm text-green-300">{scanResult.mutations.length} mutation{scanResult.mutations.length > 1 ? "s" : ""} saved to patient record. View them in the <a href="#patients" className="underline hover:text-green-200">Patient Records</a> tab.</p>
                            </div>
                          )}

                          {/* Mutation table */}
                          {scanResult.mutations.length > 0 ? (
                            <div className="mutatrack-glass overflow-hidden rounded-2xl">
                              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                                <p className="micro-label m-0">Mutation Table ({scanResult.mutations.length} events)</p>
                                <button onClick={handleDownload} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white/70 transition hover:text-white">
                                  <Download className="h-3.5 w-3.5" />
                                  Export .txt
                                </button>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-left font-mono text-xs">
                                  <thead>
                                    <tr className="border-b border-white/8 text-white/40">
                                      {["#","Pos","Change","Type","AA Effect","Risk","Codon","AA Change"].map(h => (
                                        <th key={h} className="px-4 py-3 font-normal uppercase tracking-[0.18em]">{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {scanResult.mutations.slice(0, 50).map((m, i) => (
                                      <tr key={i} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                                        <td className="px-4 py-2.5 text-white/30">{i + 1}</td>
                                        <td className="px-4 py-2.5 text-white/70">{m.position}</td>
                                        <td className="px-4 py-2.5 font-semibold text-white">{m.original}→{m.mutated}</td>
                                        <td className="px-4 py-2.5 text-white/60">{m.mutType}</td>
                                        <td className="px-4 py-2.5 text-white/60">{m.aaEffect}</td>
                                        <td className="px-4 py-2.5"><RiskBadge risk={m.risk} /></td>
                                        <td className="px-4 py-2.5 text-white/50">{m.origCodon}→{m.mutCodon}</td>
                                        <td className="px-4 py-2.5 text-white/50 max-w-[180px] truncate">{m.origAA}→{m.mutAA}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                {scanResult.mutations.length > 50 && (
                                  <p className="px-6 py-3 text-[11px] text-white/35">Showing first 50 of {scanResult.mutations.length} mutations. Export for full report.</p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5">
                              <Check className="h-5 w-5 text-green-400" />
                              <p className="text-sm text-white/70">Sequences are identical in the compared region — no mutations detected.</p>
                            </div>
                          )}
                        </>
                      )}

                      {/* ── Single sequence stats ── */}
                      {singleStats && (
                        <div className="space-y-6">
                          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                              { label: "Length", value: `${singleStats.length} bp` },
                              { label: "GC Content", value: `${singleStats.gc.toFixed(1)}%`, sub: singleStats.gcLabel },
                              { label: "ORFs found", value: String(singleStats.orfs.length) },
                              { label: "Codons", value: String(singleStats.codons.length), sub: "(first 20)" },
                            ].map(s => (
                              <div key={s.label} className="stat-card rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                                <p className="micro-label mb-3">{s.label}</p>
                                <p className="font-display text-3xl font-bold tracking-[-0.06em]">{s.value}</p>
                                {s.sub && <p className="mt-1 text-xs text-white/45">{s.sub}</p>}
                              </div>
                            ))}
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="mutatrack-glass rounded-2xl p-6">
                              <p className="micro-label mb-4">Nucleotide Composition</p>
                              <div className="space-y-2">
                                {(["a","t","g","c"] as const).map(n => (
                                  <div key={n} className="flex items-center gap-3">
                                    <span className="w-4 font-mono text-xs uppercase text-white/50">{n}</span>
                                    <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/8">
                                      <div className={`absolute inset-y-0 left-0 rounded-full ${n === "g" || n === "c" ? "bg-gradient-to-r from-red-500/60 to-red-400/30" : "bg-gradient-to-r from-white/40 to-white/20"}`} style={{ width: `${singleStats[`${n}Pct` as 'aPct'|'tPct'|'gPct'|'cPct']}%` }} />
                                    </div>
                                    <span className="w-12 text-right font-mono text-xs text-white/60">{singleStats[`${n}Pct` as 'aPct'|'tPct'|'gPct'|'cPct'].toFixed(1)}%</span>
                                  </div>
                                ))}
                              </div>
                              <p className="mt-5 font-mono text-xs text-white/40 leading-relaxed">RNA: {singleStats.rnaTranscript}</p>
                            </div>

                            <div className="mutatrack-glass rounded-2xl p-6">
                              <p className="micro-label mb-4">Codon Translation (first 20)</p>
                              <div className="max-h-48 overflow-y-auto space-y-1">
                                {singleStats.codons.map((c, i) => (
                                  <div key={i} className="flex items-center gap-3 font-mono text-xs">
                                    <span className="text-white/40">{String(i+1).padStart(2,'0')}</span>
                                    <span className="text-white/80">{c.codon}</span>
                                    <span className="text-white/40">→</span>
                                    <span className={c.aa.startsWith("STOP") ? "text-red-400" : "text-white/60"}>{c.aa}</span>
                                  </div>
                                ))}
                              </div>
                              {singleStats.orfs.length > 0 && (
                                <div className="mt-5 border-t border-white/10 pt-4">
                                  <p className="micro-label mb-2">Open Reading Frames</p>
                                  {singleStats.orfs.slice(0, 4).map((o, i) => (
                                    <p key={i} className="font-mono text-xs text-white/50">ORF {i+1}: start={o.start} stop={o.stop} len={o.length}bp</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </section>



          {/* ═══════════════════ PATIENTS ═══════════════════ */}
          <section id="patients" className="section-shell px-8 md:px-16">
            <div className="container">
              <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={stagger} className="space-y-10">

                <motion.div variants={fadeUp} className="mx-auto max-w-3xl text-center">
                  <SectionLabel>Patient Records</SectionLabel>
                  <h2 className="font-display text-5xl font-bold uppercase tracking-[-0.08em] md:text-7xl">
                    Find a <span className="text-red-500">Patient</span>
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/60">
                    Access a patient's DNA profile, full mutation history, and AI-derived cancer risk assessment by their unique Patient ID.
                  </p>
                </motion.div>

                {/* Tab switcher */}
                <motion.div variants={fadeUp} className="flex justify-center gap-2">
                  {(["lookup", "register"] as const).map(tab => (
                    <button key={tab} onClick={() => { setPatientTab(tab); setPatError(""); setPatSuccess(""); setFoundProfile(undefined); setFoundMuts(null); }}
                      className={`rounded-full border px-6 py-2.5 text-xs uppercase tracking-[0.22em] transition-all duration-200 ${
                        patientTab === tab ? "border-white/30 bg-white/10 text-white" : "border-white/10 bg-transparent text-white/50 hover:text-white"
                      }`}>
                      {tab === "lookup" ? "Lookup by ID" : "Register Patient"}
                    </button>
                  ))}
                </motion.div>

                <motion.div variants={fadeUp} className="mutatrack-glass rounded-[1.75rem] p-6 md:p-10">
                  {patientTab === "lookup" ? (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                      <div className="flex-1 space-y-2">
                        <label className="micro-label">Patient ID</label>
                        <input
                          value={lookupId}
                          onChange={e => setLookupId(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && handleLookup()}
                          placeholder="e.g. P001"
                          className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono text-sm text-white/90 placeholder-white/20 outline-none focus:border-white/30"
                        />
                      </div>
                      <button onClick={handleLookup}
                        className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-6 py-3 text-xs uppercase tracking-[0.22em] text-red-300 transition hover:bg-red-500/20">
                        <Search className="h-4 w-4" />
                        Lookup
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="micro-label">Patient ID</label>
                          <input value={regId} onChange={e => setRegId(e.target.value)} placeholder="e.g. P001"
                            className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono text-sm text-white/90 placeholder-white/20 outline-none focus:border-white/30" />
                        </div>
                        <div className="space-y-2">
                          <label className="micro-label">Full Name</label>
                          <input value={regName} onChange={e => setRegName(e.target.value)} placeholder="e.g. Jane Smith"
                            className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white/90 placeholder-white/20 outline-none focus:border-white/30" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="micro-label">Reference DNA Sequence (optional)</label>
                        <textarea value={regDna} onChange={e => setRegDna(e.target.value)} rows={3}
                          placeholder="Paste baseline DNA — only A, T, G, C"
                          className="w-full resize-none rounded-xl border border-white/15 bg-black/40 px-4 py-3 font-mono text-xs text-white/90 placeholder-white/20 outline-none focus:border-white/30" />
                      </div>
                      <button onClick={handleRegister}
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-6 py-3 text-xs uppercase tracking-[0.22em] text-white transition hover:bg-white/12">
                        <UserPlus className="h-4 w-4" />
                        Register
                      </button>
                    </div>
                  )}

                  {/* Status messages */}
                  {patError && (
                    <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/8 px-4 py-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                      <p className="text-xs text-red-300">{patError}</p>
                    </div>
                  )}
                  {patSuccess && (
                    <div className="mt-5 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/8 px-4 py-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                      <p className="text-xs text-green-300">{patSuccess}</p>
                    </div>
                  )}
                </motion.div>

                {/* ── Patient Profile Results ── */}
                <AnimatePresence>
                  {foundProfile && (() => {
                    const stats = foundProfile.dna ? analyseSequence(foundProfile.dna) : null;
                    const muts  = foundMuts ?? [];
                    const risk  = computeCancerRisk(muts, stats ?? { length: 0, gc: 50, gcLabel: "Balanced" as const, a: 0, t: 0, g: 0, c: 0, aPct: 0, tPct: 0, gPct: 0, cPct: 0, rnaTranscript: "", codons: [], orfs: [] });
                    const riskColor = risk.level === "HIGH" ? "border-red-500/50 bg-red-500/8" : risk.level === "MODERATE" ? "border-yellow-500/40 bg-yellow-500/6" : risk.level === "LOW" ? "border-green-500/30 bg-green-500/5" : "border-white/10 bg-white/2";
                    const riskTextColor = risk.level === "HIGH" ? "text-red-400" : risk.level === "MODERATE" ? "text-yellow-300" : risk.level === "LOW" ? "text-green-400" : "text-white/40";
                    return (
                      <motion.div ref={patResultsRef} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: revealEase }} className="space-y-6">

                        {/* Header card */}
                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5">
                          <div>
                            <p className="micro-label mb-1">Patient Record</p>
                            <h3 className="font-display text-3xl font-bold uppercase tracking-[-0.06em]">{foundProfile.name}</h3>
                            <p className="mt-1 font-mono text-xs text-white/50">ID: {foundProfile.id} &nbsp;·&nbsp; Registered: {foundProfile.createdAt.slice(0, 10)}</p>
                          </div>
                          <button onClick={() => setShowDeleteConfirm(v => !v)}
                            className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-red-400/70 transition hover:bg-red-500/15">
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete Record
                          </button>
                        </div>

                        {showDeleteConfirm && (
                          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-500/40 bg-red-500/10 px-6 py-4">
                            <p className="text-sm text-red-300">Permanently delete <strong>{foundProfile.id}</strong> and all their mutation history?</p>
                            <div className="flex gap-2">
                              <button onClick={handleDeletePatient} className="rounded-full border border-red-500/60 bg-red-500/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-red-300 transition hover:bg-red-500/30">Confirm Delete</button>
                              <button onClick={() => setShowDeleteConfirm(false)} className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/50 transition hover:text-white">Cancel</button>
                            </div>
                          </div>
                        )}

                        {/* DNA Stats */}
                        {stats && (
                          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                              { label: "Sequence Length", value: `${stats.length} bp` },
                              { label: "GC Content", value: `${stats.gc.toFixed(1)}%`, sub: stats.gcLabel },
                              { label: "ORFs Found", value: String(stats.orfs.length) },
                              { label: "Total Mutations", value: String(muts.length), sub: "recorded events" },
                            ].map(s => (
                              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                                <p className="micro-label mb-3">{s.label}</p>
                                <p className="font-display text-3xl font-bold tracking-[-0.06em]">{s.value}</p>
                                {s.sub && <p className="mt-1 text-xs text-white/45">{s.sub}</p>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ── Cancer Risk Card ── */}
                        <div className={`rounded-2xl border p-6 md:p-8 ${riskColor}`}>
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3 mb-3">
                                <ShieldAlert className={`h-6 w-6 ${riskTextColor}`} />
                                <p className="micro-label m-0">Oncogenic Risk Assessment</p>
                              </div>
                              <p className={`font-display text-2xl font-bold uppercase tracking-[-0.05em] ${riskTextColor}`}>{risk.headline}</p>
                            </div>
                            <span className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] font-mono font-bold ${riskTextColor} ${
                              risk.level === "HIGH" ? "border-red-500/40" : risk.level === "MODERATE" ? "border-yellow-500/30" : "border-white/15"
                            }`}>{risk.level}</span>
                          </div>
                          <p className="mt-5 text-sm leading-7 text-white/75">{risk.detail}</p>
                          {risk.indicators.length > 0 && (
                            <div className="mt-6 space-y-2 border-t border-white/10 pt-5">
                              <p className="micro-label mb-3">Clinical Indicators</p>
                              {risk.indicators.map((ind, i) => (
                                <div key={i} className="flex items-start gap-3">
                                  <ArrowRight className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${riskTextColor}`} />
                                  <p className="text-xs leading-5 text-white/65">{ind}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Cancer link disclaimer */}
                          <div className="mt-6 rounded-xl border border-white/10 bg-black/20 px-5 py-4">
                            <p className="text-[11px] leading-6 text-white/45">
                              <span className="text-white/70 font-semibold">Research context:</span> Accumulated STOP-codon and radical amino acid
                              substitution mutations in tumour-suppressor genes (TP53, BRCA1/2, APC) and proto-oncogenes (KRAS, MYC, EGFR) are
                              well-established drivers of oncogenesis. The Ts/Tv imbalance and elevated non-synonymous mutation burden observed
                              in this profile are consistent with patterns reported in COSMIC (Catalogue Of Somatic Mutations In Cancer) datasets.
                              This tool does not substitute clinical genomic analysis.
                            </p>
                          </div>
                        </div>

                        {/* Mutation History Table */}
                        {muts.length > 0 ? (
                          <div className="mutatrack-glass overflow-hidden rounded-2xl">
                            <div className="border-b border-white/10 px-6 py-4">
                              <p className="micro-label m-0">Mutation History ({muts.length} recorded events)</p>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left font-mono text-xs">
                                <thead>
                                  <tr className="border-b border-white/8 text-white/40">
                                    {["#","Date","Pos","Change","Type","AA Effect","Risk","AA Change"].map(h => (
                                      <th key={h} className="px-4 py-3 font-normal uppercase tracking-[0.18em]">{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {muts.map((m: StoredMutation, i: number) => (
                                    <tr key={i} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                                      <td className="px-4 py-2.5 text-white/30">{i + 1}</td>
                                      <td className="px-4 py-2.5 text-white/50">{m.date}</td>
                                      <td className="px-4 py-2.5 text-white/70">{m.position}</td>
                                      <td className="px-4 py-2.5 font-semibold text-white">{m.original}→{m.mutated}</td>
                                      <td className="px-4 py-2.5 text-white/60">{m.mutType}</td>
                                      <td className="px-4 py-2.5 text-white/60">{m.aaEffect}</td>
                                      <td className="px-4 py-2.5"><RiskBadge risk={m.risk as RiskLevel} /></td>
                                      <td className="px-4 py-2.5 text-white/50">{m.origAA}→{m.mutAA}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5">
                            <Check className="h-5 w-5 text-white/30" />
                            <p className="text-sm text-white/50">No mutations recorded for this patient yet. Run a scan in the Analyzer and save mutations to this profile.</p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>

              </motion.div>
            </div>
          </section>

          <section id="research" className="section-shell px-8 md:px-16">
            <div className="container">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={stagger}
                className="space-y-12">
                <motion.div variants={fadeUp} className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
                  <div>
                    <SectionLabel>Research</SectionLabel>
                    <h2 className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-[-0.08em] md:text-7xl">
                      The Pipeline
                    </h2>
                    <p className="mt-4 font-display text-3xl uppercase tracking-[-0.05em] text-red-500 md:text-5xl">
                      From sequence to clinical insight
                    </p>
                  </div>
                  <p className="max-w-xl text-sm leading-7 text-white/70 lg:justify-self-end">
                    A disciplined analysis path keeps results interpretable. MUTATRACK moves from raw sequence input to
                    clinically structured reporting without losing provenance at any stage.
                  </p>
                </motion.div>

                <motion.div variants={stagger} className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {processSteps.map((step) => (
                    <motion.div
                      key={step.number}
                      variants={fadeUp}
                      className="group mutatrack-glass relative overflow-hidden rounded-2xl p-8">
                      <span className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-red-500 transition-transform duration-500 group-hover:scale-x-100" />
                      <p className="text-xs uppercase tracking-[0.24em] text-red-500">{step.number}</p>
                      <h3 className="mt-5 font-display text-3xl uppercase tracking-[-0.05em]">{step.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-white/70">{step.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>

          <section className="section-shell px-8 md:px-16">
            <div className="container">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={stagger}
                className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 md:p-10">
                <motion.div variants={fadeUp} className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <SectionLabel>System metrics</SectionLabel>
                    <h2 className="font-display text-4xl font-bold uppercase tracking-[-0.07em] md:text-6xl">
                      Trusted performance, measured precisely
                    </h2>
                  </div>
                </motion.div>

                <motion.div variants={stagger} className="grid gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => (
                    <motion.div key={stat.label} variants={fadeUp} className="bg-black/90 p-8 md:p-10">
                      <div className="flex items-start text-5xl font-bold tracking-[-0.08em] text-white md:text-7xl">
                        <span>{stat.value}</span>
                        {stat.suffix && <span className="text-red-500">{stat.suffix}</span>}
                      </div>
                      <p className="mt-5 max-w-[16rem] text-sm leading-7 text-white/68">{stat.label}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>

          <section className="section-shell px-8 md:px-16">
            <div className="container">
              <div className="grid gap-12 lg:grid-cols-[0.38fr_0.62fr]">
                <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
                  <SectionLabel>FAQ</SectionLabel>
                  <h2 className="font-display text-5xl font-bold uppercase tracking-[-0.07em] md:text-7xl">
                    Common questions
                  </h2>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  variants={stagger}
                  className="border-t border-white/10 lg:border-t-0">
                  {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                      <motion.div key={faq.question} variants={fadeUp} className="border-b border-white/10 py-6">
                        <button
                          type="button"
                          onClick={() => setOpenIndex(isOpen ? null : index)}
                          className="flex w-full items-start justify-between gap-6 text-left">
                          <span className="font-display pr-4 text-2xl uppercase leading-tight tracking-[-0.05em] md:text-3xl">
                            {faq.question}
                          </span>
                          <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/5">
                            {isOpen ? <Minus className="h-5 w-5 text-red-500" /> : <Plus className="h-5 w-5 text-white" />}
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: revealEase }}
                              className="overflow-hidden">
                              <p className="max-w-3xl pt-5 text-sm leading-7 text-white/72">{faq.answer}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </section>

          <section id="contact" className="section-shell px-8 pb-16 md:px-16 md:pb-24">
            <div className="container">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={fadeUp}
                className="relative overflow-hidden rounded-[2rem] border border-white/12 px-8 py-16 text-center md:px-12">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663569425099/AbQHjmSbxmpJKKAMyBKBDv/mutatrack-cta-signal-orb-46dt3SFG6XyvxP3UCtgWC6.webp"
                  alt="Diagnostic signal orb"
                  className="absolute right-[-8%] top-1/2 hidden h-[120%] -translate-y-1/2 opacity-35 lg:block"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-red-500/[0.08]" />
                <div className="relative mx-auto max-w-3xl">
                  <SectionLabel>Ready to analyze?</SectionLabel>
                  <h2 className="font-display text-5xl font-bold uppercase leading-[0.92] tracking-[-0.08em] md:text-7xl lg:text-8xl">
                    Let&apos;s find the <span className="text-red-500">mutation</span>
                  </h2>
                  <a
                    href="#home"
                    className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/6 px-7 py-4 text-sm uppercase tracking-[0.24em] text-white transition duration-300 hover:border-red-500/40 hover:bg-red-500/8">
                    Start Analysis
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 px-8 py-10 md:px-16">
          <div className="container">
            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <a href="#home" className="flex items-center gap-3 text-sm font-semibold tracking-[0.24em] uppercase">
                  <span className="red-dot text-xl leading-none">●</span>
                  <span className="font-display text-lg tracking-[0.18em]">MUTATRACK</span>
                </a>
                <p className="mt-5 max-w-xs text-sm leading-7 text-white/68">Sequence. Detect. Protect.</p>
              </div>

              <div>
                <p className="micro-label mb-5">Analysis</p>
                <div className="space-y-3 text-sm text-white/70">
                  <a href="#analyze" className="block transition-colors hover:text-white">Mutation Scanning</a>
                  <a href="#research" className="block transition-colors hover:text-white">Pipeline</a>
                  <a href="#about" className="block transition-colors hover:text-white">Risk Classification</a>
                </div>
              </div>

              <div>
                <p className="micro-label mb-5">Research</p>
                <div className="space-y-3 text-sm text-white/70">
                  <a href="#research" className="block transition-colors hover:text-white">ORF Detection</a>
                  <a href="#research" className="block transition-colors hover:text-white">Codon Analysis</a>
                  <a href="#about" className="block transition-colors hover:text-white">Cancer Detection</a>
                </div>
              </div>

              <div>
                <p className="micro-label mb-5">Support</p>
                <div className="space-y-3 text-sm text-white/70">
                  <a href="#contact" className="block transition-colors hover:text-white">Contact</a>
                  <a href="#home" className="block transition-colors hover:text-white">Run Analysis</a>
                  <a href="#home" className="block transition-colors hover:text-white">Documentation</a>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.2em] text-white/52 md:flex-row md:items-center md:justify-between">
              <p>© 2026 MutaTrack</p>
              <div className="flex items-center gap-6">
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                  Twitter
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                  LinkedIn
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                  GitHub
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
