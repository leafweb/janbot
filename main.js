const main = document.querySelector("main");
const text = document.querySelector("#user-text");
const send = document.querySelector("#send");
const status = document.querySelector("#status");
const name = document.querySelector("#name");
const theme = document.querySelector("#theme");
const startPage = document.querySelector("#start-alert");
const robotSound = "sound/bell.ogg";
const meSound = "sound/bubble.wav";
const version = document.querySelector("#version")
const v = "2.3";
version.innerHTML = "V" + v;

function setHistory() {
   const histiry = localStorage.getItem("histiry");
   localStorage.setItem("histiry", main.innerHTML);
}
function getHistory() {
   const histiry = localStorage.getItem("histiry");
   main.innerHTML = histiry;
}
function clearHistory(tx) {
   main.innerHTML = '<div class="user-div"><div class="user-message">' + tx + '</div></div>';
   setHistory();
}
function scroll() {
   main.scrollTop = main.scrollHeight;
}
function play(url) {
   var audio = new Audio(url);
   audio.play()
}
function writing(read,delay) {
   setTimeout(() => {
      status.innerHTML = 'درحال نوشتن';
   }, read);
   setTimeout(() => {
      status.innerHTML = 'جان بات';
   }, read + delay);
   
}
function setTheme(tx) {
   var theme = document.querySelector("#theme");
   localStorage.setItem('theme', tx);
   theme.setAttribute('href', 'theme/' + tx + '.css')
}
function getTheme(tx) {
   if (localStorage.getItem('theme') == undefined) {
      localStorage.setItem('theme', 'light');
   } else {
      theme.setAttribute('href', 'theme/' + localStorage.getItem('theme') + '.css');
   }
}
function removeSpaces(tx) {
   return tx.replace(/\s/g, '');
}
function menu(){
   meMessage('منو');
}
function start(){
   if (navigator.onLine) {
      fetch('https://leafweb.github.io/janbot/brain.json')
         .then(x => x.json())
         .then(y => {
            startPage.style.animation = 'start 1s 3s both';
         }).catch(error => {
            setTimeout(()=>{
               name.innerHTML = 'شما آفلاین هستید!';
               version.innerHTML = 'لطفا از اتصال خود مطمئن شوید';
            },3000)
         })
   } else {
      name.innerHTML = 'شما آفلاین هستید!';
      version.innerHTML = 'لطفا از اتصال خود مطمئن شوید'
   }
}
if (localStorage.getItem('programmerMod') == undefined) {
   localStorage.setItem('programmerMod', 'off');
}

getHistory();
getTheme();
scroll();
start();
window.ononline = ()=>{
   start();
}

function meMessage(tx) {
   var msDiv = document.createElement("div");
   var msText = document.createElement("div");
   main.appendChild(msDiv);
   msDiv.appendChild(msText);
   msDiv.className = "user-div";
   msText.className = "user-message";
   msText.innerText = tx;
   play(meSound);
   robotMessage(tx, 1000, 2000);
   scroll()
   setHistory();
}
function robotMessage(tx, read, delay) {
   var msDiv = document.createElement("div");
   var msText = document.createElement("div");
   msDiv.className = "robot-div";
   msText.className = "robot-message";
   msText.innerHTML = '•••';
   if (localStorage.getItem('programmerMod') == 'on') {
      try {
         msText.innerHTML = eval(tx);
      } catch (error) {
         msText.innerHTML = 'Error';
         setTimeout(() => { errorMessage(error.neme + '<br>' + error.message) }, read + delay + delay)
      }
   } else {
   fetch('https://leafweb.github.io/janbot/brain.json')
      .then(x => x.json())
      .then(data => {
         let brain = data;
         let aboutBrain = brain.about;
         let brainNotFound = brain.notFound;
         let wordSum = brain.sum;
         let wordBrain = brain.word;
         let replaceBrine = brain.replace;
         //sum
         function sum2(a, b) {
            var newMs = [];
            var newRe = [];
            var a1 = wordBrain[Number(a)].ms;
            var a2 = wordBrain[Number(b)].ms;
            for (x in a1) {
               for (y in a2) {
                  newMs.push(a1[x] + a2[y])
               }
            }
            var a1 = wordBrain[Number(a)].re;
            var a2 = wordBrain[Number(b)].re;
            for (x in a1) {
               for (y in a2) {
                  newRe.push(a1[x] + " " + a2[y])
               }
            }
            wordBrain.push({ ms: newMs, re: newRe })
         }
         function sum3(a, b, c) {
            var newMs = [];
            var newRe = [];
            var a1 = wordBrain[a].ms;
            var a2 = wordBrain[b].ms;
            var a3 = wordBrain[c].ms;
            for (x in a1) {
               for (y in a2) {
                  for (z in a3) {
                     newMs.push(a1[x] + a2[y] + a3[z])
                  }
               }
            }
            var a1 = wordBrain[a].re;
            var a2 = wordBrain[b].re;
            var a3 = wordBrain[c].re;
            for (x in a1) {
               for (y in a2) {
                  for (z in a3) {
                     newRe.push(a1[x] + " " + a2[y] + " " + a3[z])
                  }
               }
            }
            wordBrain.push({ ms: newMs, re: newRe })
         }
         for (x in wordSum.sum2) {
            sum2(wordSum.sum2[x].a, wordSum.sum2[x].b);
         }
         for (x in wordSum.sum3) {
            sum3(wordSum.sum3[x].a, wordSum.sum3[x].b, wordSum.sum3[x].c);
         }
         //replace
         for (x in replaceBrine) {
            tx = tx.replaceAll(replaceBrine[x].a, replaceBrine[x].b);
         }
         for (x in wordBrain) {
            var reGex = new RegExp(wordBrain[x].ms.join("|"));
            if (reGex.test(removeSpaces(tx.toLowerCase())) === true) {
               //run
               var run = wordBrain[x].run;
               if (run == 'darkMode') {
                  setTheme('dark');
               }
               if (run == 'lightMode') {
                  setTheme('light');
               }
               if (run == 'removeHistory') {
                  clearHistory(tx);
               }
               if (run == 'wikipedia') {
                     for (y in wordBrain[x].ms) {
                        tx = tx.replace(wordBrain[x].ms[y], '');
                     }
                     tx = tx.replaceAll('?', '');
                     tx = tx.replaceAll('؟', '');
                     fetch(`https://fa.wikipedia.org/api/rest_v1/page/summary/${tx}`)
                        .then(response => response.json())
                        .then(data => {
                           summary = data.extract;
                           msText.innerHTML = summary;
                           if (summary.includes('ممکن است به یکی از موارد زیر اشاره داشته باشد') == true) {
                              fetch(`https://fa.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${tx}&origin=*`)
                                 .then(response => response.json())
                                 .then(data => {
                                    var results = data.query.search;
                                    msText.innerHTML = results[0].snippet;
                                 })
                           }
                           if (summary !== undefined) {
                              msText.classList.add('wikipedia');
                              alert()
                           } else {
                              msText.innerHTML = 'نمیدانم';
                           }
                        }).catch(error => {
                           msText.innerHTML = wordBrain[x].re[Math.floor(Math.random() * wordBrain[x].re.length)];
                        })
                  }
               msText.innerHTML = wordBrain[x].re[Math.floor(Math.random() * wordBrain[x].re.length)];
               if (run == 'programmerMod') {
                  if (localStorage.getItem('programmerMod') == 'off') {
                     localStorage.setItem('programmerMod', 'on');
                     msText.innerHTML = 'حالت برنامه نویسی روشن شد';
                  } else {
                     localStorage.setItem('programmerMod', 'off');
                     msText.innerHTML = 'حالت برنامه نویسی خاموش شد';
                  }
               }
            }
         }
         
         if (msText.innerHTML == '•••') {
            fetch(`https://fa.wikipedia.org/api/rest_v1/page/summary/${tx}`)
            .then(response => response.json())
            .then(data => {
               summary = data.extract;
               msText.innerHTML = summary;
               if (summary.includes('ممکن است به یکی از موارد زیر اشاره داشته باشد') == true) {
                  fetch(`https://fa.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${tx}&origin=*`)
                     .then(response => response.json())
                     .then(data => {
                        var results = data.query.search;
                        msText.innerHTML = results[0].snippet;
                     })
               }
               if (summary !== undefined) {
                  msText.classList.add('wikipedia')
               } else {
                  msText.innerHTML = 'منظورتون رو متوجه نشدم';
               }
            }).catch(error => {
               msText.innerHTML = '<i class="fa fa-wifi-slash fa-2x"></i>';
            })
         }
      }).catch(error => {
         msText.innerHTML = '<i class="fa fa-wifi-slash fa-2x"></i>';
      })
   }
   writing(read,delay);
   setTimeout(() => {
      main.appendChild(msDiv);
      msDiv.appendChild(msText);
      scroll();
      play(robotSound);
      setHistory();
   }, delay + read);
}
function errorMessage(tx) {
   var msDiv = document.createElement("div");
   var msText = document.createElement("div");
   main.appendChild(msDiv);
   msDiv.appendChild(msText);
   msDiv.className = "error-div";
   msText.className = "error-message";
   msText.innerHTML = tx;
   play(robotSound);
   scroll();
   setHistory();
}
send.onclick = () => {
   meMessage(text.value);
   text.focus();
   send.classList.remove('show');
   scroll();
   setTimeout(() => {
      scroll();
   }, 500)
}
text.oninput = () => {
   if (text.value !== '') {
      send.classList.add('show');
   } else {
      send.classList.remove('show');
   }
}
text.onclick = () => {
   scroll();
   setTimeout(() => {
      scroll();
   }, 500);
}