let content = document.getElementById('last');
let timer;

// Toggle show/hide classes on test content
function hide() {
  content.className = "hidden";
  disegnaLand = false;
  clearTimeout(timer);

  login();
}

function showMessage(msg) {
  content.className = "visible";
  let elem = document.getElementById('text');
  elem.textContent = "";
  // var text = '{Welcome!<br>{Use your keyboard /\n/\rarrow /r/nnto move! {Welcome!<br>{Use your keyboard \\narrow /nto move! {Welcome!<br>{Use your keyboard \\narrow /'
  let curr = 0;
  function write() {
    let elem = document.getElementById('text');
    elem.textContent = elem.textContent + msg.charAt(curr);
    curr++;
    if (curr < msg.length)
      timer = window.setTimeout(write, 60);
  };
  setTimeout(() => { write(); }, 1000);
}

const welcome = `{Welcome! 
                 {Use your keyboard arrow to move!
                  {Welcome! 
                    {Use your keyboard arrow to move!
                      {Welcome! 
                        {Use your keyboard arrow to move!`
showMessage(welcome);



