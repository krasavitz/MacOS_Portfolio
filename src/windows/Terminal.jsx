import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { techStack } from "#constants";
import { WindowControls } from "#components";

const Skills = () => {
  return (
    <>
      <div id="window-header">
        <WindowControls target="terminal" />
        <h2>skills</h2>
      </div>

      <div className="skills">
        <div className="skills-hero">
          <p className="eyebrow">toolkit</p>
          <h3>skills ive picked up</h3>
        </div>

        <ul className="skill-grid">
          {techStack.map(({ category, items }, i) => (
            <li key={category} className="skill-card">
              <div className="card-top">
                <span className="index">{String(i + 1).padStart(2, "0")}</span>
                <h4>{category}</h4>
              </div>

              {/* The spaces around each slash are the only places a line is
                  allowed to break — each entry itself stays on one line. */}
              <ul className="skill-list">
                {items.map((item, n) => (
                  <li key={item}>
                    <span className="entry">{item}</span>
                    {n < items.length - 1 && <span className="sep">{" / "}</span>}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const TerminalWindow = WindowWrapper(Skills, 'terminal');

export default TerminalWindow;
