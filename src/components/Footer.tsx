const Footer = () => {
  return (
    <footer className="mt-8 py-4 text-center text-gray-600 text-sm">
      <p className="flex items-center justify-center gap-2 mb-2">
        Estimates are prepared using the standard SCC report findings.
        <a
          href="https://github.com/boyter/scc/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-800 underline"
        >
          SCC Documentation
        </a>
        or install using:
        <code className="bg-gray-100 px-2 py-1 rounded">
          go install github.com/boyter/scc/v3@latest
        </code>
      </p>
      <div className="flex items-center justify-center gap-4">
        <a
          href="https://scc-report-evaluation.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-800 underline"
        >
          Live Demo
        </a>
        <a
          href="https://github.com/bar181/scc-report-evaluation"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-800 underline"
        >
          GitHub Repository
        </a>
      </div>
    </footer>
  );
};

export default Footer;