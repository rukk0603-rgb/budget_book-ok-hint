'use strict';

{
  const btns = document.querySelectorAll('button:not(#history, #comp)');
  const form = document.getElementById('form');

  const food = document.getElementById('food');
  const trans = document.getElementById('trans');
  const daily = document.getElementById('daily');
  const people = document.getElementById('people');
  const hobby = document.getElementById('hobby');
  const other = document.getElementById('other');

  const foodH = document.getElementById('foodH');
  const transH = document.getElementById('transH');
  const dailyH = document.getElementById('dailyH');
  const peopleH = document.getElementById('peopleH');
  const hobbyH = document.getElementById('hobbyH');
  const otherH = document.getElementById('otherH');

  const history = document.getElementById('history');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  let selectedType = '';
  const comp = document.getElementById('comp');

  function saveHistory() {
    const dl = document.querySelector('dl')
    localStorage.setItem("userMoney", dl.innerHTML);
  };

  function loadHistory() {
    const saved = localStorage.getItem("userMoney");
    if (saved) {
      document.querySelector("dl").innerHTML = saved;
      const dds = document.querySelectorAll('dd');
      dds.forEach(dd => {
        dd.addEventListener('click', () => {
          if (confirm('削除しますか？')) {
            dd.remove();
            saveHistory();
          }
        });
      });
    }
  }

  loadHistory();

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedType = btn.id;
      form.classList.add('show');
      kind.value = '';
      amount.value = '';
    });
  });

  comp.addEventListener('click', () => {
    const kindValue = kind.value.trim() || "未設定";
    const amountValue = amount.value.trim();
    form.classList.remove('show');
    if (!amountValue) return;

    const dd = document.createElement('dd');
    dd.textContent = `${kindValue} : ${amountValue}円`;
    dd.addEventListener('click', () => {
          if (confirm('削除しますか？')) {
            dd.remove();
            saveHistory();
          }
        });

    switch (selectedType) {
      case "food": foodH.appendChild(dd); break;
      case "trans": transH.appendChild(dd); break;
      case "daily": dailyH.appendChild(dd); break;
      case "people": peopleH.appendChild(dd); break;
      case "hobby": hobbyH.appendChild(dd); break;
      case "other": otherH.appendChild(dd); break;
    }

    kind.value = "";
    amount.value = "";
    form.classList.add('hidden');

    saveHistory();
  });




  history.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  });
}