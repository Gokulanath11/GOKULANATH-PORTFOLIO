"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // ---------- Scroll progress bar ----------
    const progressBar = document.getElementById("scrollProgress");
    function updateProgress() {
      const el = document.documentElement;
      const scrolled =
        (el.scrollTop / (el.scrollHeight - el.clientHeight || 1)) * 100;
      if (progressBar) progressBar.style.width = scrolled + "%";
    }
    window.addEventListener("scroll", updateProgress, { passive: true });

    // ---------- Hero photo parallax ----------
    const heroPhotoWrap = document.getElementById("heroPhotoWrap");
    function parallax() {
      const y = window.scrollY;
      if (heroPhotoWrap && y < window.innerHeight) {
        heroPhotoWrap.style.transform = `translateY(${y * 0.15}px)`;
      }
    }
    window.addEventListener("scroll", parallax, { passive: true });

    // ---------- Generic scroll reveal ----------
    const revealEls = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));

    // ---------- Stat counters ----------
    const counterObservers = [];
    document.querySelectorAll(".stat-num[data-count]").forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const isDecimal = el.dataset.count.includes(".");
      const counterIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const duration = 1200;
              const startTime = performance.now();
              function tick(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const val = target * eased;
                el.textContent = isDecimal ? val.toFixed(1) : Math.round(val);
                if (progress < 1) requestAnimationFrame(tick);
              }
              requestAnimationFrame(tick);
              counterIO.unobserve(el);
            }
          });
        },
        { threshold: 0.5 }
      );
      counterIO.observe(el);
      counterObservers.push(counterIO);
    });

    // ---------- Skills: detection-card reveal + staggered pills ----------
    const cardObservers = [];
    document.querySelectorAll("[data-card]").forEach((card, cardIndex) => {
      const pills = card.querySelectorAll(".pill");
      const cardIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setTimeout(() => card.classList.add("visible"), cardIndex * 90);
              pills.forEach((p, i) => {
                setTimeout(
                  () => p.classList.add("visible"),
                  cardIndex * 90 + 250 + i * 70
                );
              });
              cardIO.unobserve(card);
            }
          });
        },
        { threshold: 0.25 }
      );
      cardIO.observe(card);
      cardObservers.push(cardIO);
    });

    const skillsSection = document.querySelector(".skills");
    let skillsIO;
    if (skillsSection) {
      skillsIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              skillsSection.classList.add("scanning");
              skillsIO.unobserve(skillsSection);
            }
          });
        },
        { threshold: 0.2 }
      );
      skillsIO.observe(skillsSection);
    }

    // ---------- Academics timeline ----------
    const timelineItems = document.querySelectorAll(".timeline-item");
    const timelineIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.4 }
    );
    timelineItems.forEach((el) => timelineIO.observe(el));

    const timelineFill = document.getElementById("timelineFill");
    const timelineEl = document.getElementById("timeline");
    function updateTimelineFill() {
      if (!timelineEl || !timelineFill) return;
      const rect = timelineEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      let progress = (vh * 0.75 - rect.top) / total;
      progress = Math.max(0, Math.min(1, progress));
      timelineFill.style.height = progress * 100 + "%";
    }
    window.addEventListener("scroll", updateTimelineFill, { passive: true });
    updateTimelineFill();

    // ---------- Landmark tracker canvas (signature hero motif) ----------
    const canvas = document.getElementById("landmarkCanvas");
    let animationId;
    let resizeHandler, mouseMoveHandler, mouseLeaveHandler;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      let w, h;
      const points = [];
      const POINT_COUNT = 46;
      const MAX_DIST = 130;
      const mouse = { x: -9999, y: -9999 };

      function resize() {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
      }
      resizeHandler = resize;
      window.addEventListener("resize", resizeHandler);
      resize();

      for (let i = 0; i < POINT_COUNT; i++) {
        points.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
        });
      }

      mouseMoveHandler = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      };
      mouseLeaveHandler = () => {
        mouse.x = -9999;
        mouse.y = -9999;
      };
      window.addEventListener("mousemove", mouseMoveHandler);
      window.addEventListener("mouseleave", mouseLeaveHandler);

      function animate() {
        ctx.clearRect(0, 0, w, h);

        points.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        });

        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x,
              dy = points[i].y - points[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MAX_DIST) {
              ctx.strokeStyle = `rgba(41,232,184,${(1 - dist / MAX_DIST) * 0.16})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(points[i].x, points[i].y);
              ctx.lineTo(points[j].x, points[j].y);
              ctx.stroke();
            }
          }
          const dxm = points[i].x - mouse.x,
            dym = points[i].y - mouse.y;
          const dm = Math.sqrt(dxm * dxm + dym * dym);
          if (dm < 180) {
            ctx.strokeStyle = `rgba(255,107,74,${(1 - dm / 180) * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        points.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(41,232,184,0.55)";
          ctx.fill();
        });

        animationId = requestAnimationFrame(animate);
      }
      animate();
    }

    // ---------- Cleanup ----------
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("scroll", parallax);
      window.removeEventListener("scroll", updateTimelineFill);
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      if (mouseMoveHandler)
        window.removeEventListener("mousemove", mouseMoveHandler);
      if (mouseLeaveHandler)
        window.removeEventListener("mouseleave", mouseLeaveHandler);
      if (animationId) cancelAnimationFrame(animationId);
      io.disconnect();
      counterObservers.forEach((o) => o.disconnect());
      cardObservers.forEach((o) => o.disconnect());
      if (skillsIO) skillsIO.disconnect();
      timelineIO.disconnect();
    };
  }, []);

  return (
    <>
      <div className="noise"></div>
      <div id="scrollProgress"></div>

      <nav>
        <div className="logo">
          GK<span>.dev</span>
        </div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#academics">Academics</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#achievements">Achievements</a>
        </div>
        <a href="#contact" className="nav-cta">
          Let&apos;s talk
        </a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <canvas id="landmarkCanvas"></canvas>
        <div className="hero-grid">
          <div>
            <div className="eyebrow">
              <span className="dot"></span> AVAILABLE FOR SOFTWARE DEV ROLES ·
              COIMBATORE, IN
            </div>
            <h1 className="title">
              <div className="line">
                <span>Gokulanath K —</span>
              </div>
              <div className="line">
                <span>building machines</span>
              </div>
              <div className="line">
                <span>that see &amp; respond.</span>
              </div>
            </h1>
            <p className="hero-desc">
              Software developer specializing in computer vision and
              human-computer interaction — real-time face recognition,
              gesture control, and assistive tech that gives people without
              conventional mobility a way to communicate.
            </p>
            <div className="hero-actions">
              <a href="#projects" className="btn-primary">
                View Projects →
              </a>
              {/* Drop your final resume PDF at /public/resume.pdf after deploying */}
              <a href="/resume.pdf" download className="btn-ghost">
                ↓ Download Résumé
              </a>
            </div>
          </div>
          <div className="hero-photo-wrap" id="heroPhotoWrap">
            <img className="hero-photo" src="/profile.jpg" alt="Gokulanath K" />
            <div className="coord-tag c1">x:0.482 y:0.317</div>
            <div className="coord-tag c2">conf: 0.97</div>
            <div className="coord-tag c3">tracking...</div>
          </div>
        </div>
        <div className="scroll-cue">
          <div className="bar"></div>SCROLL
        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="section-head reveal">
          <div className="section-num">01 / ABOUT</div>
          <div className="section-title">Fresher on paper, not in practice.</div>
        </div>
        <div className="about-grid">
          <div className="about-text reveal-left">
            <p>
              I&apos;m an <strong>MCA student</strong> at Hindusthan College
              of Arts and Science, but most of what I know came from shipping
              things nobody assigned me — a face recognition system that
              registers new users without retraining, a mouse you control
              with hand gestures, a communication tool built from nothing but
              a webcam and an eye blink.
            </p>
            <p>
              My focus is <strong>computer vision and assistive interaction</strong> —
              I like problems where the machine has to understand a person
              who can&apos;t use a keyboard, and where accuracy actually
              matters to someone&apos;s day.
            </p>
            <p>
              Core stack:{" "}
              <strong>Python, OpenCV, MediaPipe, Flask, scikit-learn</strong>{" "}
              — with Java and SQL underneath. Fluent in Tamil and English.
            </p>
          </div>
          <div className="stat-grid reveal-right">
            <div className="stat">
              <div className="stat-num" data-count="7.9">
                0
              </div>
              <div className="stat-label">CGPA — MCA, 2025–Present</div>
            </div>
            <div className="stat">
              <div className="stat-num" data-count="4">
                0
              </div>
              <div className="stat-label">
                CV / assistive-tech projects shipped
              </div>
            </div>
            <div className="stat">
              <div className="stat-num" data-count="1">
                0
              </div>
              <div className="stat-label">
                Published research paper — CAIT 2026
              </div>
            </div>
            <div className="stat">
              <div className="stat-num">🏆</div>
              <div className="stat-label">Best Idea Award — SIH 2025</div>
            </div>
          </div>
        </div>
      </section>

      {/* ACADEMICS */}
      <section className="academics" id="academics">
        <div className="section-head reveal">
          <div className="section-num">02 / ACADEMICS</div>
          <div className="section-title">Four stages, one straight line.</div>
        </div>
        <div className="timeline" id="timeline">
          <div className="timeline-track">
            <div className="timeline-track-fill" id="timelineFill"></div>
          </div>

          <div className="timeline-item reveal">
            <div className="timeline-node"></div>
            <div className="timeline-period">2025 — PRESENT</div>
            <div className="timeline-degree">
              Master of Computer Applications (MCA)
            </div>
            <div className="timeline-school">
              Hindusthan College of Arts and Science
            </div>
            <div className="timeline-extra">CGPA: 7.9</div>
          </div>

          <div className="timeline-item reveal">
            <div className="timeline-node"></div>
            <div className="timeline-period">2022 — 2025</div>
            <div className="timeline-degree">
              Bachelor of Computer Applications (BCA)
            </div>
            <div className="timeline-school">
              Hindusthan College of Arts and Science
            </div>
          </div>

          <div className="timeline-item reveal">
            <div className="timeline-node"></div>
            <div className="timeline-period">2021 — 2022</div>
            <div className="timeline-degree">Higher Secondary (12th)</div>
            <div className="timeline-school">
              NM Matriculation Hr. Sec. School
            </div>
          </div>

          <div className="timeline-item reveal">
            <div className="timeline-node"></div>
            <div className="timeline-period">2019 — 2020</div>
            <div className="timeline-degree">Secondary School (10th)</div>
            <div className="timeline-school">
              Kalaimagal Matriculation Hr. Sec. School
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="skills" id="skills">
        <div className="scan-beam"></div>
        <div className="section-head reveal">
          <div className="section-num">03 / SKILLS</div>
          <div className="section-title">The toolkit behind the projects.</div>
        </div>
        <div className="skills-grid">
          <div className="skill-card" data-card="">
            <span className="corner-tl"></span>
            <span className="corner-br"></span>
            <div className="skill-card-label">
              <span className="idx">[01]</span> Languages &amp; Data
            </div>
            <div className="pill-row" data-pills="">
              <span className="pill">Python</span>
              <span className="pill">Java</span>
              <span className="pill">SQL</span>
            </div>
          </div>
          <div className="skill-card" data-card="">
            <span className="corner-tl"></span>
            <span className="corner-br"></span>
            <div className="skill-card-label">
              <span className="idx">[02]</span> Computer Vision &amp; ML
            </div>
            <div className="pill-row" data-pills="">
              <span className="pill">OpenCV</span>
              <span className="pill">MediaPipe</span>
              <span className="pill">scikit-learn</span>
              <span className="pill">Computer Vision</span>
              <span className="pill">Pose Estimation</span>
            </div>
          </div>
          <div className="skill-card" data-card="">
            <span className="corner-tl"></span>
            <span className="corner-br"></span>
            <div className="skill-card-label">
              <span className="idx">[03]</span> Working Style
            </div>
            <div className="pill-row" data-pills="">
              <span className="pill">Teamwork</span>
              <span className="pill">Communication</span>
              <span className="pill">Problem Solving</span>
              <span className="pill">Adaptability</span>
              <span className="pill">Time Management</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="projects" id="projects">
        <div className="section-head reveal">
          <div className="section-num">04 / PROJECTS</div>
          <div className="section-title">
            Four systems, one theme: machines that understand people.
          </div>
        </div>
        <div className="project-list">
          <div className="project-card reveal-scale">
            <div>
              <span className="featured-badge">FEATURED</span>
              <div className="project-tag">FULL-STACK · AI HEALTHCARE</div>
              <div className="project-title">
                RehabCare <span className="arrow">→</span>
              </div>
              <div className="project-stack">
                Python · Flask · OpenCV · MediaPipe · scikit-learn
              </div>
            </div>
            <div className="project-desc">
              AI-powered digital rehabilitation platform that scores patient
              exercise form in real time from a live webcam or uploaded video
              — using pose estimation to count reps and grade technique
              automatically. Built two independent hands-free communication
              channels (hand-gesture recognition and eye-blink Morse code) so
              patients with limited mobility or speech can actively respond
              to their care team. A trained model recommends next-session
              difficulty from patient progress, and a live Telegram bot
              bridges doctors and caregivers through a secure, role-based
              monitoring dashboard.
            </div>
          </div>

          <div className="project-card reveal">
            <div>
              <div className="project-tag">COMPUTER VISION</div>
              <div className="project-title">
                Face Recognition with Dynamic User Registration{" "}
                <span className="arrow">→</span>
              </div>
              <div className="project-stack">
                Python · OpenCV · Face Recognition
              </div>
            </div>
            <div className="project-desc">
              Real-time face recognition system that identifies known users
              from a live video feed and lets new users register on the fly
              — without retraining the whole system or restarting the
              application. Captures and encodes new faces at runtime for
              instant future recognition.
            </div>
          </div>

          <div className="project-card reveal">
            <div>
              <div className="project-tag">TOUCHLESS INTERACTION</div>
              <div className="project-title">
                Real-Time Hand Gesture Based Mouse Control{" "}
                <span className="arrow">→</span>
              </div>
              <div className="project-stack">Python · OpenCV · MediaPipe</div>
            </div>
            <div className="project-desc">
              A touchless input system that tracks hand landmarks through a
              webcam and maps distinct finger gestures to cursor movement,
              left click, right click, double click, click-and-drag, and
              window minimize/maximize — enabling fully hands-free computer
              control.
            </div>
          </div>

          <div className="project-card reveal">
            <div>
              <div className="project-tag">ASSISTIVE TECH</div>
              <div className="project-title">
                Eye Blink Based Communication System{" "}
                <span className="arrow">→</span>
              </div>
              <div className="project-stack">
                Python · OpenCV · Eye Aspect Ratio Detection
              </div>
            </div>
            <div className="project-desc">
              An assistive communication tool for individuals with paralysis,
              using webcam-based eye blink detection to interpret intentional
              blink patterns and convert them into pre-defined messages —
              giving users a low-cost way to communicate without physical
              movement.
            </div>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="achievements" id="achievements">
        <div className="section-head reveal">
          <div className="section-num">05 / RECOGNITION</div>
          <div className="section-title">
            Noticed by people who see a lot of projects.
          </div>
        </div>
        <div className="ach-list reveal">
          <div className="ach-item">
            <div className="ach-icon">[01]</div>
            <p>
              <strong>Best Idea Award</strong> — Inter-College Level round,
              Smart India Hackathon 2025.
            </p>
          </div>
          <div className="ach-item">
            <div className="ach-icon">[02]</div>
            <p>
              Published research paper,{" "}
              <strong>
                &quot;Customized Eye Blink Based Communication System for
                Paralysed Person,&quot;
              </strong>{" "}
              at the 7th International Conference (CAIT 2026).
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <div className="section-num reveal" style={{ textAlign: "center" }}>
          06 / CONTACT
        </div>
        <div className="section-title reveal">
          Let&apos;s build something
          <br />
          that understands people.
        </div>
        <p className="contact-desc reveal">
          Open to software developer roles, internships, and collaborations
          in computer vision or assistive tech.
        </p>
        <a href="mailto:gokulanath11@gmail.com" className="contact-email reveal">
          gokulanath11@gmail.com
        </a>
        <div className="social-row reveal">
          <a href="https://linkedin.com/in/gokulanath-k" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </section>

      <footer>
        <div>© 2026 Gokulanath K</div>
        <div>Coimbatore, Tamil Nadu, India</div>
      </footer>
    </>
  );
}
