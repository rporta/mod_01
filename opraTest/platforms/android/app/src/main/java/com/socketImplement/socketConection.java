package com.socketImplement;
import java.io.IOException;
import java.net.Socket;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.InetAddress;

public class socketConection {

    private String ip;
    private int port;
    private Socket socket;
    private ObjectInputStream ois;
    private ObjectOutputStream oos;
    public socketConection(){
        this(null, 0);
    }

    public socketConection (String ip, int port){
        this.ip = ip;
        this.port = port;
    }

    public String getIp() {
        return this.ip;
    }

    public int getPort() {
        return this.port;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public Socket getSocket() {
        return this.socket;
    }

    public void setSocket(Socket socket) {
        this.socket = socket;
    }

    public ObjectInputStream getOis() {
        return this.ois;
    }

    public void generateIos() throws IOException {
        this.ois = new ObjectInputStream(this.getSocket().getInputStream());
    }

    public ObjectOutputStream getOos() {
        return this.oos;
    }

    public void generateOos() throws IOException {
        this.oos = new ObjectOutputStream(this.getSocket().getOutputStream());
    }
    public void init(){
        new Thread(new ClientThread()).start();
    }

    public void initConection() throws IOException {
        if(this.getIp() != null){

            InetAddress serverAddr = InetAddress.getByName(this.getIp());

            this.setSocket(new Socket(serverAddr, this.getPort()));
            this.generateIos();
            this.generateOos();
        }
    }
    public void sendData(String data) throws IOException {
        //write to socket using ObjectOutputStream
        ObjectOutputStream oos = new ObjectOutputStream(this.getSocket().getOutputStream());
        System.out.println(data);
    }
    public String getData() throws IOException, ClassNotFoundException {

        String message = (String) this.getOis().readObject();
        System.out.println("Message: " + message);
        return message;

    }

    public void close() throws IOException {
        this.getOis().close();
        this.getOos().close();
    }
    class ClientThread implements Runnable {

        @Override
        public void run() {
            try {
                initConection();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

}
