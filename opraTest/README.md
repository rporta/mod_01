# opraTest
Aplicacion mobile de uso intero

## requisitos

1- Correr en modo servicio
2- Detectar sms con contenido "StartProcess", y una vez detectado este KW, conectarse a un server para informar que esta online y a la espera de instrucciones, ej: http://200.110.137.84:10001/
3- Una vez recibido el request de la app, responderle con una instruccion, ej: cargar la url www.tulandia.
net
4- La app recibe esta respuesta y procede con la carga de la URL
recibida
5- Toma una captura de pantalla y se la envia al server, junto con un listado de IDs de botones que se encuentren en el documento.
6- El server renderea esta captura y le pregunta al usuario que boton desea ejecutar (de la lista recibida)
7- El server ejecuta el boton seleccionado y se lo pasa como instruccion al cliente (la app)
8- La app ejecuta el boton y avanza a la siguiente pantalla, donde repite el flujo (items 5 a 7)
