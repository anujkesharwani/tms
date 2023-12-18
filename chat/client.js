let socket = io()
let btnsend=document.getElementById('btnsend')
let inpmsg=document.getElementById('message-input')
let ulmsglist=document.getElementById('ulmsglist')

btnsend.onclick= function () {
    socket.emit('msgsend',{
        msg:message-input.value
    })
    inpmsg.value
}

socket.on('msgrece',(data) => {
    let linewmsg=document.createElement('li')
    linewmsg.innerText=data.msg
    ulmsglist.appendChild(linewmsg)
})