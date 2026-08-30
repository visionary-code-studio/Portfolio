import { Interest } from "@/types";

export const interestsData: Interest[] = [
  {
    id: "int-01",
    name: "Artificial Intelligence & LLMs",
    category: "Core Intelligence",
    description:
      "Developing agentic workflows, prompt-engineered pipelines, reasoning loops, and retrieval-augmented systems that extend model context and reliability.",
    priority: "High",
    published: true,
    subtopics: ["GenAI", "RAG", "Agentic AI", "AI Agents", "Groq / Gemini APIs"],
  },
  {
    id: "int-02",
    name: "Physics-Informed ML (PIML)",
    category: "Deep Science",
    description:
      "Exploring physics-constrained loss functions to train neural networks that obey fundamental conservation laws for engineering and physical simulations.",
    priority: "High",
    published: true,
    subtopics: ["Differential Equations", "Scientific Computing", "Neural Operators"],
  },
  {
    id: "int-03",
    name: "Blockchain & Decentralized Trust",
    category: "Distributed Systems",
    description:
      "Investigating cryptographic consensus, deterministic state machines, and transparent data registries for permissionless networks.",
    priority: "High",
    published: true,
    subtopics: ["Smart Contracts", "Web3 Architecture", "Consensus Protocols"],
  },
  {
    id: "int-04",
    name: "Game Development & Graphics",
    category: "Creative Engineering",
    description:
      "Experimenting with game loop mechanics, shader programming, spatial geometry, and interactive virtual environments.",
    priority: "Medium",
    published: true,
    subtopics: ["Shader Math", "Interactive Physics", "Procedural Generation"],
  },
  {
    id: "int-05",
    name: "System Architecture & Full-Stack",
    category: "Software Engineering",
    description:
      "Bridging clean UI/UX with high-throughput backend services, reactive state management, and edge deployments.",
    priority: "High",
    published: true,
    subtopics: ["Next.js", "Node.js", "TypeScript", "REST / GraphQL", "Tailwind CSS"],
  },
  {
    id: "int-06",
    name: "Presentation & Visual Storytelling",
    category: "Design & Product",
    description:
      "Transforming complex technical abstractions into memorable, persuasive visual narratives and editorial slide decks.",
    priority: "Medium",
    published: true,
    subtopics: ["Visual Hierarchy", "Information Density", "Deck Architecture"],
  },
  {
    id: "int-07",
    name: "Startups & Venture Prototyping",
    category: "Entrepreneurship",
    description:
      "Validating market problems from first principles, shipping rapid MVPs, and iterating based on real user interactions.",
    priority: "High",
    published: true,
    subtopics: ["Rapid Prototyping", "Product Market Fit", "Hackathon Building"],
  },
];
