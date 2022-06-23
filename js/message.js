let content = document.getElementById('last');
let timer;

// Toggle show/hide classes on test content
async function hide() {
  content.className = "hidden";
  disegnaLand = false;
  clearTimeout(timer);

  await login();  

  checkWallet();
}

function showMessage(msg) {
  content.className = "visible";
  document.getElementById('text').textContent = "";
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

const welcome = `Welcome to DC3Land! Use arrows to move, collect the 9 crystals to claim a land, if it's a lucky land you'll get 100 extra Tokens!
                 For each crystal you'll get a Token, see the transaction on mumbai.polygonscan!
                 See your Land NFT data by clicking on the image!
                 Enjoy! :)`




