import React, { useState } from "react";
import { ClipboardCopyIcon, CheckIcon } from "@radix-ui/react-icons";

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="relative bg-gray-100 text-black rounded p-4">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 text-black rounded"
      >
        {isCopied ? (
          <CheckIcon className="w-5 h-5" />
        ) : (
          <ClipboardCopyIcon className="w-5 h-5" />
        )}
      </button>
      <pre className="overflow-x-auto py-6">
        <code className="break-all whitespace-pre-wrap">{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
