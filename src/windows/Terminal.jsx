import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { techStack } from "#constants";
import { Check, Flag } from "lucide-react";
import { WindowControls } from "#components";
const Terminal = () => {
  return (
    <>
      <div id="window-header">
        <WindowControls target="terminal" />
        <h2>Terminal</h2>
      </div>

      <div className="techstack">
        <p>
          <span className="font-bold">@Oliver % </span>
          show skills
        </p>

        <div className="label">
          <p className="w-32">Category</p>
          <p>Technologies</p>
        </div>

        <ul className="content">
          {techStack.map(({ category, items }) => (
            <li key={category} className="flex items-start">
              <Check className="check" size={20} />
              <h3>{category}</h3>
              <ul>
                {items.map((item, i) => (
                  <li key={i}>
                    {item} {i < items.length - 1 ? "," : ""}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="footnote">
          <p>
            <Check size={20} /> {techStack.length} of {techStack.length} groups
            loaded successfully (100%)
          </p>

          <p className="text-zinc-400">
            <Flag size={15} fill="currentColor" />
            Render time: 6ms
          </p>
        </div>
      </div>
    </>
  );
};

const TerminalWindow = WindowWrapper(Terminal, 'terminal');

export default TerminalWindow;