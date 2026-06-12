#!/usr/bin/env node
/**
 * Lepidus MCP server — zero-dependency stdio Model Context Protocol server.
 *
 * Lets any MCP client (Claude Code, Cursor, etc.) query the design system:
 *   list_components  — every component with a one-liner
 *   get_component    — props, plain-CSS classes, import line for one component
 *   search_tokens    — find design-token CSS variables by name/value
 *   get_usage_rules  — the llms.txt rules document
 *
 * Wire-up (already in this repo's .mcp.json):
 *   { "mcpServers": { "lepidus": { "command": "node",
 *       "args": ["packages/mcp/server.mjs"] } } }
 *
 * Data sources are build artifacts — run `npm run manifest` and `npm run
 * tokens` after changing components or tokens.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

function load(rel) {
  return readFileSync(join(root, rel), 'utf8');
}
const manifest = JSON.parse(load('public/component-manifest.json'));
const tokensCss = load('packages/tokens/build/css/tokens.css');
const rules = load('public/llms.txt');

/* token index: { name, value, theme } */
const tokenIndex = [];
{
  let theme = 'light';
  for (const line of tokensCss.split('\n')) {
    const themeMatch = line.match(/\[data-theme="([a-z]+)"\]/);
    if (themeMatch) theme = themeMatch[1];
    else if (/^:root/.test(line)) theme = 'light';
    const decl = line.match(/^\s*(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/);
    if (decl) tokenIndex.push({ name: decl[1], value: decl[2].trim(), theme });
  }
}

const TOOLS = [
  {
    name: 'list_components',
    description:
      'List every Lepidus design-system component with availability (React and/or plain CSS).',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_component',
    description:
      'Full reference for one component: React props (types, defaults, descriptions), plain-CSS class inventory, import line.',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string', description: 'Component name, e.g. "Button"' } },
      required: ['name'],
      additionalProperties: false,
    },
  },
  {
    name: 'search_tokens',
    description:
      'Search Lepidus design-token CSS variables by substring of name or value (e.g. "button-primary", "#1c4599", "radius"). Returns per-theme values.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Substring to match' } },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_usage_rules',
    description:
      'The Lepidus usage rules for generated code (llms.txt): class conventions, token rules, theming, accessibility patterns.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
];

function callTool(name, args) {
  switch (name) {
    case 'list_components':
      return manifest.components
        .map(
          (c) =>
            `${c.name} — ${c.plainCss ? `plain CSS (${c.plainCss.block}) + React` : 'React only'}${
              c.description ? ` — ${c.description}` : ''
            }`
        )
        .join('\n');
    case 'get_component': {
      const q = String(args.name || '').toLowerCase();
      const comp = manifest.components.find((c) => c.name.toLowerCase() === q);
      if (!comp) {
        const close = manifest.components
          .filter((c) => c.name.toLowerCase().includes(q))
          .map((c) => c.name);
        return `Component "${args.name}" not found.${close.length ? ` Did you mean: ${close.join(', ')}` : ''}`;
      }
      return JSON.stringify(comp, null, 2);
    }
    case 'search_tokens': {
      const q = String(args.query || '').toLowerCase();
      const hits = tokenIndex.filter(
        (t) => t.name.toLowerCase().includes(q) || t.value.toLowerCase().includes(q)
      );
      if (!hits.length) return `No tokens match "${args.query}".`;
      return hits
        .slice(0, 80)
        .map((t) => `${t.name}: ${t.value}  [${t.theme}]`)
        .join('\n') + (hits.length > 80 ? `\n…and ${hits.length - 80} more` : '');
    }
    case 'get_usage_rules':
      return rules;
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

/* --- newline-delimited JSON-RPC over stdio ------------------------------- */

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n');
}

const rl = createInterface({ input: process.stdin });
rl.on('line', (line) => {
  line = line.trim();
  if (!line) return;
  let req;
  try {
    req = JSON.parse(line);
  } catch {
    return;
  }
  const { id, method, params } = req;
  try {
    if (method === 'initialize') {
      send({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: params?.protocolVersion || '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'lepidus-design-system', version: '1.0.0' },
        },
      });
    } else if (method === 'tools/list') {
      send({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
    } else if (method === 'tools/call') {
      const text = callTool(params.name, params.arguments ?? {});
      send({
        jsonrpc: '2.0',
        id,
        result: { content: [{ type: 'text', text }] },
      });
    } else if (id !== undefined) {
      // unknown request — answer so the client doesn't hang; notifications are ignored
      send({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
    }
  } catch (err) {
    if (id !== undefined) {
      send({ jsonrpc: '2.0', id, error: { code: -32603, message: String(err.message || err) } });
    }
  }
});
