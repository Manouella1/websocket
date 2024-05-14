const socket = io();

const formUser = document.querySelector("#formUser");
const inputUser = document.querySelector("#inputUser");
const messages = document.querySelector("#messages");
const formMessage = document.querySelector("#formMessage");
const inputMessage = document.querySelector("#inputMessage");
const userContianer = document.querySelector("#userContainer");

let myUser;

formUser.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("hej1");
  myUser = inputUser.value;
  userContainer.innerHTML = "<h2>Welcome " + myUser + "</h2>";
  document.getElementById("user").style.display = "none";
  document.getElementById("dice").style.display = "block"; // Add a dice throw section i HTML
});

document
  .getElementById("diceThrowButton")
  .addEventListener("click", function () {
    const diceThrow = Math.floor(Math.random() * 6 + 1);
    if (myUser) {
      // Ensure user is set before emitting
      console.log("Dice throw:", diceThrow);
      socket.emit("diceThrow", { user: myUser, dice: diceThrow });
    } else {
      console.error("User not set");
    }
  });

socket.on("diceUpdate", function (message) {
  let item = document.createElement("li");
  item.textContent = message;
  messages.appendChild(item);
});

formMessage.addEventListener("submit", function (e) {
  e.preventDefault();
  if (inputMessage.value) {
    socket.emit("chatMessage", { user: myUser, message: inputMessage.value });
    inputMessage.value = "";
  }
});

socket.on("newChatMessage", function (msg) {
  let item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
});
