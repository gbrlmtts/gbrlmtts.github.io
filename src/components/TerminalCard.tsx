import { useState, useRef, useEffect } from "react";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";

interface CommandOutput {
  command: string;
  output: string | JSX.Element;
}

const TerminalCard = () => {
  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const availableCommands = ["ls", "whoami", "cat about.txt", "cat help.txt", "cat skills.txt", "cat links.json", "clear"];

  const socialLinks = [
    {
      icon: Github,
      label: "github",
      url: "https://github.com",
    },
    {
      icon: Linkedin,
      label: "linkedin",
      url: "https://linkedin.com",
    },
    {
      icon: Mail,
      label: "email",
      url: "email",
      isEmail: true,
    },
  ];

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const parts = ["hello", "gbrlmtts", "net"];
    const email = `${parts[0]}@${parts[1]}.${parts[2]}`;
    window.location.href = `mailto:${email}`;
  };

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commandHistory]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output: string | JSX.Element = "";

    switch (trimmedCmd) {
      case "ls":
        output = (
          <div className="text-terminal-green">
            <p>about.txt</p>
            <p>help.txt</p>
            <p>skills.txt</p>
            <p>links.json</p>
          </div>
        );
        break;

      case "whoami":
        output = (
          <div className="text-terminal-green">
            <p>You tell me. You're the one who showed up.</p>
          </div>
        );
        break;

      case "cat help.txt":
        output = (
          <div className="text-terminal-green">
            <p className="font-bold mb-2">Available commands:</p>
            <p className="ml-4">ls - List available files</p>
            <p className="ml-4">whoami - Display user information</p>
            <p className="ml-4">cat [file] - Display file contents</p>
            <p className="ml-4">clear - Clear terminal screen</p>
          </div>
        );
        break;

      case "cat about.txt":
        output = (
          <div className="text-terminal-green">
            <p>Hi, my name is Gabriel and I'm somewhere between product, strategy, and the occasional existential crisis. My background in advertising and marketing probably explains why I care so much about stories — and how they turn into products that (hopefully) make sense to someone. I still believe good products are built by listening more than pitching — even if that's not everyone's favorite approach.</p>
          </div>
        );
        break;

      case "cat skills.txt":
        output = (
          <div className="text-terminal-green">
            <p>• Product roadmapping (fuzzy ideas → shippable features)</p>
            <p>• User research (listening before launching)</p>
            <p>• Stakeholder wrangling (yes, that's a skill)</p>
            <p>• Storytelling across ads, campaigns, and specs</p>
            <p>• Prioritization (saying no, gracefully)</p>
          </div>
        );
        break;

      case "cat links.json":
        output = (
          <div>
            <p className="text-terminal-green-dim">{"{"}</p>
            <p className="text-terminal-green-dim ml-4">
              "social_links": [
            </p>
            <div className="flex flex-col gap-2 ml-8 my-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                const isEmail = 'isEmail' in link && link.isEmail;
                return (
                  <a
                    key={link.label}
                    href={isEmail ? "#" : link.url}
                    onClick={isEmail ? handleEmailClick : undefined}
                    target={isEmail ? undefined : "_blank"}
                    rel={isEmail ? undefined : "noopener noreferrer"}
                    className="group flex items-center gap-3 text-terminal-green hover:text-terminal-green-bright transition-all duration-300 border border-terminal-green/30 hover:border-terminal-green px-4 py-2 rounded hover:bg-terminal-green/5"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                    <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                );
              })}
            </div>
            <p className="text-terminal-green-dim ml-4">]</p>
            <p className="text-terminal-green-dim">{"}"}</p>
          </div>
        );
        break;

      case "clear":
        setCommandHistory([]);
        setCurrentCommand("");
        return;

      case "":
        return;

      default:
        output = (
          <div className="text-terminal-green-dim">
            <p>bash: {cmd}: command not found</p>
          </div>
        );
        break;
    }

    if (trimmedCmd) {
      setInputHistory((prev) => [...prev, trimmedCmd]);
      setHistoryIndex(-1);
    }
    setCommandHistory((prev) => [...prev, { command: cmd, output }]);
    setCurrentCommand("");
  };

  const handleTabComplete = () => {
    const matches = availableCommands.filter((cmd) =>
      cmd.startsWith(currentCommand.toLowerCase())
    );
    if (matches.length === 1) {
      setCurrentCommand(matches[0]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand);
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleTabComplete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (inputHistory.length > 0) {
        const newIndex = historyIndex === -1 ? inputHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(inputHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= inputHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(inputHistory[newIndex]);
        }
      }
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen w-full bg-terminal-bg flex items-center justify-center p-4 scanlines">
      <div className="w-full max-w-3xl">
        {/* Terminal Window */}
        <div className="bg-terminal-bg-lighter border-2 border-terminal-green/30 rounded-lg overflow-hidden shadow-2xl">
          {/* Terminal Header */}
          <div className="bg-terminal-bg border-b-2 border-terminal-green/30 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-terminal-green"></div>
            </div>
            <span className="text-terminal-green-dim text-sm ml-2">
              visitor@gbrlmtts:~
            </span>
          </div>

          {/* Terminal Content */}
          <div
            className="p-6 min-h-[500px] max-h-[600px] overflow-y-auto font-mono text-sm cursor-text"
            onClick={handleTerminalClick}
          >
            {commandHistory.map((item, index) => (
              <div key={index} className="mb-3">
                {item.command && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-terminal-green-bright">$</span>
                    <span className="text-terminal-green">{item.command}</span>
                  </div>
                )}
                <div className="ml-0">{item.output}</div>
              </div>
            ))}

            {/* Current command line */}
            <div className="flex items-center gap-2">
              <span className="text-terminal-green-bright">$</span>
              <div className="flex-1 relative">
                <span className="text-terminal-green">{currentCommand}</span>
                <span
                  className={`inline-block w-2 h-4 bg-terminal-green align-middle ${
                    showCursor ? "opacity-100" : "opacity-0"
                  }`}
                ></span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="absolute inset-0 w-full opacity-0"
                  autoFocus
                  spellCheck={false}
                />
              </div>
            </div>

            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalCard;
