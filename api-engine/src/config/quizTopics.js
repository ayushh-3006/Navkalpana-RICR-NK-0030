export const QUIZ_TOPICS = [
  { key: "reactHooks", name: "React Hooks", category: "Frontend" },

  { key: "nodeExpress", name: "Node.js + Express", category: "Backend" },
  { key: "mongodb", name: "MongoDB Basics", category: "Database" },
  { key: "javaOOP", name: "Java OOP", category: "Java" }
];

export const isValidTopicKey = (topicKey) =>
  QUIZ_TOPICS.some((t) => t.key === topicKey);

export const getTopicMeta = (topicKey) =>
  QUIZ_TOPICS.find((t) => t.key === topicKey) || null;