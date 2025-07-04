// Panel de Administración hgaruna - JavaScript

class AdminPanel {
  constructor() {
    this.currentUser = null;
    this.articles = [];
    this.isLoggedIn = false;

    this.init();
  }

  init() {
    this.showLoading();
    this.initializeAuth0();
    this.bindEvents();
    this.loadArticles();

    // Simular tiempo de carga
    setTimeout(() => {
      this.hideLoading();
      this.checkAuthState();
    }, 2000);
  }

  // Auth0 Integration
  initializeAuth0() {
    console.log('🔍 Inicializando Auth0...');

    // Listen for Auth0 login success event
    window.addEventListener('auth0LoginSuccess', (event) => {
      const { user, token } = event.detail;
      this.handleLogin(user, token);
    });

    // Check if Auth0 manager is available
    if (window.auth0Manager) {
      console.log('✅ Auth0 Manager encontrado');
    } else {
      console.error('❌ Auth0 Manager no está disponible');
    }
  }

  handleLogin(user, token = null) {
    this.currentUser = user;
    this.accessToken = token;
    this.isLoggedIn = true;
    this.showDashboard();
    this.updateUserInfo(user);
    this.trackEvent("admin_login", { user_id: user.sub });
  }

  handleLogout() {
    this.currentUser = null;
    this.isLoggedIn = false;
    this.showLogin();
    this.trackEvent("admin_logout");
  }

  async checkAuthState() {
    console.log('🔍 Verificando estado de autenticación...');

    if (window.auth0Manager) {
      const isAuthenticated = await window.auth0Manager.isAuthenticated();
      console.log('Usuario autenticado:', isAuthenticated);

      if (isAuthenticated) {
        const user = await window.auth0Manager.getUser();
        const token = await window.auth0Manager.getToken();
        console.log('Usuario actual:', user);

      if (user) {
        console.log('✅ Usuario autenticado encontrado');
        this.handleLogin(user);
      } else {
        console.log('ℹ️ No hay usuario autenticado');
        this.showLogin();
      }
    } else {
      console.error('❌ Netlify Identity no está disponible para verificar estado');
      this.showLogin();
    }
  }

  // UI State Management
  showLoading() {
    document.getElementById("loading-screen").style.display = "flex";
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("dashboard").style.display = "none";
  }

  hideLoading() {
    document.getElementById("loading-screen").style.display = "none";
  }

  showLogin() {
    this.hideLoading();
    document.getElementById("login-screen").style.display = "flex";
    document.getElementById("dashboard").style.display = "none";
  }

  showDashboard() {
    this.hideLoading();
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("dashboard").style.display = "flex";
    this.renderDashboard();
  }

  updateUserInfo(user) {
    const avatar = document.getElementById("user-avatar");
    const name = document.getElementById("user-name");
    const email = document.getElementById("user-email");

    avatar.src =
      user.user_metadata?.avatar_url || "/logos-he-imagenes/logo3.png";
    name.textContent = user.user_metadata?.full_name || "Admin";
    email.textContent = user.email;
  }

  // Event Bindings
  bindEvents() {
    // Login buttons
    document
      .getElementById("netlify-login-btn")
      ?.addEventListener("click", () => {
        console.log('🖱️ Botón de login clickeado');
        if (window.netlifyIdentity && typeof window.netlifyIdentity.open === 'function') {
          console.log('✅ Abriendo widget de login...');
          window.netlifyIdentity.open();
        } else {
          console.error('❌ No se puede abrir widget: netlifyIdentity.open no disponible');
          alert('Error: No se puede abrir el widget de login. Por favor, recarga la página.');
        }
      });

    document
      .getElementById("google-login-btn")
      ?.addEventListener("click", () => {
        console.log('🖱️ Botón de Google clickeado');
        if (window.netlifyIdentity && typeof window.netlifyIdentity.open === 'function') {
          window.netlifyIdentity.open("signup");
        } else {
          console.error('❌ No se puede abrir widget: netlifyIdentity.open no disponible');
          alert('Error: No se puede abrir el widget de login. Por favor, recarga la página.');
        }
      });

    document
      .getElementById("github-login-btn")
      ?.addEventListener("click", () => {
        console.log('🖱️ Botón de GitHub clickeado');
        if (window.netlifyIdentity && typeof window.netlifyIdentity.open === 'function') {
          window.netlifyIdentity.open("signup");
        } else {
          console.error('❌ No se puede abrir widget: netlifyIdentity.open no disponible');
          alert('Error: No se puede abrir el widget de login. Por favor, recarga la página.');
        }
      });

    // Logout button
    document.getElementById("logout-btn")?.addEventListener("click", () => {
      window.netlifyIdentity?.logout();
    });

    // Navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        this.showSection(section);
      });
    });

    document.querySelectorAll("[data-section]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (btn.tagName !== "A") {
          e.preventDefault();
          const section = btn.dataset.section;
          this.showSection(section);
        }
      });
    });

    // Sidebar toggle
    document.querySelector(".sidebar-toggle")?.addEventListener("click", () => {
      document.querySelector(".sidebar").classList.toggle("open");
    });

    // Article form
    document.getElementById("article-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleArticleSubmit();
    });

    // Preview button
    document.getElementById("preview-btn")?.addEventListener("click", () => {
      this.showArticlePreview();
    });

    // Generate static pages
    document
      .getElementById("generate-static-btn")
      ?.addEventListener("click", () => {
        this.generateStaticPages();
      });

    // SEO functions
    document
      .getElementById("generate-sitemap-btn")
      ?.addEventListener("click", () => {
        this.generateSitemap();
      });

    document
      .getElementById("generate-robots-btn")
      ?.addEventListener("click", () => {
        this.generateRobotsTxt();
      });

    // LinkedIn events
    document
      .getElementById("connect-linkedin-btn")
      ?.addEventListener("click", () => {
        this.connectLinkedIn();
      });

    document
      .getElementById("disconnect-linkedin-btn")
      ?.addEventListener("click", () => {
        this.disconnectLinkedIn();
      });

    document
      .getElementById("linkedin-post-form")
      ?.addEventListener("submit", (e) => {
        e.preventDefault();
        this.publishToLinkedIn();
      });

    document
      .getElementById("preview-linkedin-btn")
      ?.addEventListener("click", () => {
        this.previewLinkedInPost();
      });

    document
      .getElementById("linkedin-post-text")
      ?.addEventListener("input", (e) => {
        this.updateCharCount(e.target);
      });

    document
      .getElementById("linkedin-article-select")
      ?.addEventListener("change", (e) => {
        this.populateLinkedInPost(e.target.value);
      });
  }

  // Navigation
  showSection(sectionName) {
    // Update nav active state
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });
    document
      .querySelector(`[data-section="${sectionName}"]`)
      .classList.add("active");

    // Update page title
    const titles = {
      dashboard: "Dashboard",
      articles: "Gestión de Artículos",
      "new-article": "Nuevo Artículo",
      linkedin: "Publicaciones LinkedIn",
      analytics: "Analytics",
      settings: "Configuración",
    };
    document.getElementById("page-title").textContent = titles[sectionName];

    // Show section
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active");
    });
    document.getElementById(`${sectionName}-section`).classList.add("active");

    // Load section-specific data
    this.loadSectionData(sectionName);
  }

  loadSectionData(sectionName) {
    switch (sectionName) {
      case "dashboard":
        this.renderDashboard();
        break;
      case "articles":
        this.renderArticlesGrid();
        break;
      case "linkedin":
        this.loadLinkedInSection();
        break;
      case "analytics":
        this.loadAnalytics();
        break;
    }
  }

  // Articles Management
  async loadArticles() {
    try {
      // Load from multiple sources
      const [localArticles, cmsArticles] = await Promise.all([
        this.loadLocalArticles(),
        this.loadCMSArticles(),
      ]);

      this.articles = [...localArticles, ...cmsArticles];
      this.updateArticleStats();
    } catch (error) {
      console.error("Error loading articles:", error);
      this.articles = this.getFallbackArticles();
    }
  }

  async loadLocalArticles() {
    try {
      const response = await fetch("/content/articles/");
      if (!response.ok) throw new Error("No local articles found");
      // This would need a directory listing or API endpoint
      return [];
    } catch (error) {
      return this.getFallbackArticles();
    }
  }

  async loadCMSArticles() {
    try {
      const response = await fetch("/.netlify/functions/get-articles");
      if (!response.ok) throw new Error("CMS articles not available");
      const data = await response.json();
      return Array.isArray(data) ? data : data.articles || [];
    } catch (error) {
      return [];
    }
  }

  getFallbackArticles() {
    return [
      {
        _id: "desarrollo-web-villa-carlos-paz",
        title: "Desarrollo Web Profesional en Villa Carlos Paz",
        description:
          "Descubre cómo el desarrollo web profesional está transformando los negocios en Villa Carlos Paz, Córdoba.",
        author: "hgaruna",
        date: "2025-01-22",
        category: "Desarrollo Web Local",
        tags: ["Villa Carlos Paz", "Desarrollo Web", "Marketing Digital"],
        image: "/logos-he-imagenes/programacion.jpeg",
        views: 1250,
      },
      {
        _id: "react-optimizacion",
        title: "Optimización de Aplicaciones React",
        description:
          "Aprende las mejores técnicas para optimizar tus aplicaciones React y mejorar el rendimiento.",
        author: "hgaruna",
        date: "2024-03-12",
        category: "Desarrollo Web",
        tags: ["React", "Optimización", "Performance"],
        image: "/logos-he-imagenes/logo3.png",
        views: 890,
      },
      {
        _id: "seo-estrategias-avanzadas",
        title: "10 Estrategias SEO Avanzadas para 2024",
        description:
          "Descubre las estrategias SEO más efectivas para mejorar el posicionamiento de tu sitio web.",
        author: "hgaruna",
        date: "2024-03-15",
        category: "Marketing Digital",
        tags: ["SEO", "Marketing Digital", "Google"],
        image: "/logos-he-imagenes/logo3.png",
        views: 1100,
      },
    ];
  }

  updateArticleStats() {
    const totalArticles = this.articles.length;
    const totalViews = this.articles.reduce(
      (sum, article) => sum + (article.views || 0),
      0,
    );

    document.getElementById("total-articles").textContent = totalArticles;
    document.getElementById("total-views").textContent =
      totalViews.toLocaleString();
  }

  renderDashboard() {
    this.renderRecentArticles();
    this.renderQuickStats();
  }

  renderRecentArticles() {
    const container = document.getElementById("recent-articles");
    const recentArticles = this.articles.slice(0, 5);

    container.innerHTML = recentArticles
      .map(
        (article) => `
      <div class="article-card" onclick="adminPanel.editArticle('${article._id}')">
        <h4>${article.title}</h4>
        <p>${article.description}</p>
        <div class="article-meta">
          <span><i class="fas fa-user"></i> ${article.author}</span>
          <span><i class="fas fa-calendar"></i> ${new Date(article.date).toLocaleDateString("es-ES")}</span>
          <span><i class="fas fa-eye"></i> ${article.views || 0} vistas</span>
        </div>
        <div class="article-tags">
          ${
            article.tags
              ?.slice(0, 3)
              .map((tag) => `<span class="tag">${tag}</span>`)
              .join("") || ""
          }
        </div>
      </div>
    `,
      )
      .join("");
  }

  renderQuickStats() {
    const todayViews = Math.floor(Math.random() * 500) + 100;
    const totalUsers = Math.floor(Math.random() * 1000) + 500;
    const pageViews = Math.floor(Math.random() * 5000) + 2000;

    document.getElementById("today-views").textContent = todayViews;
    document.getElementById("total-users").textContent =
      totalUsers.toLocaleString();
    document.getElementById("page-views").textContent =
      pageViews.toLocaleString();
  }

  renderArticlesGrid() {
    const container = document.getElementById("articles-grid");

    container.innerHTML = this.articles
      .map(
        (article) => `
      <div class="article-grid-card">
        <img src="${article.image || "/logos-he-imagenes/logo3.png"}" alt="${article.title}" class="article-image">
        <div class="article-grid-content">
          <h3>${article.title}</h3>
          <p>${article.description}</p>
          <div class="article-meta">
            <span><i class="fas fa-user"></i> ${article.author}</span>
            <span><i class="fas fa-calendar"></i> ${new Date(article.date).toLocaleDateString("es-ES")}</span>
            <span><i class="fas fa-eye"></i> ${article.views || 0}</span>
          </div>
          <div class="article-tags">
            ${
              article.tags
                ?.slice(0, 3)
                .map((tag) => `<span class="tag">${tag}</span>`)
                .join("") || ""
            }
          </div>
          <div class="article-actions">
            <button class="btn primary btn-small" onclick="adminPanel.editArticle('${article._id}')">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn secondary btn-small" onclick="adminPanel.viewArticle('${article._id}')">
              <i class="fas fa-eye"></i> Ver
            </button>
          </div>
        </div>
      </div>
    `,
      )
      .join("");
  }

  // Article Operations
  async handleArticleSubmit() {
    const formData = {
      title: document.getElementById("article-title").value,
      description: document.getElementById("article-description").value,
      category: document.getElementById("article-category").value,
      author: document.getElementById("article-author").value,
      tags: document
        .getElementById("article-tags")
        .value.split(",")
        .map((tag) => tag.trim()),
      image: document.getElementById("article-image").value,
      content: document.getElementById("article-content").value,
      date: new Date().toISOString(),
    };

    try {
      const result = await this.saveArticle(formData);
      this.showResult("Artículo guardado exitosamente", "success");
      this.clearForm();
      this.loadArticles();
      this.trackEvent("article_created", { title: formData.title });
    } catch (error) {
      this.showResult(
        "Error al guardar el artículo: " + error.message,
        "error",
      );
    }
  }

  async saveArticle(articleData) {
    // Create markdown file content
    const frontmatter = `---
title: "${articleData.title}"
description: "${articleData.description}"
date: ${articleData.date.split("T")[0]}
image: "${articleData.image || "/logos-he-imagenes/logo3.png"}"
category: "${articleData.category}"
author: "${articleData.author}"
tags: [${articleData.tags.map((tag) => `"${tag}"`).join(", ")}]
---

${articleData.content}`;

    // This would need to be implemented with Netlify Functions or Git API
    const response = await fetch("/.netlify/functions/save-article", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.currentUser?.token?.access_token}`,
      },
      body: JSON.stringify({
        filename: `${articleData.date.split("T")[0]}-${articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`,
        content: frontmatter,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save article");
    }

    return response.json();
  }

  clearForm() {
    document.getElementById("article-form").reset();
    document.getElementById("article-author").value = "hgaruna";
  }

  showResult(message, type) {
    const resultDiv = document.getElementById("article-result");
    resultDiv.textContent = message;
    resultDiv.className = `result-message ${type}`;
    resultDiv.style.display = "block";

    setTimeout(() => {
      resultDiv.style.display = "none";
    }, 5000);
  }

  editArticle(articleId) {
    const article = this.articles.find((a) => a._id === articleId);
    if (article) {
      this.showSection("new-article");
      this.populateForm(article);
    }
  }

  viewArticle(articleId) {
    window.open(`/articulos/${articleId}`, "_blank");
  }

  populateForm(article) {
    document.getElementById("article-title").value = article.title;
    document.getElementById("article-description").value = article.description;
    document.getElementById("article-category").value = article.category;
    document.getElementById("article-author").value = article.author;
    document.getElementById("article-tags").value =
      article.tags?.join(", ") || "";
    document.getElementById("article-image").value = article.image || "";
    document.getElementById("article-content").value = article.content || "";
  }

  showArticlePreview() {
    const title = document.getElementById("article-title").value;
    const content = document.getElementById("article-content").value;

    if (!title || !content) {
      alert("Por favor completa título y contenido para ver la vista previa");
      return;
    }

    // Open preview in new window
    const previewWindow = window.open("", "_blank", "width=800,height=600");
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Vista Previa: ${title}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #2563eb; }
          pre { background: #f8f9fa; padding: 15px; border-radius: 8px; overflow-x: auto; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <pre>${content}</pre>
      </body>
      </html>
    `);
  }

  // Static Page Generation
  async generateStaticPages() {
    try {
      const response = await fetch(
        "/.netlify/functions/generate-static-articles",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.currentUser?.token?.access_token}`,
          },
        },
      );

      if (response.ok) {
        this.showResult("Páginas estáticas generadas exitosamente", "success");
        this.trackEvent("static_pages_generated");

        // Regenerar sitemap automáticamente después de generar páginas
        setTimeout(() => {
          this.generateSitemap(false); // false = no mostrar mensaje separado
        }, 1000);
      } else {
        throw new Error("Error en la generación");
      }
    } catch (error) {
      this.showResult(
        "Error al generar páginas estáticas: " + error.message,
        "error",
      );
    }
  }

  // SEO Functions
  async generateSitemap(showMessage = true) {
    try {
      const response = await fetch("/.netlify/functions/generate-sitemap", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.currentUser?.token?.access_token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (showMessage) {
          this.showResult("Sitemap generado exitosamente", "success");
        }
        this.trackEvent("sitemap_generated");

        // Actualizar enlaces en la interfaz
        this.updateSEOLinks();
      } else {
        throw new Error("Error en la generación del sitemap");
      }
    } catch (error) {
      this.showResult("Error al generar sitemap: " + error.message, "error");
    }
  }

  async generateRobotsTxt() {
    try {
      const response = await fetch(
        "/.netlify/functions/generate-sitemap?action=robots",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.currentUser?.token?.access_token}`,
          },
        },
      );

      if (response.ok) {
        this.showResult("Robots.txt generado exitosamente", "success");
        this.trackEvent("robots_generated");
        this.updateSEOLinks();
      } else {
        throw new Error("Error en la generación de robots.txt");
      }
    } catch (error) {
      this.showResult("Error al generar robots.txt: " + error.message, "error");
    }
  }

  updateSEOLinks() {
    // Actualizar timestamp en los enlaces para evitar cache
    const timestamp = Date.now();
    const sitemapLink = document.querySelector('a[href="/sitemap.xml"]');
    const robotsLink = document.querySelector('a[href="/robots.txt"]');

    if (sitemapLink) {
      sitemapLink.href = `/sitemap.xml?t=${timestamp}`;
    }
    if (robotsLink) {
      robotsLink.href = `/robots.txt?t=${timestamp}`;
    }
  }

  // Analytics Integration
  loadAnalytics() {
    const analyticsId =
      document.getElementById("analytics-id")?.value || "GA_MEASUREMENT_ID";

    if (analyticsId && analyticsId !== "GA_MEASUREMENT_ID") {
      const iframe = document.getElementById("analytics-iframe");
      iframe.src = `https://analytics.google.com/analytics/web/#/report-home/a123456789w987654321p123456789`;
    }

    this.loadTopPages();
    this.loadTrafficSources();
  }

  loadTopPages() {
    const topPages = [
      { page: "/foro/", views: 1250 },
      { page: "/planes/", views: 890 },
      { page: "/desarrollo-web-villa-carlos-paz/", views: 750 },
      { page: "/articulos/desarrollo-web-villa-carlos-paz", views: 650 },
      { page: "/contacto/", views: 420 },
    ];

    const container = document.getElementById("top-pages");
    container.innerHTML = topPages
      .map(
        (page) => `
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
        <span style="font-size: 14px;">${page.page}</span>
        <span style="font-weight: 600; color: #2563eb;">${page.views}</span>
      </div>
    `,
      )
      .join("");
  }

  loadTrafficSources() {
    const sources = [
      { source: "Google", percentage: 65 },
      { source: "Directo", percentage: 20 },
      { source: "Redes Sociales", percentage: 10 },
      { source: "Referencias", percentage: 5 },
    ];

    const container = document.getElementById("traffic-sources");
    container.innerHTML = sources
      .map(
        (source) => `
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
        <span style="font-size: 14px;">${source.source}</span>
        <span style="font-weight: 600; color: #2563eb;">${source.percentage}%</span>
      </div>
    `,
      )
      .join("");
  }

  // LinkedIn Integration
  loadLinkedInSection() {
    this.populateArticleSelect();
    this.checkLinkedInConnection();
    this.loadRecentLinkedInPosts();
  }

  populateArticleSelect() {
    const select = document.getElementById("linkedin-article-select");
    if (!select) return;

    select.innerHTML = '<option value="">Selecciona un artículo...</option>';

    this.articles.forEach((article) => {
      const option = document.createElement("option");
      option.value = article._id;
      option.textContent = article.title;
      select.appendChild(option);
    });
  }

  async connectLinkedIn() {
    try {
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77d1u4hecolzrd&redirect_uri=${encodeURIComponent(window.location.origin + "/admin-local/")}&scope=profile%20w_member_social`;

      const popup = window.open(
        authUrl,
        "linkedin-auth",
        "width=600,height=600",
      );

      // Escuchar el callback
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          this.checkLinkedInConnection();
        }
      }, 1000);

      this.trackEvent("linkedin_auth_started");
    } catch (error) {
      console.error("Error connecting to LinkedIn:", error);
      this.showLinkedInResult(
        "Error al conectar con LinkedIn: " + error.message,
        "error",
      );
    }
  }

  async disconnectLinkedIn() {
    try {
      localStorage.removeItem("linkedin_token");
      localStorage.removeItem("linkedin_profile");
      this.updateLinkedInUI(false);
      this.showLinkedInResult(
        "Desconectado de LinkedIn exitosamente",
        "success",
      );
      this.trackEvent("linkedin_disconnected");
    } catch (error) {
      console.error("Error disconnecting LinkedIn:", error);
    }
  }

  checkLinkedInConnection() {
    const token = localStorage.getItem("linkedin_token");
    const profile = localStorage.getItem("linkedin_profile");

    if (token && profile) {
      const profileData = JSON.parse(profile);
      this.updateLinkedInUI(true, profileData);
    } else {
      this.updateLinkedInUI(false);
    }
  }

  updateLinkedInUI(connected, profile = null) {
    const statusIndicator = document.querySelector(".status-indicator");
    const connectionStatus = document.getElementById("connection-status");
    const authDiv = document.getElementById("linkedin-auth");
    const connectedDiv = document.getElementById("linkedin-connected");
    const publishBtn = document.getElementById("publish-linkedin-btn");

    if (connected && profile) {
      statusIndicator.classList.add("connected");
      connectionStatus.textContent = "Conectado";
      authDiv.style.display = "none";
      connectedDiv.style.display = "flex";
      publishBtn.disabled = false;

      document.getElementById("linkedin-avatar").src =
        profile.pictureUrl || "/logos-he-imagenes/logo3.png";
      document.getElementById("linkedin-name").textContent =
        profile.localizedFirstName + " " + profile.localizedLastName;
      document.getElementById("linkedin-headline").textContent =
        profile.headline || "Profesional en LinkedIn";
    } else {
      statusIndicator.classList.remove("connected");
      connectionStatus.textContent = "Desconectado";
      authDiv.style.display = "block";
      connectedDiv.style.display = "none";
      publishBtn.disabled = true;
    }
  }

  populateLinkedInPost(articleId) {
    if (!articleId) return;

    const article = this.articles.find((a) => a._id === articleId);
    if (!article) return;

    const postText = `🚀 Nuevo artículo publicado: "${article.title}"

${article.description}

Lee el artículo completo en: ${window.location.origin}/articulos/${article._id}

#DesarrolloWeb #VillaCarlosPaz #Tecnología`;

    document.getElementById("linkedin-post-text").value = postText;
    this.updateCharCount(document.getElementById("linkedin-post-text"));
  }

  updateCharCount(textarea) {
    const charCount = document.querySelector(".char-count");
    const count = textarea.value.length;
    const maxChars = 3000;

    charCount.textContent = `${count}/${maxChars} caracteres`;
    charCount.className = "char-count";

    if (count > maxChars * 0.9) {
      charCount.classList.add("warning");
    }
    if (count > maxChars) {
      charCount.classList.add("danger");
    }
  }

  previewLinkedInPost() {
    const postText = document.getElementById("linkedin-post-text").value;
    const autoHashtags = document.getElementById(
      "linkedin-auto-hashtags",
    ).checked;
    const articleId = document.getElementById("linkedin-article-select").value;

    if (!postText) {
      alert("Escribe el texto de la publicación para ver la vista previa");
      return;
    }

    let finalText = postText;

    if (autoHashtags && articleId) {
      const article = this.articles.find((a) => a._id === articleId);
      if (article && article.tags) {
        const hashtags = article.tags
          .map((tag) => `#${tag.replace(/\s+/g, "")}`)
          .join(" ");
        finalText += "\n\n" + hashtags;
      }
    }

    // Crear modal de vista previa
    const modal = document.createElement("div");
    modal.className = "linkedin-preview-modal";
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.8); display: flex; align-items: center;
      justify-content: center; z-index: 9999;
    `;

    const content = document.createElement("div");
    content.style.cssText = `
      background: white; max-width: 500px; width: 90%;
      border-radius: 12px; padding: 20px; position: relative;
    `;

    content.innerHTML = `
      <button onclick="this.closest('.linkedin-preview-modal').remove()"
              style="position: absolute; top: 10px; right: 15px; border: none;
                     background: none; font-size: 20px; cursor: pointer;">&times;</button>
      <div class="linkedin-preview">
        <div class="preview-header">
          <div class="preview-avatar"></div>
          <div class="preview-author">Tu Nombre (Vista Previa)</div>
        </div>
        <div class="preview-content">${finalText.replace(/\n/g, "<br>")}</div>
      </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);
  }

  async publishToLinkedIn() {
    const postText = document.getElementById("linkedin-post-text").value;
    const autoHashtags = document.getElementById(
      "linkedin-auto-hashtags",
    ).checked;
    const articleId = document.getElementById("linkedin-article-select").value;

    if (!postText || !articleId) {
      this.showLinkedInResult("Por favor completa todos los campos", "error");
      return;
    }

    try {
      const article = this.articles.find((a) => a._id === articleId);
      let finalText = postText;

      if (autoHashtags && article.tags) {
        const hashtags = article.tags
          .map((tag) => `#${tag.replace(/\s+/g, "")}`)
          .join(" ");
        finalText += "\n\n" + hashtags;
      }

      const response = await fetch("/.netlify/functions/linkedin-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.currentUser?.token?.access_token}`,
        },
        body: JSON.stringify({
          action: "publish",
          text: finalText,
          articleUrl: `${window.location.origin}/articulos/${article._id}`,
          articleTitle: article.title,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        this.showLinkedInResult(
          "Publicación creada exitosamente en LinkedIn!",
          "success",
        );
        document.getElementById("linkedin-post-form").reset();
        this.loadRecentLinkedInPosts();
        this.trackEvent("linkedin_post_published", { article_id: articleId });
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error publishing to LinkedIn:", error);
      this.showLinkedInResult(
        "Error al publicar en LinkedIn: " + error.message,
        "error",
      );
    }
  }

  async loadRecentLinkedInPosts() {
    try {
      const response = await fetch(
        "/.netlify/functions/linkedin-api?action=posts",
      );
      if (response.ok) {
        const posts = await response.json();
        this.renderLinkedInPosts(posts);
      }
    } catch (error) {
      console.error("Error loading LinkedIn posts:", error);
    }
  }

  renderLinkedInPosts(posts) {
    const container = document.getElementById("recent-linkedin-posts");

    if (!posts || posts.length === 0) {
      container.innerHTML =
        '<p style="text-align: center; color: #6b7280; padding: 20px;">No hay publicaciones recientes</p>';
      return;
    }

    container.innerHTML = posts
      .slice(0, 5)
      .map(
        (post) => `
      <div class="linkedin-post-item">
        <div class="post-header">
          <div class="post-date">${new Date(post.created).toLocaleDateString("es-ES")}</div>
        </div>
        <div class="post-content">${post.text.substring(0, 150)}${post.text.length > 150 ? "..." : ""}</div>
        <div class="post-stats">
          <div class="post-stat">
            <i class="fas fa-thumbs-up"></i>
            <span>${post.likes || 0}</span>
          </div>
          <div class="post-stat">
            <i class="fas fa-comment"></i>
            <span>${post.comments || 0}</span>
          </div>
          <div class="post-stat">
            <i class="fas fa-share"></i>
            <span>${post.shares || 0}</span>
          </div>
        </div>
      </div>
    `,
      )
      .join("");
  }

  refreshLinkedInPosts() {
    this.loadRecentLinkedInPosts();
  }

  showLinkedInResult(message, type) {
    const resultDiv = document.getElementById("linkedin-result");
    resultDiv.textContent = message;
    resultDiv.className = `result-message ${type}`;
    resultDiv.style.display = "block";

    setTimeout(() => {
      resultDiv.style.display = "none";
    }, 5000);
  }

  // Analytics Tracking
  trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== "undefined") {
      gtag("event", eventName, {
        ...parameters,
        admin_panel: true,
        user_id: this.currentUser?.id,
      });
    }
  }
}

// Initialize the admin panel
const adminPanel = new AdminPanel();

// Export for global access
window.adminPanel = adminPanel;