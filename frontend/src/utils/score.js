export const WEIGHTS = {
  projects: 0.40,  // project/OSS wins
  skills:   0.25,  // quiz/assessments later; for now from achievements 'course'
  endorsements: 0.15,
  ats: 0.20
};

export function withinRange(ts, range) {
  const now = new Date();
  const t = new Date(ts);
  const diff = (now - t) / (1000*60*60*24); // days
  if (range === "1m") return diff <= 31;
  if (range === "6m") return diff <= 183;
  if (range === "1y") return diff <= 366;
  return true; // all
}

export function computeBuckets(user, range="all") {
  let projPts = 0, skillPts = 0;
  (user.achievements || []).forEach(a => {
    if (!withinRange(a.ts, range)) return;
    if (a.type === "project" || a.type === "hackathon" || a.type === "oss") projPts += a.points;
    if (a.type === "course" || a.type === "cert") skillPts += a.points;
  });
  const endorsements = (user.endorsements || 0);
  const ats = user.atsScore || 0;

  return { projPts, skillPts, endorsements, ats };
}

export function scoreUser(user, range="all", weights=WEIGHTS) {
  const b = computeBuckets(user, range);
  // normalize crudely for prototype
  const proj = Math.min(b.projPts/100, 1);     // cap
  const skill = Math.min(b.skillPts/40, 1);
  const endors = Math.min(b.endorsements/5, 1);
  const ats = Math.min(b.ats/100, 1);
  const total = Math.round(
    (proj*weights.projects + skill*weights.skills + endors*weights.endorsements + ats*weights.ats) * 100
  );
  return { ...b, total };
}
