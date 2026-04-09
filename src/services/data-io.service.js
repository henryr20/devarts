/**
 * Data I/O Service
 * Handles transformation of posts data between JSON and CSV/XML/JSON formats.
 */

/**
 * Converts an array of posts to a CSV string
 * @param {Array} posts 
 * @returns {string}
 */
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

/**
 * Converts an array of posts to an XML string
 * @param {Array} posts 
 * @returns {string}
 */
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

/**
 * Parses a CSV string into an array of post objects
 * @param {string} csvText 
 * @returns {Array}
 */
export const parseCSV = (csvText) => {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, "").trim());
  const posts = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Split by comma outside quotes
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

/**
 * Parses an XML string into an array of post objects
 * @param {string} xmlText 
 * @returns {Array}
 */
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

/**
 * Triggers a file download in the browser
 * @param {string} content 
 * @param {string} fileName 
 * @param {string} contentType 
 */
export const downloadFile = (content, fileName, contentType) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};

// --- Helpers ---

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
