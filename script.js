(() => {
  const $ = (s) => document.querySelector(s);
  const screens = ["home","game","scan","result"];
  const powers = [1,2,4,8,16,32];
  let current = 0;
  let selected = [];
  let soundOn = true;
  let audioCtx;

  function show(name){
    screens.forEach(id => $("#" + id).classList.toggle("active", id === name));
    window.scrollTo({top:0, behavior:"smooth"});
  }

  function beep(freq=520, duration=.08, type="sine"){
    if(!soundOn) return;
    try{
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.type = type; osc.frequency.value = freq;
      gain.gain.setValueAtTime(.0001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.04, audioCtx.currentTime + .01);
      gain.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + duration);
      osc.connect(gain).connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + duration + .02);
    }catch{}
  }

  function shuffle(arr){
    const a = [...arr];
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
    return a;
  }

  function renderCard(){
    const power = powers[current];
    $("#cardPower").textContent = `CARD ${String(current+1).padStart(2,"0")}`;
    $("#cardHint").textContent = current === 0 ? "START HERE" : "LOOK CLOSELY";
    $("#progressLabel").textContent = `${String(current+1).padStart(2,"0")} / 06`;
    $("#progressBar").style.width = `${((current+1)/6)*100}%`;

    const values = [];
    for(let n=1;n<=63;n++) if(n & power) values.push(n);
    const shuffled = shuffle(values);

    const box = $("#numbers"); box.innerHTML = "";
    shuffled.forEach((n,i)=>{
      const el=document.createElement("span");
      el.className="num"; el.textContent=n; el.style.animationDelay=`${Math.min(i*0.015,.4)}s`;
      box.appendChild(el);
    });
  }

  function startGame(){
    current=0; selected=[]; renderCard(); show("game"); beep(620,.08);
  }

  function answer(yes){
    if(yes) selected.push(powers[current]);
    beep(yes?740:360,.07,yes?"triangle":"square");
    if(current < 5){
      current++; renderCard();
    }else{
      startScan();
    }
  }

  function startScan(){
    show("scan");
    const bar=$("#scanBar");
    bar.style.transition="none"; bar.style.width="0%";
    requestAnimationFrame(()=>requestAnimationFrame(()=>{bar.style.transition="width 1.8s ease"; bar.style.width="100%"}));
    const texts=["Reading the pattern you selected.","Mapping each card to a binary value.","Summing the selected powers of two.","Finalizing the prediction…"];
    let idx=0; $("#scanText").textContent=texts[0];
    const timer=setInterval(()=>{idx++; if(idx<texts.length) $("#scanText").textContent=texts[idx]},450);
    setTimeout(()=>{clearInterval(timer); finish()},2000);
  }

  function finish(){
    const age = selected.reduce((a,b)=>a+b,0);
    $("#ageResult").textContent = age;
    $("#ageText").textContent = age;
    const selectedTerms = selected.length ? selected.join(" + ") : "0";
    $("#equation").textContent = `${selectedTerms} = ${age}`;
    show("result");
    [660,880,1100].forEach((f,i)=>setTimeout(()=>beep(f,.11,"triangle"),i*100));
  }

  async function shareResult(){
    const age=$("#ageResult").textContent;
    const text=`MindLab guessed my age: ${age}. Can it guess yours?`;
    try{
      if(navigator.share){await navigator.share({title:"MindLab",text});}
      else {await navigator.clipboard.writeText(text); toast("Result copied to clipboard.");}
    }catch{}
  }

  function toast(msg){
    const t=$("#toast"); t.textContent=msg; t.classList.add("show");
    setTimeout(()=>t.classList.remove("show"),2200);
  }

  $("#startBtn").addEventListener("click",startGame);
  $("#yesBtn").addEventListener("click",()=>answer(true));
  $("#noBtn").addEventListener("click",()=>answer(false));
  $("#againBtn").addEventListener("click",startGame);
  $("#shareBtn").addEventListener("click",shareResult);
  $("#howBtn").addEventListener("click",()=>{
    $("#howPanel").classList.toggle("hidden");
    beep(500,.06);
  });
  $("#soundBtn").addEventListener("click",()=>{
    soundOn=!soundOn; $("#soundBtn").textContent=soundOn?"🔊":"🔇"; toast(soundOn?"Sound on":"Sound off"); if(soundOn) beep();
  });
})();