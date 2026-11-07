/*
  Cloud: reads and writes the notes list in one JSONBin bin.

  Reads need no key when the bin is public. Writes need the key from
  config.js. Settings come from config.public.js (BIN_ID) and
  config.js (KEY, KEY_TYPE).
*/
(function (root) {
  const API = "https://api.jsonbin.io/v3/b/";
  const pub = () => root.APP_CONFIG || {};
  const sec = () => root.APP_SECRET || {};

  function binId() {
    const id = String(pub().BIN_ID || "").trim();
    return /^[A-Za-z0-9]{10,40}$/.test(id) ? id : "";
  }

  function key() {
    const k = String(sec().KEY || "").trim();
    return !k || /PASTE_/.test(k) ? "" : k;
  }

  const enabled = () => !!binId();
  const canWrite = () => enabled() && !!key();

  // Which header carries the key. If JSONBin rejects it, try the other one.
  let header = sec().KEY_TYPE === "master" ? "X-Master-Key" : "X-Access-Key";

  async function send(method, body, useKey, h) {
    const headers = { "Content-Type": "application/json" };
    if (useKey && key()) headers[h] = key();
    return fetch(API + binId() + (method === "GET" ? "/latest" : ""), {
      method,
      headers,
      body,
    });
  }

  async function call(method, body, useKey) {
    let res = await send(method, body, useKey, header);
    if ((res.status === 401 || res.status === 403) && useKey && key()) {
      const other = header === "X-Master-Key" ? "X-Access-Key" : "X-Master-Key";
      const retry = await send(method, body, true, other);
      if (retry.ok) header = other;
      res = retry.ok ? retry : res;
    }
    return res;
  }

  function toList(json) {
    const rec = json && json.record !== undefined ? json.record : json;
    return Array.isArray(rec) ? rec : (rec && rec.notes) || [];
  }

  async function read() {
    let res = await call("GET", null, !!key());
    if (!res.ok && key()) res = await call("GET", null, false); // public bin, bad key
    if (!res.ok) throw new Error("read " + res.status);
    return toList(await res.json());
  }

  async function write(notes) {
    const res = await call("PUT", JSON.stringify({ version: 1, notes }), true);
    if (!res.ok) throw new Error("write " + res.status);
  }

  root.Cloud = { enabled, canWrite, read, write };
})(typeof globalThis !== "undefined" ? globalThis : window);
