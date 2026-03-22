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

    // 사이드바에서 모든 챕터 링크 수집
    function getAllChapterLinks() {
        return document.querySelectorAll('.chapter li.chapter-item a');
    }

    function getCompletedCount() {
        const progress = getProgress();
        return Object.values(progress).filter(v => v === true).length;
    }

    function getTotalChapters() {
        return getAllChapterLinks().length;
    }

    // 섹션(기초/중급/고급)별로 챕터 그룹화
    function getSectionStats() {
        const progress = getProgress();
        const sections = [];
        let currentSection = null;

        const sidebar = document.querySelector('.sidebar-scrollbox');
        if (!sidebar) return sections;

        const items = sidebar.querySelectorAll('li.chapter-item, li.part-title');
        items.forEach(item => {
            if (item.classList.contains('part-title')) {
                currentSection = {
                    name: item.textContent.trim(),
                    total: 0,
                    completed: 0,
                    children: []
                };
                sections.push(currentSection);
            } else if (currentSection) {
                const link = item.querySelector('a');
                if (!link) return;
                const href = link.getAttribute('href');
                if (!href) return;
                const fullPath = new URL(href, window.location.href).pathname.replace(/\/$/, '');
                const isCompleted = progress[fullPath] === true;
                currentSection.total++;
                if (isCompleted) currentSection.completed++;

                // 부모 챕터인지 확인 (들여쓰기 없는 항목)
                const isParent = !item.parentElement.closest('li.chapter-item');
                if (isParent) {
                    currentSection.children.push({
                        name: link.textContent.trim(),
                        path: fullPath,
                        completed: isCompleted,
                        subItems: []
                    });
                } else if (currentSection.children.length > 0) {
                    const parent = currentSection.children[currentSection.children.length - 1];
                    parent.subItems.push({
                        name: link.textContent.trim(),
                        path: fullPath,
                        completed: isCompleted
                    });
                }
            }
        });

        return sections;
    }

    // 챕터 완료 체크박스 추가
    function addCompletionCheckbox() {
        const content = document.getElementById('content');
        if (!content) return;

        const pageId = getPageId();
        const progress = getProgress();

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

    // 사이드바에 전체 + 섹션별 진행률 표시
    function updateSidebarProgress() {
        const completed = getCompletedCount();
        const total = getTotalChapters();
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        const sections = getSectionStats();

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

        let sectionsHtml = sections.map(s => {
            if (s.total === 0) return '';
            const sp = Math.round((s.completed / s.total) * 100);
            return `
                <div class="section-progress">
                    <div class="section-progress-header">
                        <span class="section-name">${s.name}</span>
                        <span class="section-count">${s.completed}/${s.total}</span>
                    </div>
                    <div class="section-bar-bg">
                        <div class="section-bar-fill" style="width: ${sp}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        bar.innerHTML = `
            <div class="progress-header">
                <span class="progress-label">전체 진행률</span>
                <span class="progress-count">${completed}/${total}</span>
            </div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${percent}%"></div>
            </div>
            <div class="progress-percent">${percent}%</div>
            ${sectionsHtml}
        `;

        // 사이드바 챕터에 완료 표시 + 챕터별 프로그레스
        const progress = getProgress();
        const allLis = document.querySelectorAll('.chapter li.chapter-item');

        allLis.forEach(li => {
            const link = li.querySelector(':scope > a');
            if (!link) return;
            const href = link.getAttribute('href');
            if (!href) return;

            const fullPath = new URL(href, window.location.href).pathname.replace(/\/$/, '');

            if (progress[fullPath]) {
                li.classList.add('chapter-completed');
            } else {
                li.classList.remove('chapter-completed');
            }

            // 하위 항목이 있는 부모 챕터에 미니 프로그레스 표시
            const subList = li.querySelector(':scope > ol, :scope > ul');
            if (subList) {
                const subLinks = subList.querySelectorAll('li.chapter-item a');
                if (subLinks.length > 0) {
                    let subTotal = subLinks.length;
                    let subCompleted = 0;
                    subLinks.forEach(sl => {
                        const sh = sl.getAttribute('href');
                        if (!sh) return;
                        const sp = new URL(sh, window.location.href).pathname.replace(/\/$/, '');
                        if (progress[sp]) subCompleted++;
                    });

                    // 부모 자신도 포함
                    subTotal++;
                    if (progress[fullPath]) subCompleted++;

                    let badge = li.querySelector('.chapter-progress-badge');
                    if (!badge) {
                        badge = document.createElement('span');
                        badge.className = 'chapter-progress-badge';
                        link.appendChild(badge);
                    }
                    const subPercent = Math.round((subCompleted / subTotal) * 100);
                    badge.textContent = ` ${subCompleted}/${subTotal}`;
                    badge.classList.toggle('badge-done', subPercent === 100);
                    badge.classList.toggle('badge-partial', subPercent > 0 && subPercent < 100);
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
        const sections = getSectionStats();

        let sectionCards = sections.map(s => {
            if (s.total === 0) return '';
            const sp = Math.round((s.completed / s.total) * 100);

            let chapterList = s.children.map(ch => {
                let subCount = ch.subItems.length;
                let subDone = ch.subItems.filter(si => si.completed).length;
                if (subCount > 0) {
                    // 부모 포함
                    subCount++;
                    if (ch.completed) subDone++;
                    const chPercent = Math.round((subDone / subCount) * 100);
                    return `<div class="dash-chapter ${chPercent === 100 ? 'dash-done' : ''}">
                        <span class="dash-ch-name">${ch.completed ? '<span class="check-mark"></span>' : '<span class="check-empty"></span>'} ${ch.name}</span>
                        <span class="dash-ch-progress">
                            <span class="dash-mini-bar"><span class="dash-mini-fill" style="width:${chPercent}%"></span></span>
                            ${subDone}/${subCount}
                        </span>
                    </div>`;
                } else {
                    return `<div class="dash-chapter ${ch.completed ? 'dash-done' : ''}">
                        <span class="dash-ch-name">${ch.completed ? '<span class="check-mark"></span>' : '<span class="check-empty"></span>'} ${ch.name}</span>
                        <span class="dash-ch-status">${ch.completed ? '완료' : '미완료'}</span>
                    </div>`;
                }
            }).join('');

            return `
                <div class="dash-section">
                    <div class="dash-section-header">
                        <h4>${s.name}</h4>
                        <span class="dash-section-stat">${s.completed}/${s.total} (${sp}%)</span>
                    </div>
                    <div class="dash-section-bar-bg">
                        <div class="dash-section-bar-fill" style="width: ${sp}%"></div>
                    </div>
                    <div class="dash-chapter-list">${chapterList}</div>
                </div>
            `;
        }).join('');

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
            ${sectionCards}
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
