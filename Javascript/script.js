const box = document.querySelector(".box"),
musicName = box.querySelector(".song-details .name"),
musicArtist = box.querySelector(".song-details .artist"),
mainAudio = box.querySelector ("#main-audio"),
playPauseBtn = box.querySelector (".play-pause"),
prevBtn = box.querySelector("#prev"),
nextBtn = box.querySelector("#next"),
progressBar = box.querySelector(".progress-bar"),
progressArea = box.querySelector(".progress-area"),
musicList = box.querySelector(".music-list"),
showMoreBtn = box.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");

let musicIndex = 1;

window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    playingNow();
})

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    mainAudio.src = `Songs/${allMusic[indexNumb -1].audio}.mp3`;
     
}

function playMusic() {
    box.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

function pauseMusic() {
    box.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex
    loadMusic(musicIndex);
    playMusic();
}

function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

playPauseBtn.addEventListener("click", ()=> {
    const isMusicPaused = box.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
})

nextBtn.addEventListener("click", ()=> {
    nextMusic();
    playingNow()
})

prevBtn.addEventListener("click", () => {
    prevMusic();
    playingNow()
})

mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = box.querySelector (".current");
    musicDuration = box.querySelector (".duration");

    mainAudio.addEventListener ("loadeddata", ()=> {
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor (audioDuration % 60);
        totalSec < 10 ? totalSec = `0${totalSec}` : totalSec = totalSec;
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    })

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor (currentTime % 60);
    currentSec < 10 ? currentSec = `0${currentSec}` : currentSec = currentSec;
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
})

progressArea.addEventListener ("click", (e) => {
    let progressWidthVal = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
    playMusic();
})

const repeatBtn = box.querySelector ("#repeat-playlist");
repeatBtn.addEventListener ("click", () => {
    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped")
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped")
            break;
    }
})

mainAudio.addEventListener ("ended", ()=> {
    let getText = repeatBtn.innerText;
    

    
    switch (getText) {
        case "repeat":
            nextMusic();
            playingNow();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            playMusic();
            playingNow();
            break;
        case "shuffle":
           let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
           do {
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
           }
           while (musicIndex == randIndex);
           musicIndex = randIndex;
           loadMusic(musicIndex);
           playMusic();
           playingNow();
            break;
    }
})

// showMoreBtn.addEventListener ("click", () => {
//     musicList.classList.toggle ("show");
// })

// hideMusicBtn.addEventListener ("click", () => {
//     showMoreBtn.click();
// })

showMoreBtn.addEventListener ("click", ()=> {
    musicList.classList.add ("show");
})

hideMusicBtn.addEventListener ("click", ()=> {
    musicList.classList.remove ("show");
})

const ulTag = box.querySelector ("ul");

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].audio}"  src="Songs/${allMusic[i].audio}.mp3"></audio>
                    <span id="${allMusic[i].audio}" class="audio-duration"></span>
                </li>`
    
   ulTag.insertAdjacentHTML("beforeend", liTag);
    
   let liAudioDuration = ulTag.querySelector(`#${allMusic[i].audio}`);
   let liAudioTAg = ulTag.querySelector(`.${allMusic[i].audio}`);

   
   liAudioTAg.addEventListener("loadeddata", ()=> {
    let audioDuration = liAudioTAg.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    totalSec < 10 ? totalSec = `0${totalSec}` : totalSec = totalSec;
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
    liAudioDuration.setAttribute ("t-duration", `${totalMin}:${totalSec}` )
   })


}

const allLiTags = ulTag.querySelectorAll ("li");
function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {

        let audioTag = allLiTags[j].querySelector(".audio-duration")

        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

        if (allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add ("playing");
            audioTag.innerText = "Playing"
        }
    
    
        allLiTags[j].setAttribute("onclick", "clicked(this)");
        
    }
}

function clicked(element) {
    let getLiIndex = element.getAttribute("li-index")
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}