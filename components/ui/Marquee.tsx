import styles from './Marquee.module.css';

const items = [
  'AIML Engineer', 'GenAI & Agentic AI', 'PIML Research', 'CodeMap',
  'Next.js', 'System Design', 'Blockchain Dev', 'Hackathon Builder',
  'Sister Nivedita University', 'Developer', 'Creator', 'B.Tech CSE',
  'Build · Learn · Explore', 'Kolkata', 'Innovation',
];

export default function Marquee() {
  const doubled = [...items, ...items];
  return (
    <div className={styles.marqueeOuter} aria-hidden="true">
      <div className={styles.marqueeTrack}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.item}>
            {item} <span className={styles.dot}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
