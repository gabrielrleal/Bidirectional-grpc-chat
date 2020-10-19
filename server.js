let grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
 
const server = new grpc.Server();
const SERVER_ADDRESS = "0.0.0.0:5001";
 
// carrega o protobuf
let proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("protos/chat.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);
 
let users = [];
 
// Recebe mensagem do joining do client
function join(call, callback) {
  users.push(call);
  notifyChat({ user: "Server", text: "Um novo usuário entrou na sala! " });
}
 
// Recebe mensagem do client
function send(call, callback) {
  notifyChat(call.request);
}
 
// Manda mensagem para todos usuários conectados
function notifyChat(message) {
  users.forEach(user => {
    user.write(message);
  });
}
 
// Define o servidor com os métodos e inicia
server.addService(proto.example.Chat.service, { join: join, send: send });
 
server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
 
server.start();