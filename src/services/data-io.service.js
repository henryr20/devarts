import * as XLSX from 'xlsx';
import yaml from 'js-yaml';

export const postsToCSV = (posts) => {
  const headers = ["title", "content", "category", "likes", "imageUrl"];
  const rows = posts.map(post => 
    headers.map(header => {
      const val = post[header] || "";
      const stringVal = String(val).replace(/"/g, '""');
      return `"${stringVal}"`;
    }).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
};

export const postsToXML = (posts) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<posts>\n';
  posts.forEach(post => {
    xml += "  <post>\n";
    xml += `    <title>${escapeXML(post.title || "")}</title>\n`;
    xml += `    <content>${escapeXML(post.content || "")}</content>\n`;
    xml += `    <category>${escapeXML(post.category || "")}</category>\n`;
    xml += `    <likes>${post.likes || 0}</likes>\n`;
    xml += `    <imageUrl>${escapeXML(post.imageUrl || "")}</imageUrl>\n`;
    xml += "  </post>\n";
  });
  xml += "</posts>";
  return xml;
};

export const parseCSV = (csvText) => {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, "").trim());
  const posts = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
    const post = {};
    headers.forEach((header, index) => {
      let val = values[index] ? values[index].replace(/^"|"$/g, "").replace(/""/g, '"') : "";
      if (header === "likes") val = parseInt(val) || 0;
      post[header] = val;
    });
    posts.push(post);
  }
  return posts;
};

export const parseXML = (xmlText) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  const postNodes = xmlDoc.getElementsByTagName("post");
  const posts = [];

  for (let i = 0; i < postNodes.length; i++) {
    const postNode = postNodes[i];
    posts.push({
      title: getTagValue(postNode, "title"),
      content: getTagValue(postNode, "content"),
      category: getTagValue(postNode, "category"),
      likes: parseInt(getTagValue(postNode, "likes")) || 0,
      imageUrl: getTagValue(postNode, "imageUrl")
    });
  }
  return posts;
};

export const downloadFile = (content, fileName, contentType) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};

const escapeXML = (str) => {
  return str.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case '"': return "&quot;";
      case "'": return "&apos;";
      default: return c;
    }
  });
};

const getTagValue = (parent, tagName) => {
  const element = parent.getElementsByTagName(tagName)[0];
  return element ? element.textContent : "";
};

export const postsToTSV = (posts) => {
  const headers = ["title", "content", "category", "likes", "imageUrl"];
  const rows = posts.map(post => 
    headers.map(header => {
      const val = post[header] || "";
      const stringVal = String(val).replace(/\t/g, ' ').replace(/\n/g, ' ');
      return stringVal;
    }).join("\t")
  );
  return [headers.join("\t"), ...rows].join("\n");
};

export const parseTSV = (tsvText) => {
  const lines = tsvText.split(/\r?\n/).filter(line => line.trim() !== "");
  if (lines.length < 2) return [];
  const headers = lines[0].split("\t").map(h => h.trim());
  const posts = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split("\t");
    const post = {};
    headers.forEach((header, index) => {
      let val = values[index] ? values[index].trim() : "";
      if (header === "likes") val = parseInt(val) || 0;
      post[header] = val;
    });
    posts.push(post);
  }
  return posts;
};

export const postsToJSONL = (posts) => {
  return posts.map(post => JSON.stringify(post)).join("\n");
};

export const parseJSONL = (jsonlText) => {
  return jsonlText.split(/\r?\n/).filter(line => line.trim() !== "").map(line => {
    return JSON.parse(line);
  });
};

export const postsToYAML = (posts) => {
  return yaml.dump(posts);
};

export const parseYAML = (yamlText) => {
  return yaml.load(yamlText);
};

export const postsToHTML = (posts) => {
  let html = "<table border='1'>\n<thead><tr><th>title</th><th>content</th><th>category</th><th>likes</th><th>imageUrl</th></tr></thead>\n<tbody>\n";
  posts.forEach(post => {
    html += `<tr><td>${escapeXML(post.title || "")}</td><td>${escapeXML(post.content || "")}</td><td>${escapeXML(post.category || "")}</td><td>${post.likes || 0}</td><td>${escapeXML(post.imageUrl || "")}</td></tr>\n`;
  });
  html += "</tbody></table>";
  return html;
};

export const parseHTML = (htmlText) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, "text/html");
  const rows = doc.querySelectorAll("tbody tr");
  const posts = [];
  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    if (cells.length >= 5) {
      posts.push({
        title: cells[0].textContent,
        content: cells[1].textContent,
        category: cells[2].textContent,
        likes: parseInt(cells[3].textContent) || 0,
        imageUrl: cells[4].textContent === "undefined" || !cells[4].textContent ? null : cells[4].textContent 
      });
    }
  });
  return posts;
};

export const postsToMD = (posts) => {
  let md = "| title | content | category | likes | imageUrl |\n|---|---|---|---|---|\n";
  posts.forEach(post => {
    const row = [
      (post.title || "").replace(/\|/g, '\\|').replace(/\n/g, '<br>'),
      (post.content || "").replace(/\|/g, '\\|').replace(/\n/g, '<br>'),
      (post.category || "").replace(/\|/g, '\\|').replace(/\n/g, '<br>'),
      post.likes || 0,
      (post.imageUrl || "").replace(/\|/g, '\\|')
    ];
    md += `| ${row.join(" | ")} |\n`;
  });
  return md;
};

export const parseMD = (mdText) => {
  const lines = mdText.split(/\r?\n/).filter(line => line.trim().startsWith("|"));
  if (lines.length < 3) return [];
  const posts = [];
  for (let i = 2; i < lines.length; i++) {
    const cells = lines[i].split("|").slice(1, -1).map(c => c.trim().replace(/<br>/g, '\n').replace(/\\\|/g, '|'));
    if (cells.length >= 5) {
      posts.push({
        title: cells[0],
        content: cells[1],
        category: cells[2],
        likes: parseInt(cells[3]) || 0,
        imageUrl: cells[4] === "" ? null : cells[4]
      });
    }
  }
  return posts;
};

export const exportXLSXDownload = (posts, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(posts);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Posts");
  XLSX.writeFile(workbook, fileName);
};

export const parseXLSXArrayBuffer = (buffer) => {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
};
