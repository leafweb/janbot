const main = document.querySelector("main");
const text = document.querySelector("#user-text");
const send = document.querySelector("#send");
const Status = document.querySelector("#name");
const theme = document.querySelector("#theme");
const robotSound = "sound/bell.ogg";
const meSound = "sound/bubble.wav";
const version = "2";
document.querySelector("#version").innerHTML = "V" + version;

function setHistory() {
   const histiry = localStorage.getItem("histiry");
   localStorage.setItem("histiry", main.innerHTML);
}
function getHistory() {
   const histiry = localStorage.getItem("histiry");
   main.innerHTML = histiry;
}
function clearHistory(tx) {
   main.innerHTML = '<div class="user-div"><div class="user-massage">' + tx + '</div></div>';
   setHistory();
}
function scroll() {
   main.scrollTop = main.scrollHeight;
}
function play(url) {
   var audio = new Audio(url);
   audio.play()
}
function writing(number) {
   setTimeout(() => {
      Status.innerHTML = 'درحال نوشتن';
   }, number)
}
function status() {
   if (navigator.onLine) {
      Status.innerHTML = 'آنلاین'
   } else {
      Status.innerHTML = 'آفلاین'
   }
   window.ononline = () => {
      Status.innerHTML = 'آنلاین';
   }
   window.onoffline = () => {
      Status.innerHTML = 'آفلاین'
   }
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

getHistory();
getTheme();
scroll();
status();
loadBrain();

function meMassage(tx) {
   var msDiv = document.createElement("div");
   var msText = document.createElement("div");
   main.appendChild(msDiv);
   msDiv.appendChild(msText);
   msDiv.className = "user-div";
   msText.className = "user-massage";
   msText.innerText = tx;
   play(meSound);
   robotMassage(tx, 1000, 2000);
   scroll()
   setHistory();
}

function robotMassage(tx, read, delay) {
   var msDiv = document.createElement("div");
   var msText = document.createElement("div");
   msDiv.className = "robot-div";
   msText.className = "robot-massage";
   msText.innerHTML = '•••';

   fetch('brain.json')
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
               msText.innerHTML = wordBrain[x].re[Math.floor(Math.random() * wordBrain[x].re.length)];
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
               if (run == 'menu') {
                  var delay = 3;
               }
               if (run == 'wikipedia') {
                  if (navigator.onLine) {
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
                           if (summary !== undefined) {
                              msText.classList.add('wikipedia')
                           } else {
                              msText.innerHTML = 'نمیدانم';
                           }
                        }).catch(error => {
                           console.log(error.name);
                           msText.innerHTML = '<i class="fa fa-cloud-slash"></i>';
                        })
                  } else {
                     msText.innerHTML = 'من نمیدوانم اطلاعاتی دریافت کنم' + 'br' + 'لطفا به شبکه متصل شویدم'
                  }
               }
            }
         }
         if (msText.innerHTML == '•••') {
            if (navigator.onLine) {
               fetch(`https://fa.wikipedia.org/api/rest_v1/page/summary/${tx}`)
                  .then(response => response.json())
                  .then(data => {
                     summary = data.extract;
                     msText.innerHTML = summary;
                     if (summary !== undefined) {
                        msText.classList.add('wikipedia')
                     } else {
                        msText.innerHTML = 'نمیدانم';
                     }
                  }).catch(error => {
                     msText.innerHTML = '<i class="fa fa-wifi-slash"></i>';
                  })
            } else {
               msText.innerHTML = brainNotFound[Math.floor(Math.random() * brainNotFound.length)] + '<br>';
               msText.innerHTML += 'برای اطلاعات بیشتر به شبکه متصل شوید'
            }
         }
      })
   writing(delay);
   setTimeout(() => {
      main.appendChild(msDiv);
      msDiv.appendChild(msText);
      scroll();
      play(robotSound);
      status();
      setHistory();
   }, delay + read);
}

send.onclick = () => {
   meMassage(text.value);
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