'use strict';

var usernamePage = document.querySelector('#user');
var chatPage = document.querySelector('#chat');
var usernameForm = document.querySelector('#userForm');
var sendButton = document.querySelector('#sendButton');
var messageInput = document.querySelector('#messageInput');
var messageArea = document.querySelector('#messages');

var stompClient = null;
var username = null;


function connect(event) {
    username = document.querySelector('#usernameInput').value.trim();

    if (username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}


function onConnected() {

    stompClient.subscribe('/topic/public', onMessageReceived);

    stompClient.send("/chat/chat.newUser",
        {},
        JSON.stringify({user: username, text: 'user ' + username + ' connected to chat'})
    )

}


function onError(error) {
    console.log('Could not connect to WebSocket server. Please refresh this page to try again!')
}


function sendMessage(event) {
    var messageContent = messageInput.value.trim();

    if (messageContent && stompClient) {
        var chatMessage = {
            user: username,
            text: messageInput.value,
        };

        stompClient.send("/chat/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);


    let messageEl = document.createElement('li')
    messageEl.classList.add('message', 'appeared')
    if (message.user === username) {
        messageEl.classList.add('right')
    } else {
        messageEl.classList.add('left')
    }
    messageEl.innerHTML = "<div class=\"avatar\"> </div>\n" +
        "    <div class=\"text_wrapper\">\n" +
        "        <div class=\"text\">" + message.text + "</div>\n" +
        "    </div>"
    messageArea.appendChild(messageEl);
    messageArea.scrollTop = messageArea.scrollHeight;
}


usernameForm.addEventListener('submit', connect, true)
sendButton.addEventListener('click', sendMessage, true)