(function(){
  function v(id){var n=parseFloat(document.getElementById(id).value);return isFinite(n)&&n>0?n:0;}
  function pct(id){return Math.min(v(id),100)/100;}
  function money(n){return '$'+Math.round(n).toLocaleString('en-US');}
  function calc(){
    var calls=v('calls'),miss=pct('miss'),close=pct('close'),job=v('job'),noback=pct('noback');
    var lostCallsWk=calls*miss*noback;
    var yearly=calls*miss*close*job*52*noback;
    document.getElementById('outYear').textContent=money(yearly);
    document.getElementById('outMonth').textContent=money(yearly/12);
    document.getElementById('outDetail').textContent='About '+(Math.round(lostCallsWk*10)/10)+' lost callers a week, or roughly '+(Math.round(lostCallsWk*close*52))+' lost jobs a year.';
    return yearly;
  }
  window.mccCalc=calc;
  document.getElementById('calcForm').addEventListener('input',calc);
  calc();
})();
