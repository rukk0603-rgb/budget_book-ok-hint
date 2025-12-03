'use strict';

{
  const btns = document.querySelectorAll('button:not(#reset, #history, #comp)');
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

  const kind = document.getElementById('kind');
  const amount = document.getElementById('amount');
  const aim = document.getElementById('aim');
  let aimInput = document.getElementById('aimInput');
  
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
            showExpenditure();
            saveHistory();
          }
        });
      });
    }
  }

  function showExpenditure() {
    const dds = document.querySelectorAll('dd');
    let totalExp = 0;
    dds.forEach(dd => {
      const text = dd.textContent.trim();
      const m = text.match(/([0-9,]+)\s*円/);
      if (m) {
        const price = Number(m[1].replace(/,/g, ''));
        if (!isNaN(price)) totalExp += price;
      }
    });
    const todayExp = document.getElementById('todayExp');
    todayExp.innerHTML = '';
    const renderExp = document.createElement('h3');
    renderExp.textContent = totalExp.toLocaleString() + "円";
    todayExp.appendChild(renderExp);
  }

  function createTargetHeading(value) {
    const h3 = document.createElement('h3');
    h3.id = 'targetAmount';
    h3.textContent = Number(value).toLocaleString() + '円';
    h3.addEventListener('click', () => {
      // クリックで編集用入力に戻す
      replaceWithInput(value);
    });
    return h3;
  }

  function replaceWithHeading(value) {
    // remove input if present
    const existingInput = document.getElementById('aimInput');
    if (existingInput && existingInput.parentElement) existingInput.parentElement.removeChild(existingInput);
    // remove existing heading
    const existingH = document.getElementById('targetAmount');
    if (existingH && existingH.parentElement) existingH.parentElement.removeChild(existingH);
    const h3 = createTargetHeading(value);
    if (aim) aim.appendChild(h3);
  }

  function replaceWithInput(prefill) {
    const existingH = document.getElementById('targetAmount');
    if (existingH && existingH.parentElement) existingH.parentElement.removeChild(existingH);
    const input = document.createElement('input');
    input.className = 'inFoot';
    input.type = 'number';
    input.id = 'aimInput';
    input.placeholder = '目標金額を入力';
    if (prefill) input.value = prefill;
    if (aim) aim.appendChild(input);
    aimInput = document.getElementById('aimInput');
    if (aimInput) {
      aimInput.focus();
      aimInput.addEventListener('change', handleAimInputChange);
      aimInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') aimInput.blur(); });
    }
  }

  function handleAimInputChange(e) {
    const raw = e.target.value.toString().replace(/,/g, '').trim();
    if (raw === '') {
      localStorage.removeItem('targetAmount');
      // show 未設定 heading
      const existingInput = document.getElementById('aimInput');
      if (existingInput && existingInput.parentElement) existingInput.parentElement.removeChild(existingInput);
      const h3 = document.createElement('h3');
      h3.id = 'targetAmount';
      h3.textContent = '未設定';
      h3.addEventListener('click', () => replaceWithInput(''));
      if (aim) aim.appendChild(h3);
      return;
    }
    if (!/^\d+$/.test(raw)) {
      alert('数字を入力してください');
      return;
    }
    localStorage.setItem('targetAmount', raw);
    replaceWithHeading(raw);
  }

  function resetAll() {
    const reset = document.getElementById('reset');
    reset.addEventListener('click', () => {
      if (confirm('リセットします')) {
        localStorage.clear();
        location.reload();
      }
  });
  }

  loadHistory();
  showExpenditure();

  // 初期化: ローカルストレージに既に目標があれば入力欄を削除して h3 を表示
  const stored = localStorage.getItem('targetAmount');
  if (stored && /^\d+$/.test(stored)) {
    replaceWithHeading(stored);
  } else {
    // 入力欄が存在するなら change handler をセット
    aimInput = document.getElementById('aimInput');
    if (aimInput) {
      aimInput.addEventListener('change', handleAimInputChange);
      aimInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') aimInput.blur(); });
    }
  }

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
    if (!amountValue) return;
    if (!selectedType) {
      alert('カテゴリを選択してください');
      return;
    }
    form.classList.remove('show');

    const dd = document.createElement('dd');
    dd.textContent = `${kindValue} : ${amountValue}円`;
    const targetDt = document.getElementById(selectedType + 'H');
    if (targetDt && targetDt.parentElement && targetDt.parentElement.tagName.toLowerCase() === 'dl') {
      targetDt.insertAdjacentElement('afterend', dd);
    } else {
      document.querySelector('dl').appendChild(dd);
    }
    dd.addEventListener('click', () => {
      if (confirm('削除しますか？')) {
        dd.remove();
        showExpenditure();
        saveHistory();
      }
    });

    kind.value = "";
    amount.value = "";
    form.classList.add('hidden');

    showExpenditure();
    saveHistory();
  });


  resetAll();


  history.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  });
}