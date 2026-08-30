import { Project } from "@/types";

export const projectsData: Project[] = [
  {
    id: "proj-01",
    name: "CodeMap",
    category: "Artificial Intelligence / DevTools",
    year: 2026,
    description:
      "Visualize your codebase architecture instantly. An intelligent platform that parses repositories, extracts dependency topologies using LLM pipelining, and generates interactive architecture diagrams in real time.",
    role: "AI Architecture, API Integration (Gemini & Groq), and AI Pipelining",
    technologies: ["Gemini API", "Groq API", "Node.js", "Express.js", "LLM Reasoning", "Next.js"],
    repoUrl: "https://github.com/rajvirxai/CodeMap-AI-Powered-Code-to-Architecture-Visualizer",
    liveUrl: "https://code-map-ai-powered-code-to-archite.vercel.app/",
    image: "/images/projects/codemap.svg",
    featured: true,
  },
  {
    id: "proj-02",
    name: "IntelliAgent Runtime",
    category: "Autonomous Systems",
    year: 2025,
    description:
      "A lightweight multi-agent orchestration framework enabling dynamic task routing, tool execution memory, and deterministic JSON schema validation for autonomous AI assistants.",
    role: "Core Framework Design & Memory Management",
    technologies: ["Python", "AsyncIO", "Pydantic", "FastAPI", "Vector Store"],
    repoUrl: "https://github.com/rajvirxai",
    image: "/images/projects/agent.svg",
    featured: true,
  },
  {
    id: "proj-03",
    name: "BlockVerify Protocol",
    category: "Blockchain",
    year: 2025,
    description:
      "A decentralized credential verification proof-of-concept enabling tamper-proof issuance and cryptographic verification of academic certificates and achievements on-chain.",
    role: "Smart Contract Developer & Web3 Integration",
    technologies: ["Solidity", "Ethers.js", "React", "Hardhat"],
    repoUrl: "https://github.com/rajvirxai",
    image: "/images/projects/blockchain-cert.svg",
    featured: false,
  },
];
