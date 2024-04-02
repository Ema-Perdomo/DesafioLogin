/*const socket = io() //En socket declaro un nuevo cliente de socket.io



socket.emit('movimiento', 'Ca7') //Envio un mensaje al servidor (Ca7 caballo a 7)

socket.emit('rendirse', "Me he rendido") //RENDIRSE O RENDICION??


//Espero recibir desde el servidor los mensajes
socket.on('mensaje-jugador', info => {  
    console.log(info)
})

socket.on('rendicion', info => {  
    console.log(info)
})
*/

//Aplicacion Chat
const socket = io()

const chatBox = document.getElementById('chatBox')
const messageLogs = document.getElementById('messageLogs')
let user

swal.fire({
    title : "Inicio de sesión",
    input: 'text',
    text: 'Ingrese su nombre de usuario para continuar',
    inputPlaceholder: 'Nombre de usuario',
    inputValidator: (value) => {
        return !value && 'Ingrese un nombre de usuario válido'
    },
    allowOutsideClick: false,
}).then(resultado => {
    user= resultado.value
    console.log(user)
})

checkBox.addEventListener('keyup', (e) => {
    if(e.key === 'Enter'){
        //trim() elimina los espacios en blanco, el if se fija si el mensaje tiene contenido
        if (checkBox.value.trim().length > 0){ 
            socket.emit('mensaje', { usuario: user, mensaje: chatBox.value, hora: new Date().toLocaleTimeString()})
            chatBox.value = '' //Limpio el chatBox
        } 
    }
})

socket.on('mensajeLogs', info => {
    messageLogs.innerHTML = ''
    info.forEach(mensaje => {
        messageLogs.innerHTML += `<p><strong>${mensaje.usuario} dice: </strong>: ${mensaje.mensaje}. ${mensaje.hora}</p>`
    });
})