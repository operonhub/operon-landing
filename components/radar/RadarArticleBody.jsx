import React from "react";

function renderInline(text, keyPrefix) {
  const pattern = /(\[[^\]]+\]\((?:https?:\/\/|\/)[^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;
  const parts = text.split(pattern).filter(Boolean);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    const link = part.match(/^\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)]+)\)$/);
    if (link) {
      const external = /^https?:\/\//.test(link[2]);
      return <a key={key} href={link[2]} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{link[1]}</a>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={key}>{part.slice(1, -1)}</code>;
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

function renderTextBlocks(lines, keyPrefix) {
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      const Tag = heading[1].length === 2 ? "h2" : "h3";
      const id = heading[2].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      blocks.push(<Tag key={`${keyPrefix}-${index}`} id={id}>{renderInline(heading[2], `${keyPrefix}-${index}`)}</Tag>);
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }
      blocks.push(<ul key={`${keyPrefix}-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item, `${keyPrefix}-ul-${itemIndex}`)}</li>)}</ul>);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push(<ol key={`${keyPrefix}-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item, `${keyPrefix}-ol-${itemIndex}`)}</li>)}</ol>);
      continue;
    }

    if (line.startsWith("> ")) {
      const quote = [];
      while (index < lines.length && lines[index].trim().startsWith("> ")) {
        quote.push(lines[index].trim().slice(2));
        index += 1;
      }
      blocks.push(<blockquote key={`${keyPrefix}-${index}`}>{renderInline(quote.join(" "), `${keyPrefix}-quote`)}</blockquote>);
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{2,3})\s+|^[-*]\s+|^\d+\.\s+|^>\s+|^:::/.test(lines[index].trim())
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(<p key={`${keyPrefix}-${index}`}>{renderInline(paragraph.join(" "), `${keyPrefix}-p-${index}`)}</p>);
  }

  return blocks;
}

export default function RadarArticleBody({ body }) {
  const lines = body.split(/\r?\n/);
  const content = [];
  let cursor = 0;
  let block = 0;

  while (cursor < lines.length) {
    if (lines[cursor].trim() === ":::operon") {
      const end = lines.findIndex((line, index) => index > cursor && line.trim() === ":::");
      if (end === -1) throw new Error("[Radar] Falta cerrar un bloque :::operon.");
      content.push(
        <aside key={`take-${block}`} className="radar-take" aria-label="La lectura de Operon">
          <div className="radar-take-label">La lectura de Operon</div>
          {renderTextBlocks(lines.slice(cursor + 1, end), `take-${block}`)}
        </aside>
      );
      cursor = end + 1;
      block += 1;
      continue;
    }

    const nextTake = lines.findIndex((line, index) => index >= cursor && line.trim() === ":::operon");
    const end = nextTake === -1 ? lines.length : nextTake;
    content.push(...renderTextBlocks(lines.slice(cursor, end), `body-${block}`));
    cursor = end;
    block += 1;
  }

  return <div className="radar-body">{content}</div>;
}
