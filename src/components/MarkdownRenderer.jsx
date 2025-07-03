import React from "react";

// Componente simple para renderizar markdown a HTML
export default function MarkdownRenderer({ content }) {
  const convertMarkdownToHTML = (markdown) => {
    if (!markdown) return "";

    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // Bold
    html = html.replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>");

    // Italic
    html = html.replace(/\*(.*)\*/gim, "<em>$1</em>");

    // Links
    html = html.replace(
      /\[([^\]]*)\]\(([^\)]*)\)/gim,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );

    // Line breaks
    html = html.replace(/\n\n/gim, "</p><p>");
    html = html.replace(/\n/gim, "<br>");

    // Lists
    html = html.replace(/^\- (.*$)/gim, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

    // Wrap in paragraphs
    if (
      !html.startsWith("<h") &&
      !html.startsWith("<ul") &&
      !html.startsWith("<ol")
    ) {
      html = "<p>" + html + "</p>";
    }

    return html;
  };

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{
        __html: convertMarkdownToHTML(content),
      }}
      style={{
        lineHeight: "1.7",
        fontSize: "1.1rem",
      }}
    />
  );
}
