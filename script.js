document.addEventListener('DOMContentLoaded', function () {
    const containers = document.querySelectorAll('.container');
    const minimizedContainer = document.querySelector('.minimized-container');
    const safariIndicator = document.getElementById('safari-indicator');
    const safariDockItem = document.querySelector('.dock-item img[src="./img/safari.png"]').parentElement;
    const musicPlayer = document.querySelector('.music-player');
    const musicContainer = document.getElementById('music-container');
    let originalStyles = {};

    // 공통 기능 설정 함수
    function setupCloseButton(closeButton, container) {
        closeButton.addEventListener('click', function () {
            container.style.display = 'none';
            if (container.id === 'projects-container') {
                safariIndicator.style.opacity = '0'; // Safari indicator 숨기기
            }
        });
    }

    function setupMinimizeButton(minimizeButton, container) {
        minimizeButton.addEventListener('click', function () {
            originalStyles[container.id] = {
                width: container.style.width,
                height: container.style.height,
                top: container.style.top,
                left: container.style.left,
                transform: container.style.transform,
                borderRadius: container.style.borderRadius,
            };

            container.classList.add('transition');
            container.style.transform = 'scale(0.1) translate(-50%, -50%)';
            container.style.opacity = '0';
            container.style.top = '50%';
            container.style.left = '50%';

            setTimeout(() => {
                container.style.display = 'none';
                minimizedContainer.style.display = 'block'; // Show minimized icon
                container.classList.remove('transition');
            }, 500);
        });
    }

    function setupFullscreenButton(fullscreenButton, container) {
        fullscreenButton.addEventListener('click', function () {
            container.classList.add('transition');
            container.style.width = '100%';
            container.style.height = 'calc(100% - 6rem)';
            container.style.left = '50%';
            container.style.transform = 'translateX(-50%)';

            const bgArtwork = container.querySelector("#bg-artwork");
            if (bgArtwork) {
                bgArtwork.style.borderRadius = container.style.borderRadius;
                bgArtwork.style.width = '100%';
                bgArtwork.style.height = '100%';
            }

            setTimeout(() => {
                container.classList.remove('transition');
            }, 500);
        });
    }

    function setupRestoreMinimizedContainer(container) {
        minimizedContainer.addEventListener('click', function () {
            minimizedContainer.style.display = 'none';
            container.style.display = 'block';
            container.classList.add('transition');
            container.style.transform = 'scale(0.1) translate(-50%, -50%)';
            container.style.opacity = '0';

            setTimeout(() => {
                const styles = originalStyles[container.id];
                container.style.width = styles.width;
                container.style.height = styles.height;
                container.style.top = styles.top;
                container.style.left = styles.left;
                container.style.transform = styles.transform || 'none';
                container.style.opacity = '1';
                container.style.borderRadius = styles.borderRadius;

                setTimeout(() => {
                    container.classList.remove('transition');
                }, 500);
            }, 10);
        });
    }

    // 창 드래그 기능 설정 함수
    function setupDragFunctionality(container) {
        const titlebar = container.querySelector('.macos-titlebar');

        let isDragging = false;
        let startX, startY, initialX, initialY;

        titlebar.addEventListener('mousedown', function (e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = container.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;

            container.style.transform = 'none';
            container.style.left = `${initialX}px`;
            container.style.top = `${initialY}px`;

            titlebar.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                container.style.left = `${initialX + dx}px`;
                container.style.top = `${initialY + dy}px`;

                // 음악 플레이어 및 내부 요소도 함께 이동하도록 설정
                if (container === musicContainer) {
                    musicPlayer.style.left = `${initialX + dx}px`;
                    musicPlayer.style.top = `${initialY + dy}px`;
                }
            }
        });

        document.addEventListener('mouseup', function () {
            if (isDragging) {
                isDragging = false;
                titlebar.style.cursor = 'grab';
            }
        });

        titlebar.style.cursor = 'grab';
    }

    // 각 컨테이너에 기능 적용
    containers.forEach(container => {
        const closeButton = container.querySelector('.macos-titlebar .close');
        const minimizeButton = container.querySelector('.macos-titlebar .minimize');
        const fullscreenButton = container.querySelector('.macos-titlebar .fullscreen');

        setupCloseButton(closeButton, container);
        setupMinimizeButton(minimizeButton, container);
        setupFullscreenButton(fullscreenButton, container);
        setupRestoreMinimizedContainer(container);
        setupDragFunctionality(container);
    });

    // Safari 도크 아이템 클릭 시 projects-container 나타나기
    safariDockItem.addEventListener('click', function () {
        const projectContainer = document.getElementById('projects-container');
        projectContainer.style.display = 'block';
        safariIndicator.style.opacity = '1'; // Safari indicator 보이기
    });
});

/* status bar */
document.addEventListener('DOMContentLoaded', function () {
    function updateTime() {
        const timeElement = document.querySelector('.right-section .menu-item:last-child');
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
        timeElement.textContent = formattedTime;
    }

    setInterval(updateTime, 1000);
    updateTime(); // Initial call to set the time immediately
});

/* Dock 아이템 활성화 */
document.addEventListener('DOMContentLoaded', function () {
    const dockItems = document.querySelectorAll('.dock-item');

    dockItems.forEach(item => {
        item.addEventListener('click', function () {
            item.classList.toggle('active');
        });
    });
});

/* 음악 플레이어 설정 */
$(document).ready(function () {
    var playerTrack = $("#player-track"),
        bgArtwork = $("#bg-artwork"),
        bgArtworkUrl,
        albumName = $("#album-name"),
        trackName = $("#track-name"),
        albumArt = $("#album-art"),
        sArea = $("#s-area"),
        seekBar = $("#seek-bar"),
        trackTime = $("#track-time"),
        insTime = $("#ins-time"),
        sHover = $("#s-hover"),
        playPauseButton = $("#play-pause-button"),
        i = playPauseButton.find("i"),
        tProgress = $("#current-time"),
        tTime = $("#track-length"),
        seekT,
        seekLoc,
        seekBarPos,
        cM,
        ctMinutes,
        ctSeconds,
        curMinutes,
        curSeconds,
        durMinutes,
        durSeconds,
        playProgress,
        bTime,
        nTime = 0,
        buffInterval = null,
        tFlag = false,
        albums = ["Spirited Away", "Spirited Away", "Howl's Moving Castle"],
        trackNames = ["The Name of Life", "Always With Me", "Merry-Go-Round of Life"],
        albumArtworks = ["_1", "_2", "_3"],
        trackUrl = [
            "./mp3/1.mp3",
            "./mp3/2.mp3",
            "./mp3/3.mp3",
        ],
        playPreviousTrackButton = $("#play-previous"),
        playNextTrackButton = $("#play-next"),
        currIndex = -1,
        currTrack = "currentTrack", // Local storage key for current track
        currTime = "currentTime"; // Local storage key for current time

    function checkBuffering() {
        clearInterval(buffInterval);
        buffInterval = setInterval(function () {
            if (nTime == 0 || bTime - nTime > 1000) {
                albumArt.addClass("buffering");
            } else {
                albumArt.removeClass("buffering");
            }

            bTime = new Date();
            bTime = bTime.getTime();
        }, 100);
    }

    function showHover(event) {
        seekBarPos = sArea.offset();
        seekT = event.clientX - seekBarPos.left;
        seekLoc = audio.duration * (seekT / sArea.outerWidth());

        sHover.width(seekT);

        cM = seekLoc / 60;

        ctMinutes = Math.floor(cM);
        ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

        if (ctMinutes < 0 || ctSeconds < 0) return;

        if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
        if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

        if (isNaN(ctMinutes) || isNaN(ctSeconds)) insTime.text("--:--");
        else insTime.text(ctMinutes + ":" + ctSeconds);

        insTime.css({ left: seekT, "margin-left": "-21px" }).fadeIn(0);
    }

    function hideHover() {
        sHover.width(0);
        insTime.text("00:00").css({ left: "0px", "margin-left": "0px" }).fadeOut(0);
    }

    function playFromClickedPos() {
        audio.currentTime = seekLoc;
        seekBar.width(seekT);
        hideHover();
    }

    function playPause() {
        setTimeout(function () {
            if (audio.paused) {
                playerTrack.addClass("active");
                albumArt.addClass("active");
                checkBuffering();
                i.attr("class", "fas fa-pause");
                audio.play();

                audio.addEventListener('ended', function () {
                    document.getElementById("play-next").click();
                }, false);
            } else {
                playerTrack.removeClass("active");
                albumArt.removeClass("active");
                clearInterval(buffInterval);
                albumArt.removeClass("buffering");
                i.attr("class", "fas fa-play");
                audio.pause();
            }
        }, 300);
    }

    function updateCurrTime() {
        nTime = new Date();
        nTime = nTime.getTime();

        if (!tFlag) {
            tFlag = true;
            trackTime.addClass("active");
        }

        curMinutes = Math.floor(audio.currentTime / 60);
        curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

        durMinutes = Math.floor(audio.duration / 60);
        durSeconds = Math.floor(audio.duration - durMinutes * 60);

        playProgress = (audio.currentTime / audio.duration) * 100;

        if (curMinutes < 10) curMinutes = "0" + curMinutes;
        if (curSeconds < 10) curSeconds = "0" + curSeconds;

        if (durMinutes < 10) durMinutes = "0" + durMinutes;
        if (durSeconds < 10) durSeconds = "0" + durSeconds;

        if (isNaN(curMinutes) || isNaN(curSeconds)) tProgress.text("00:00");
        else tProgress.text(curMinutes + ":" + curSeconds);

        if (isNaN(durMinutes) || isNaN(durSeconds)) tTime.text("00:00");
        else tTime.text(durMinutes + ":" + durSeconds);

        if (
            isNaN(curMinutes) ||
            isNaN(curSeconds) ||
            isNaN(durMinutes) ||
            isNaN(durSeconds)
        )
            trackTime.removeClass("active");
        else trackTime.addClass("active");

        seekBar.width(playProgress + "%");

        // Save current time to local storage
        localStorage.setItem(currTime, audio.currentTime);

        if (playProgress == 100) {
            i.attr("class", "fa fa-play");
            seekBar.width(0);
            tProgress.text("00:00");
            albumArt.removeClass("buffering").removeClass("active");
            clearInterval(buffInterval);
        }
    }

    function initPlayer() {
        audio = new Audio();

        // Check for saved track and time in local storage
        var savedTrack = localStorage.getItem(currTrack);
        var savedTime = localStorage.getItem(currTime);

        if (savedTrack !== null) {
            currIndex = parseInt(savedTrack);
            currAlbum = albums[currIndex];
            currTrackName = trackNames[currIndex];
            currArtwork = albumArtworks[currIndex];
            audio.src = trackUrl[currIndex];
            albumName.text(currAlbum);
            trackName.text(currTrackName);
            albumArt.find("img.active").removeClass("active");
            $("#" + currArtwork).addClass("active");
            bgArtworkUrl = $("#" + currArtwork).attr("src");
            bgArtwork.css({ "background-image": "url(" + bgArtworkUrl + ")" });

            if (savedTime !== null) {
                audio.currentTime = parseFloat(savedTime);
            }

            playerTrack.addClass("active");
            albumArt.addClass("active");
            i.attr("class", "fas fa-play");
        } else {
            currIndex = 0;
            selectTrack(1);
        }

        audio.loop = false;

        playPauseButton.on("click", playPause);

        sArea.mousemove(function (event) {
            showHover(event);
        });

        sArea.mouseout(hideHover);

        sArea.on("click", playFromClickedPos);

        $(audio).on("timeupdate", updateCurrTime);

        playPreviousTrackButton.on("click", function () {
            selectTrack(-1);
        });
        playNextTrackButton.on("click", function () {
            selectTrack(1);
        });

        audio.addEventListener('ended', function () {
            selectTrack(1);
        });
    }

    initPlayer();
});

document.addEventListener('DOMContentLoaded', function () {
    const musicDockItem = document.querySelector('.dock-item img[src="./img/music.png"]').parentElement;
    const musicIndicator = document.getElementById('music-indicator');
    const backgroundMusic = document.getElementById('background-music');

    function startMusic() {
        backgroundMusic.play();
        musicIndicator.style.opacity = '1';
    }

    function toggleMusic() {
        if (backgroundMusic.paused) {
            startMusic();
        } else {
            backgroundMusic.pause();
            musicIndicator.style.opacity = '0';
        }
    }

    // 페이지에서 처음 클릭될 때 음악 재생, 단 musicDockItem 클릭 시는 제외
    function handleFirstClick(e) {
        if (!musicDockItem.contains(e.target)) {
            startMusic();
        }
        // 첫 클릭 후 이 리스너를 제거
        document.body.removeEventListener('click', handleFirstClick);
    }

    document.body.addEventListener('click', handleFirstClick);

    // Music dock item 클릭 시 음악 재생/정지
    musicDockItem.addEventListener('click', function (e) {
        toggleMusic();
        e.stopPropagation(); // 클릭 이벤트가 body로 전파되지 않도록 중지
    });

    // 초기 상태에서 indicator 숨기기
    musicIndicator.style.opacity = '0';
});
