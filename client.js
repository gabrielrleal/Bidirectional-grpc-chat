//código feito com intuito de estudo tendo em como referencia o tutorial da https://techblog.fexcofts.com/
let grpc = require('grpc')
var protoLoader = require('@grpc/proto-loader')
var readline = require('readline')

//Le linhas do terminal
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

//Carrega o protobuf
var proto = grpc.loadPackageDefinition(
  protoLoader.loadSync('protos/chat.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
)

const REMOTE_SERVER = '0.0.0.0:5001'

let username

//Cria um gRPC client
let client = new proto.example.Chat(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
)

//Inicia a stream entre server e client
function startChat () {
  let channel = client.join({ user: username })

  channel.on('data', onData)

  rl.on('line', function (text) {
    client.send({ user: username, text: text }, res => {})
  })
}

//quando servidor manda a menssagem
function onData (message) {
  if (message.user == username) {
    return
  }
  console.log(`${message.user}: ${message.text}`)
}

//pede ao usuario o nome e inicia o chat
rl.question('Bem vindo ao chat! Qual seu username? ', answer => {
  username = answer

  startChat()
})
