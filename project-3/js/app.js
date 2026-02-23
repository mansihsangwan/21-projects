document.addEventListener("DOMContentLoaded", () => {
    const getStoredTheme = () => localStorage.getItem("theme") || "dark";

    const setTheme = (theme) => {
        document.documentElement.setAttribute("data-bs-theme", theme);
        localStorage.setItem("theme", theme);

        const icon = document.getElementById("themeIcon");
        if (icon) {
            if (theme === "dark") {
                icon.classList.remove("fa-sun");
                icon.classList.add("fa-moon");
            } else {
                icon.classList.remove("fa-moon");
                icon.classList.add("fa-sun");
            }
        }

        if (typeof updateCharts === "function") {
            updateCharts(theme);
        }
    };

    const getChartColors = (theme) => {
        const isDark = theme === "dark";
        return {
            grid: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
            text: isDark ? "#adb5bd" : "#6c757d",
            gridDisplay: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        };
    };

    let utilChart, reportBar, reportPie;

    const updateCharts = (theme) => {
        const colors = getChartColors(theme);

        if (utilChart) {
            utilChart.options.scales.y.grid.color = colors.grid;
            utilChart.options.scales.y.ticks.color = colors.text;
            utilChart.options.scales.x.grid.color = colors.gridDisplay;
            utilChart.options.scales.x.ticks.color = colors.text;
            utilChart.update();
        }
        if (reportBar) {
            reportBar.options.scales.y.grid.color = colors.grid;
            reportBar.options.scales.y.ticks.color = colors.text;
            reportBar.options.scales.x.grid.color = colors.gridDisplay;
            reportBar.options.scales.x.ticks.color = colors.text;
            reportBar.update();
        }
        if (reportPie) {
            reportPie.options.plugins.legend.labels.color = colors.text;
            reportPie.update();
        }
    };

    const initCharts = () => {
        const theme = getStoredTheme();
        const colors = getChartColors(theme);

        const ctx = document.getElementById("utilChart");
        if (ctx) {
        utilChart = new Chart(ctx, {
            type: "line",
            data: {
            labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
            datasets: [
                {
                    label: "Overall utilization",
                    data: [62, 68, 71, 73, 76, 84],
                    tension: 0.4,
                    fill: true,
                    backgroundColor: "rgba(13,110,253,0.2)",
                    borderColor: "#0d6efd",
                    borderWidth: 3,
                    pointBackgroundColor: "#0d6efd",
                    pointBorderColor: "#fff",
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBorderWidth: 2,
                },
            ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "rgba(0,0,0,0.9)",
                        padding: 12,
                        titleFont: { size: 14, weight: "bold" },
                        bodyFont: { size: 13 },
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return "Utilization: " + context.parsed.y + "%";
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 40,
                        max: 100,
                        grid: { color: colors.grid, drawBorder: false },
                        ticks: { color: colors.text, padding: 8 },
                    },
                    x: {
                        grid: { display: false, drawBorder: false },
                        ticks: { color: colors.text, padding: 8 },
                    },
                },
            },
        });
        }

        const barCtx = document.getElementById("reportBar");
        if (barCtx) {
        reportBar = new Chart(barCtx, {
            type: "bar",
            data: {
            labels: ["Payments", "Analytics", "Infra", "AI", "CRM"],
            datasets: [
                    {
                        label: "Efficiency (%)",
                        data: [82, 76, 88, 91, 73],
                        backgroundColor: [
                            "rgba(13,110,253,0.9)",
                            "rgba(25,135,84,0.9)",
                            "rgba(255,193,7,0.9)",
                            "rgba(102,16,242,0.9)",
                            "rgba(220,53,69,0.9)"
                        ],
                        borderRadius: 8,
                        borderSkipped: false,
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "rgba(0,0,0,0.9)",
                        padding: 12,
                        titleFont: { size: 14, weight: "bold" },
                        bodyFont: { size: 13 },
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return context.parsed.x + "%";
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: colors.grid, drawBorder: false },
                        ticks: { color: colors.text, padding: 8 },
                    },
                    y: {
                        grid: { display: false, drawBorder: false },
                        ticks: { color: colors.text, padding: 8 },
                    },
                },
            },
        });
        }

        const pieCtx = document.getElementById("reportPie");
        if (pieCtx) {
            reportPie = new Chart(pieCtx, {
                type: "radar",
                data: {
                labels: ["Frontend", "Backend", "Data Science", "QA", "DevOps"],
                datasets: [
                        {
                            label: "Team Distribution",
                            data: [25, 30, 20, 15, 10],
                            backgroundColor: "rgba(13,110,253,0.2)",
                            borderColor: "#0d6efd",
                            borderWidth: 2,
                            pointBackgroundColor: "#0d6efd",
                            pointBorderColor: "#fff",
                            pointBorderWidth: 2,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            fill: true,
                        },
                        {
                            label: "Target Allocation",
                            data: [28, 28, 18, 18, 8],
                            backgroundColor: "rgba(25,135,84,0.1)",
                            borderColor: "rgba(25,135,84,0.8)",
                            borderWidth: 2,
                            pointBackgroundColor: "rgba(25,135,84,0.8)",
                            pointBorderColor: "#fff",
                            pointBorderWidth: 2,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            fill: true,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                        position: "top",
                        labels: { 
                            usePointStyle: true,
                            color: colors.text,
                            padding: 20,
                            font: { size: 13, weight: "500" }
                        },
                        },
                        tooltip: {
                            backgroundColor: "rgba(0,0,0,0.9)",
                            padding: 12,
                            titleFont: { size: 14, weight: "bold" },
                            bodyFont: { size: 13 },
                            cornerRadius: 8,
                        }
                    },
                    scales: {
                        r: {
                            grid: { color: colors.grid },
                            ticks: { color: colors.text, backdropColor: "transparent" },
                            angleLines: { color: colors.grid },
                        }
                    },
                },
            });
        }
    };

    setTheme(getStoredTheme());
    initCharts();

    const toggleBtn = document.getElementById("themeToggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-bs-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            setTheme(newTheme);
        });
    }

    const saveBtn = document.getElementById("saveProjectBtn");
    if (saveBtn) {
        saveBtn.addEventListener("click", function () {
            const name = document.getElementById("projectName").value.trim();
            const team = document.getElementById("projectTeam").value;
            const progressVal = document.getElementById("projectProgress").value;
            const due = document.getElementById("projectDue").value;
            const desc = document.getElementById("projectDescription").value.trim();

            if (!name) {
                showAlert("Please enter a project name.", "warning");
                return;
            }

            if (!due) {
                showAlert("Please select a due date.", "warning");
                return;
            }

            const dueDate = new Date(due);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dueDate < today) {
                showAlert("Due date must be in the future.", "warning");
                return;
            }

            let badgeClass = "bg-secondary-subtle text-secondary";
            if (team === "Backend") badgeClass = "bg-primary-subtle text-primary";
            if (team === "Data Science") badgeClass = "bg-success-subtle text-success";
            if (team === "DevOps") badgeClass = "bg-warning-subtle text-warning";
            if (team === "Frontend") badgeClass = "bg-info-subtle text-info";
            if (team === "AI") badgeClass = "bg-danger-subtle text-danger";

            const dateDate = new Date(due);
            const month = dateDate
                .toLocaleString("default", { month: "short" })
                .toUpperCase();
            const year = dateDate.getFullYear();

            const editingId = document.getElementById("saveProjectBtn").dataset.editingId;

            const newCard = `
                            <div class="col-md-6 col-lg-4" data-project-id="${editingId || Date.now()}">
                                <div class="card border-0 shadow-sm h-100 rounded-4 project-card" style="transition: transform 0.2s, box-shadow 0.2s;">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 class="card-title fw-bold mb-1">${escapeHtml(name)}</h5>
                                                <span class="badge ${badgeClass} border border-opacity-10">${escapeHtml(team)}</span>
                                            </div>
                                            <div class="dropdown">
                                                <button class="btn btn-link text-body-secondary p-0" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                                                <ul class="dropdown-menu dropdown-menu-end">
                                                    <li><a class="dropdown-item edit-project" href="#">Edit</a></li>
                                                    <li><a class="dropdown-item delete-project text-danger" href="#">Delete</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <p class="card-text text-body-secondary small">${escapeHtml(desc || "No description provided.")}</p>
                                        
                                        <div class="d-flex justify-content-between align-items-end mt-4">
                                            <div class="w-100 me-3">
                                                <div class="d-flex justify-content-between mb-1">
                                                    <span class="small fw-medium">Progress</span>
                                                    <span class="small fw-bold">${progressVal}%</span>
                                                </div>
                                                <div class="progress" role="progressbar" style="height: 6px">
                                                    <div class="progress-bar" style="width: ${progressVal}%"></div>
                                                </div>
                                            </div>
                                            <div class="bg-body-secondary rounded p-2 text-center" style="min-width: 60px;">
                                                <div class="small fw-bold">${month}</div>
                                                <div class="fw-bold small text-muted">${year}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer bg-transparent border-0 pt-0 pb-3">
                                        <div class="d-flex align-items-center">
                                            <span class="small text-muted">Just added</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    `;

            const grid = document.getElementById("projectGrid");
            if (grid) {
                if (editingId) {
                    const existingCard = grid.querySelector(`[data-project-id="${editingId}"]`);
                    if (existingCard) {
                        existingCard.outerHTML = newCard;
                        showAlert("Project updated successfully!", "success");
                    }
                    document.getElementById("saveProjectBtn").dataset.editingId = "";
                    document.getElementById("saveProjectBtn").textContent = "Create Project";
                } else {
                    grid.insertAdjacentHTML("beforeend", newCard);
                    showAlert("Project created successfully!", "success");
                }
                
                attachProjectListeners();
            }

            const modalEl = document.getElementById("addProjectModal");
            if (modalEl) {
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            }
            document.getElementById("addProjectForm").reset();
        });
    }

    const attachProjectListeners = () => {
        document.querySelectorAll(".delete-project").forEach(btn => {
            btn.removeEventListener("click", handleProjectDelete);
            btn.addEventListener("click", handleProjectDelete);
        });

        document.querySelectorAll(".edit-project").forEach(btn => {
            btn.removeEventListener("click", handleProjectEdit);
            btn.addEventListener("click", handleProjectEdit);
        });

        document.querySelectorAll(".project-card").forEach(card => {
            card.parentElement.removeEventListener("mouseenter", handleCardHover);
            card.parentElement.removeEventListener("mouseleave", handleCardLeave);
            card.parentElement.addEventListener("mouseenter", handleCardHover);
            card.parentElement.addEventListener("mouseleave", handleCardLeave);
        });
    };

    const handleProjectDelete = (e) => {
        e.preventDefault();
        const card = e.target.closest(".col-md-6");
        if (card && confirm("Are you sure you want to delete this project?")) {
            card.remove();
            showAlert("Project deleted successfully.", "success");
        }
    };

    const handleProjectEdit = (e) => {
        e.preventDefault();
        const card = e.target.closest(".col-md-6");
        const projectId = card.dataset.projectId;
        
        const title = card.querySelector(".card-title").textContent;
        const badge = card.querySelector(".badge").textContent;
        const description = card.querySelector(".card-text").textContent;
        const progressText = card.querySelector(".progress-bar").style.width;
        const progressVal = parseInt(progressText);
        const monthYear = card.querySelectorAll(".bg-body-secondary")[0].textContent;

        document.getElementById("projectName").value = title;
        document.getElementById("projectTeam").value = badge;
        document.getElementById("projectProgress").value = progressVal;
        document.getElementById("projectDescription").value = description;

        const today = new Date();
        const futureDate = new Date(today.setDate(today.getDate() + 7));
        document.getElementById("projectDue").value = futureDate.toISOString().split('T')[0];

        const modal = document.querySelector("#addProjectModal .modal-title");
        if (modal) modal.textContent = "Edit Project";
        
        const saveBtn = document.getElementById("saveProjectBtn");
        saveBtn.textContent = "Update Project";
        saveBtn.dataset.editingId = projectId;

        const modalEl = document.getElementById("addProjectModal");
        const modalInstance = new bootstrap.Modal(modalEl);
        modalInstance.show();

        modalEl.addEventListener("hidden.bs.modal", () => {
            document.querySelector("#addProjectModal .modal-title").textContent = "Create New Project";
            saveBtn.textContent = "Create Project";
            saveBtn.dataset.editingId = "";
        }, { once: true });
    };

    const handleCardHover = function() {
        this.querySelector(".project-card").style.transform = "translateY(-4px)";
        this.querySelector(".project-card").style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
    };

    const handleCardLeave = function() {
        this.querySelector(".project-card").style.transform = "translateY(0)";
        this.querySelector(".project-card").style.boxShadow = "var(--bs-box-shadow-sm)";
    };

    attachProjectListeners();

    const escapeHtml = (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    };

    const showAlert = (message, type = "info") => {
        const alertDiv = document.createElement("div");
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.setAttribute("role", "alert");
        alertDiv.style.cssText = "position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; animation: slideIn 0.3s ease-in;";
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 4000);
    };

});