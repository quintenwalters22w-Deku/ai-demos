/* Review-request automation demo. All data is fictional example content. Nothing is sent. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var SHOP = "Bajada Bolt";
  var OWNER = "Ray";
  var OWNER_LINE = "(520) 555-0148"; // fictional 555 number
  var REVIEW_LINK = "bajadabolt.example/review";
  var REMINDER_SECONDS = 8;

  var JOBS = [
    { id: "j1", name: "Maria G.", first: "Maria", car: "2019 Honda CR-V", work: "Front brake pads & rotors", ro: "RO-2817" },
    { id: "j2", name: "Derek T.", first: "Derek", car: "2015 Ford F-150", work: "A/C compressor replacement", ro: "RO-2818" },
    { id: "j3", name: "Lupe R.", first: "Lupe", car: "2021 Toyota Camry", work: "60k-mile service", ro: "RO-2819" },
    { id: "j4", name: "Sam K.", first: "Sam", car: "2012 Jeep Wrangler", work: "Check-engine diagnosis + O2 sensor", ro: "RO-2820" }
  ];

  // Example month-to-date baseline (fictional)
  var stats = { sent: 37, follow: 4, reviews: 17, dist: { 5: 16, 4: 4, 3: 2, 2: 1, 1: 1 } };
  var activity = [
    ["Example: Ana P. left a 5★ public review", "Fri"],
    ["Example: Owner called Joe M. back (rated 3/5)", "Thu"],
    ["Example: Reminder sent to Chris L.", "Thu"],
    ["Example: Kim D. left a 4★ public review", "Wed"]
  ];

  var jobState = {}; // id -> "run" | label
  var run = null;    // current run {job, token, phase, timers}
  var token = 0;

  var jobList = $("#job-list"), markBtn = $("#mark-done"), hint = $("#owner-hint");
  var thread = $("#thread"), rateBar = $("#rate-bar"), countdown = $("#countdown");
  var timeline = $("#timeline"), clock = $("#sim-clock"), alertBox = $("#owner-alert");

  /* ---------- helpers ---------- */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function later(ms, fn) {
    var t = token;
    var id = setTimeout(function () { if (t === token) fn(); }, ms);
    if (run) run.timers.push(id);
    return id;
  }
  function clearRun() {
    token++;
    if (run) { run.timers.forEach(clearTimeout); if (run.tick) clearInterval(run.tick); }
  }
  function scrollThread() { thread.scrollTop = thread.scrollHeight; }
  function setClock(t) { clock.textContent = t; }

  function addBubble(dir, text, link) {
    var empty = $("#thread-empty"); if (empty) empty.remove();
    var b = el("div", "bubble " + dir);
    b.appendChild(document.createTextNode(text));
    if (link) {
      var a = el("a", "link", link);
      a.href = "#"; a.setAttribute("aria-label", "Example review page link (demo, goes nowhere)");
      a.addEventListener("click", function (e) { e.preventDefault(); });
      b.appendChild(a);
    }
    thread.appendChild(b); scrollThread();
  }
  function addStamp(text) { var empty = $("#thread-empty"); if (empty) empty.remove(); thread.appendChild(el("div", "stamp", text)); scrollThread(); }
  function shopSays(delay, text, link, after) {
    later(delay, function () {
      var t = el("div", "typing"); t.setAttribute("aria-hidden", "true");
      t.innerHTML = "<i></i><i></i><i></i>"; thread.appendChild(t); scrollThread();
      later(650, function () { t.remove(); addBubble("in", text, link); if (after) after(); });
    });
  }
  function addStep(cls, time, title, note) {
    var empty = $(".tl-empty", timeline); if (empty) empty.remove();
    var li = el("li", cls);
    li.appendChild(el("span", "tl-time", time));
    li.appendChild(el("span", "tl-title", title));
    if (note) li.appendChild(el("span", "tl-note", note));
    timeline.appendChild(li);
    setClock(time);
  }
  function logActivity(text, when) { activity.unshift([text, when]); if (activity.length > 8) activity.pop(); renderActivity(); }

  /* ---------- rendering ---------- */
  function renderJobs() {
    var checked = $("input[name=job]:checked", jobList);
    var sel = checked ? checked.value : null;
    if (!sel) { var next = JOBS.filter(function (j) { return !jobState[j.id]; })[0]; sel = next ? next.id : JOBS[0].id; }
    jobList.innerHTML = "";
    JOBS.forEach(function (j) {
      var lab = el("label", "job");
      var inp = el("input"); inp.type = "radio"; inp.name = "job"; inp.value = j.id; inp.checked = j.id === sel;
      inp.addEventListener("change", updateButton);
      var main = el("span", "job-main");
      main.appendChild(el("span", "job-name", j.name + " · " + j.car));
      main.appendChild(el("span", "job-meta", j.work + " · " + j.ro));
      var st = jobState[j.id];
      var badge = el("span", "job-status" + (st === "run" ? " run" : st ? " done" : ""), st === "run" ? "In flow" : st ? st : "Ready");
      main.appendChild(badge); lab.appendChild(inp); lab.appendChild(main);
      jobList.appendChild(lab);
    });
    updateButton();
  }
  function selectedJob() {
    var c = $("input[name=job]:checked", jobList);
    return c ? JOBS.filter(function (j) { return j.id === c.value; })[0] : null;
  }
  function updateButton() {
    var j = selectedJob();
    var busy = run && run.phase !== "done";
    markBtn.disabled = !!busy || !j || !!jobState[j.id];
    if (busy) hint.textContent = "Flow running for " + run.job.name + ". Reply on the phone, or wait for the time-lapsed reminder.";
    else if (j && jobState[j.id]) hint.textContent = j.name + " was already asked. Repeat asks are skipped automatically. Pick another job or reset the demo.";
    else hint.textContent = "Nothing for the shop to type. The flow starts on its own when a job is closed.";
  }

  function bump(id, val) { var n = $(id); if (n.textContent !== String(val)) { n.textContent = val; n.classList.remove("bump"); void n.offsetWidth; n.classList.add("bump"); } }
  function renderStats() {
    var total = 0, sum = 0;
    for (var r = 1; r <= 5; r++) { total += stats.dist[r]; sum += r * stats.dist[r]; }
    bump("#s-sent", stats.sent);
    bump("#s-ratings", total);
    bump("#s-reviews", stats.reviews);
    bump("#s-avg", total ? (sum / total).toFixed(1) : "0.0");
    bump("#s-follow", stats.follow);
    var ul = $("#breakdown"); ul.innerHTML = "";
    var max = Math.max.apply(null, [5, 4, 3, 2, 1].map(function (k) { return stats.dist[k]; })) || 1;
    [5, 4, 3, 2, 1].forEach(function (k) {
      var li = el("li");
      li.appendChild(el("span", null, k + "★"));
      var bar = el("span", "bar"); bar.setAttribute("aria-hidden", "true");
      var fill = el("span"); fill.style.width = (stats.dist[k] / max * 100) + "%"; bar.appendChild(fill);
      li.appendChild(bar);
      var c = el("span", null, String(stats.dist[k])); c.setAttribute("aria-label", stats.dist[k] + " ratings of " + k);
      li.appendChild(c); ul.appendChild(li);
    });
  }
  function renderActivity() {
    var ul = $("#activity"); ul.innerHTML = "";
    activity.forEach(function (a) { var li = el("li"); li.appendChild(el("span", null, a[0])); li.appendChild(el("span", null, a[1])); ul.appendChild(li); });
  }
  function renderROI() {
    var t = Math.max(0, parseFloat($("#roi-ticket").value) || 0);
    var j = Math.max(0, parseFloat($("#roi-jobs").value) || 0);
    var rev = Math.round(t * j);
    var mult = rev / 99;
    var line = $("#roi-line"); line.innerHTML = "";
    line.appendChild(document.createTextNode("Example: " + j + " extra job" + (j === 1 ? "" : "s") + " a month × $" + t.toLocaleString() + " average ticket = "));
    var s = el("strong", null, "$" + rev.toLocaleString() + "/mo"); line.appendChild(s);
    line.appendChild(document.createTextNode(" in added revenue vs. $99/mo for the automation" + (rev > 0 ? " (about " + mult.toFixed(1) + "× the monthly fee)." : ".")));
  }

  /* ---------- flow ---------- */
  function setStars(enabled) { $$(".stars button").forEach(function (b) { b.disabled = !enabled; }); }

  function startFlow() {
    var j = selectedJob(); if (!j || jobState[j.id]) return;
    clearRun();
    run = { job: j, phase: "start", timers: [], reminded: false, tick: null };
    jobState[j.id] = "run"; renderJobs();
    // fresh phone + timeline for this customer
    thread.innerHTML = ""; timeline.innerHTML = ""; alertBox.hidden = true; rateBar.hidden = true; countdown.textContent = "";

    addStep("ok", "Mon 3:42 PM", "Job marked done: " + j.ro, j.name + " · " + j.car + " · " + j.work);
    later(700, function () { addStep("", "Mon 3:42 PM", "Checks passed", "Mobile number on file, not opted out, not asked in the last 180 days, job not flagged."); });
    later(1500, function () { addStep("wait", "Mon 3:42 PM", "Queued for business hours", "Thank-you goes out about an hour after pickup."); });
    later(2300, function () {
      addStamp("Today 4:45 PM");
      shopSays(0, "Hi " + j.first + ", thanks for trusting " + SHOP + " with your " + j.car.replace(/^\d{4} /, "") + " today! We appreciate you. – " + OWNER + " & the crew", null, function () {
        addStep("ok", "Mon 4:45 PM", "Thank-you text sent", "Personal, short, signed by the owner.");
        stats.sent++; renderStats();
        shopSays(900, "Quick question: how did we do? Reply 1–5 (5 = great). Reply STOP to opt out.", null, function () {
          addStep("ok", "Mon 4:46 PM", "Satisfaction check sent", "“How did we do? 1–5”");
          run.phase = "await";
          rateBar.hidden = false; setStars(true);
          startCountdown();
        });
      });
    });
  }

  function startCountdown() {
    var left = REMINDER_SECONDS;
    var phaseLabel = run.reminded ? "Time-lapse: sequence ends in " : "Time-lapse: no reply → reminder in ";
    countdown.textContent = phaseLabel + left + "s";
    run.tick = setInterval(function () {
      left--;
      if (left > 0) { countdown.textContent = phaseLabel + left + "s"; return; }
      clearInterval(run.tick); run.tick = null; countdown.textContent = "";
      if (!run.reminded) sendReminder(); else endNoReply();
    }, 1000);
  }

  function sendReminder() {
    var j = run.job; run.reminded = true;
    addStep("wait", "Tue 10:00 AM", "No reply after ~18 hours", "Time-lapsed. One reminder is allowed, inside business hours.");
    addStamp("Tue 10:00 AM");
    shopSays(300, "Hi " + j.first + ", just checking in. How's the " + j.car.replace(/^\d{4} /, "") + " running? A quick 1–5 helps our small team a lot.", null, function () {
      addStep("ok", "Tue 10:00 AM", "Friendly reminder sent", "Final message. No more texts after this one.");
      startCountdown();
    });
  }

  function endNoReply() {
    var j = run.job;
    setStars(false); rateBar.hidden = true;
    addStep("", "Wed 10:00 AM", "Sequence stopped: no reply", "Two-message cap reached. " + j.first + " won't be texted again.");
    jobState[j.id] = "No reply"; logActivity("Example: " + j.name + " didn't reply, sequence stopped", "Just now");
    finish();
  }

  function onRate(r) {
    if (!run || run.phase !== "await") return;
    var j = run.job; run.phase = "rated";
    if (run.tick) { clearInterval(run.tick); run.tick = null; }
    countdown.textContent = ""; setStars(false); rateBar.hidden = true;
    var when = run.reminded ? "Tue 10:14 AM" : "Mon 5:02 PM";
    addBubble("out", String(r));
    stats.dist[r]++; renderStats();
    if (r >= 4) {
      addStep("ok", when, "Rating received: " + r + "/5", "Happy customer → send the review link.");
      shopSays(500, "Thank you, " + j.first + "! Would you share that on our review page? It takes about 30 seconds and helps a local shop more than you know:", REVIEW_LINK, function () {
        addStep("ok", when, "Review link text sent", "One tap to your review page.");
        later(1300, function () {
          addStep("ok", run.reminded ? "Tue 10:19 AM" : "Mon 5:07 PM", "Public review posted (example)", j.name + " left a " + r + "★ review. Reminder cancelled.");
          stats.reviews++; renderStats();
          jobState[j.id] = r + "★ review";
          logActivity("Example: " + j.name + " left a " + r + "★ public review", "Just now");
          finish();
        });
      });
    } else {
      addStep("warn", when, "Rating received: " + r + "/5", "Unhappy customers get a direct line to the owner first.");
      later(500, function () {
        addStep("warn", when, "Owner alerted by text", "Call " + j.name + " today. Remaining texts paused.");
        alertBox.innerHTML = "";
        alertBox.appendChild(el("strong", null, "Owner alert (example): " + j.name + " rated " + r + "/5"));
        alertBox.appendChild(el("p", null, j.car + " · " + j.work + " · " + j.ro + ". Please call today and make it right."));
        alertBox.hidden = false;
        stats.follow++; renderStats();
      });
      shopSays(900, "Sorry, " + j.first + ", it sounds like we missed the mark. " + OWNER + ", the owner, will call you today to make it right. Direct line: " + OWNER_LINE + ". You're always welcome to leave a public review too:", REVIEW_LINK, function () {
        addStep("ok", when, "Private follow-up sent, public link included", "Every customer can still post a public review. Private follow-up is an extra, not a filter.");
        jobState[j.id] = r + "/5 · owner calling";
        logActivity("Example: " + j.name + " rated " + r + "/5, owner calling back", "Just now");
        finish();
      });
    }
  }

  function finish() {
    run.phase = "done";
    var next = JOBS.filter(function (j) { return !jobState[j.id]; })[0];
    renderJobs();
    if (next) { $("input[value=" + next.id + "]", jobList).checked = true; updateButton(); }
  }

  function reset() {
    clearRun(); run = null; jobState = {};
    stats = { sent: 37, follow: 4, reviews: 17, dist: { 5: 16, 4: 4, 3: 2, 2: 1, 1: 1 } };
    thread.innerHTML = '<p class="thread-empty" id="thread-empty">No messages yet. Mark a job done to start.</p>';
    timeline.innerHTML = '<li class="tl-empty">Waiting for a job to be marked done…</li>';
    alertBox.hidden = true; rateBar.hidden = true; countdown.textContent = ""; setClock("—");
    $$("input[name=job]", jobList).forEach(function (i) { i.checked = false; });
    renderJobs(); renderStats();
  }

  /* ---------- wiring ---------- */
  markBtn.addEventListener("click", startFlow);
  $("#reset").addEventListener("click", reset);
  $$(".stars button").forEach(function (b) { b.addEventListener("click", function () { onRate(parseInt(b.getAttribute("data-r"), 10)); }); });
  $("#roi-ticket").addEventListener("input", renderROI);
  $("#roi-jobs").addEventListener("input", renderROI);

  var toggle = $(".nav-toggle"), nav = $("#site-nav");
  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open)); nav.classList.toggle("open", !open);
  });
  $$("#site-nav a").forEach(function (a) { a.addEventListener("click", function () { toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("open"); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) { toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("open"); toggle.focus(); }
  });

  renderJobs(); renderStats(); renderActivity(); renderROI();
})();
