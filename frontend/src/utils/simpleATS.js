export function simpleATS(seed="resume") {
  // naive, but demo-friendly
  const base = [...seed].reduce((a,c)=>a+c.charCodeAt(0), 0);
  const score = 55 + (base % 45); // 55..99

  const pros = [
    "Clear section headings",
    "Strong action verbs",
    "Relevant keywords for target role"
  ].slice(0, (base % 3) + 1);

  const cons = [
    "Add quantifiable impact to bullets",
    "Include links to projects/GitHub",
    "Consider reordering sections per role"
  ].slice(0, (3 - (base % 3)));

  return { score, pros, cons, suggestions: [
    "Add 2 measurable achievements per role.",
    "Include a Projects section with 3 concise bullets.",
    "Tailor keywords to your target JD."
  ]};
}
