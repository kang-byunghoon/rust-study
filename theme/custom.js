// Rust 학습 가이드 - 학습 진행률 추적 시스템
(function() {
    'use strict';

    const STORAGE_KEY = 'rust-study-progress';

    function getProgress() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch {
            return {};
        }
    }

    function saveProgress(progress) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }

    function getPageId() {
        return window.location.pathname.replace(/\/$/, '') || '/';
    }

    function getCompletedCount() {
        const progress = getProgress();
        return Object.values(progress).filter(v => v === true).length;
    }

    function getTotalChapters() {
        const links = document.querySelectorAll('.chapter li.chapter-item a');
        return links.length;
    }

    // 챕터 완료 체크박스 추가
    function addCompletionCheckbox() {
        const content = document.getElementById('content');
        if (!content) return;

        const pageId = getPageId();
        const progress = getProgress();

        // 이미 추가된 경우 스킵
        if (document.getElementById('completion-checkbox-container')) return;

        const container = document.createElement('div');
        container.id = 'completion-checkbox-container';
        container.className = 'completion-box';

        const isCompleted = progress[pageId] === true;

        container.innerHTML = `
            <label class="completion-label">
                <input type="checkbox" id="chapter-complete-checkbox"
                       ${isCompleted ? 'checked' : ''}>
                <span class="completion-text">${isCompleted ? '학습 완료!' : '이 챕터를 완료했습니다'}</span>
            </label>
        `;

        content.appendChild(container);

        const checkbox = document.getElementById('chapter-complete-checkbox');
        checkbox.addEventListener('change', function() {
            const progress = getProgress();
            const text = container.querySelector('.completion-text');
            if (this.checked) {
                progress[pageId] = true;
                text.textContent = '학습 완료!';
                container.classList.add('completed');
            } else {
                delete progress[pageId];
                text.textContent = '이 챕터를 완료했습니다';
                container.classList.remove('completed');
            }
            saveProgress(progress);
            updateSidebarProgress();
            updateProgressDashboard();
        });

        if (isCompleted) {
            container.classList.add('completed');
        }
    }

    // 사이드바에 진행률 표시
    function updateSidebarProgress() {
        const completed = getCompletedCount();
        const total = getTotalChapters();
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        let bar = document.getElementById('progress-bar-container');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'progress-bar-container';
            bar.className = 'progress-container';

            const sidebar = document.querySelector('.sidebar-scrollbox');
            if (sidebar) {
                sidebar.insertBefore(bar, sidebar.firstChild);
            }
        }

        bar.innerHTML = `
            <div class="progress-header">
                <span class="progress-label">학습 진행률</span>
                <span class="progress-count">${completed}/${total}</span>
            </div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${percent}%"></div>
            </div>
            <div class="progress-percent">${percent}%</div>
        `;

        // 사이드바 챕터에 완료 표시
        const progress = getProgress();
        const links = document.querySelectorAll('.chapter li.chapter-item a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            const fullPath = new URL(href, window.location.href).pathname.replace(/\/$/, '');
            const li = link.closest('li');
            if (li) {
                if (progress[fullPath]) {
                    li.classList.add('chapter-completed');
                } else {
                    li.classList.remove('chapter-completed');
                }
            }
        });
    }

    // 소개 페이지 대시보드
    function updateProgressDashboard() {
        const dashboard = document.getElementById('progress-dashboard');
        if (!dashboard) return;

        const completed = getCompletedCount();
        const total = getTotalChapters();
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        dashboard.innerHTML = `
            <h3>나의 학습 현황</h3>
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-number">${completed}</div>
                    <div class="stat-label">완료한 챕터</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${total - completed}</div>
                    <div class="stat-label">남은 챕터</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${percent}%</div>
                    <div class="stat-label">진행률</div>
                </div>
            </div>
            <div class="dashboard-bar-bg">
                <div class="dashboard-bar-fill" style="width: ${percent}%"></div>
            </div>
            ${completed > 0 ? `<button id="reset-progress-btn" class="reset-btn">진행률 초기화</button>` : ''}
        `;

        const resetBtn = document.getElementById('reset-progress-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                if (confirm('정말로 학습 진행률을 초기화하시겠습니까?')) {
                    localStorage.removeItem(STORAGE_KEY);
                    updateSidebarProgress();
                    updateProgressDashboard();
                    const checkbox = document.getElementById('chapter-complete-checkbox');
                    if (checkbox) checkbox.checked = false;
                }
            });
        }
    }

    // 초기화
    function init() {
        addCompletionCheckbox();
        updateSidebarProgress();
        updateProgressDashboard();
    }

    // DOM 로드 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // mdBook 페이지 전환 시 재초기화 (SPA 방식 대응)
    const observer = new MutationObserver(function() {
        setTimeout(init, 100);
    });

    const mainEl = document.getElementById('content');
    if (mainEl) {
        observer.observe(mainEl, { childList: true });
    }
})();
