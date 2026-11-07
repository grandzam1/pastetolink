(function () {
  const WARN_LEN = 2000;     // link length that triggers a "long link" note
  const MAX_LEN = 30000;     // link length we refuse to create

  const $ = (id) => document.getElementById(id);
  const screens = ["create", "view", "invalid"];

  function show(name) {
    screens.forEach((s) => $(s).classList.toggle("hidden", s !== name));
  }

  function baseUrl() {
    return location.origin === "null"
      ? location.href.split("#")[0]
      : location.origin + location.pathname;
  }

  async function copy(text, btn, label) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const t = document.createElement("textarea");
      t.value = text;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = label), 2000);
  }

  /* ---------- Create screen ---------- */
  const input = $("input");
  const createBtn = $("createBtn");

  function resetCreate() {
    input.value = "";
    updateCounter();
    $("form").classList.remove("hidden");
    $("result").classList.add("hidden");
    $("createError").classList.add("hidden");
  }

  function updateCounter() {
    const n = input.value.length;
    $("counter").textContent = n.toLocaleString() + " characters";
    createBtn.disabled = n === 0;
  }

  input.addEventListener("input", updateCounter);

  createBtn.addEventListener("click", async () => {
    const err = $("createError");
    err.classList.add("hidden");
    createBtn.disabled = true;
    try {
      const data = await Codec.encode(input.value);
      const link = baseUrl() + "#" + data;
      if (link.length > MAX_LEN) {
        err.textContent = "Text is too large for a link. Try shortening it.";
        err.classList.remove("hidden");
        return;
      }
      $("linkOut").value = link;
      $("openLink").href = link;
      const badge = $("lenBadge");
      badge.textContent = link.length.toLocaleString() + " characters";
      const long = link.length > WARN_LEN;
      badge.className = "cr-badge " + (long ? "cr-badge--warn" : "cr-badge--ok");
      $("longWarn").classList.toggle("hidden", !long);
      $("form").classList.add("hidden");
      $("result").classList.remove("hidden");
    } catch (e) {
      err.textContent = "Could not create the link. Please try again.";
      err.classList.remove("hidden");
    } finally {
      createBtn.disabled = input.value.length === 0;
    }
  });

  $("copyLinkBtn").addEventListener("click", (e) =>
    copy($("linkOut").value, e.currentTarget, "Copy link")
  );
  $("linkOut").addEventListener("focus", (e) => e.target.select());
  $("anotherBtn").addEventListener("click", resetCreate);

  /* ---------- View screen ---------- */
  let currentText = "";

  $("copyTextBtn").addEventListener("click", (e) =>
    copy(currentText, e.currentTarget, "Copy text")
  );

  $("downloadBtn").addEventListener("click", () => {
    const url = URL.createObjectURL(
      new Blob([currentText], { type: "text/plain;charset=utf-8" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "text.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  function goCreate() {
    history.pushState(null, "", baseUrl());
    route();
  }
  $("newBtn").addEventListener("click", goCreate);
  $("invalidNewBtn").addEventListener("click", goCreate);

  /* ---------- Router ---------- */
  async function route() {
    const data = location.hash.slice(1);
    if (!data) {
      resetCreate();
      show("create");
      return;
    }
    try {
      currentText = await Codec.decode(data);
      // textContent only: pasted content is never treated as HTML
      $("viewText").textContent = currentText;
      show("view");
    } catch (e) {
      show("invalid");
    }
  }

  window.addEventListener("hashchange", route);
  route();
})();
